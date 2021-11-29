import { Scene, Display } from 'phaser';

// Store
import store from '../../redux/store';

// Actions
import addLoadedFontAction from '../../redux/actions/addLoadedFontAction';
import addLoadedAtlasAction from '../../redux/actions/addLoadedAtlasAction';
import addLoadedImageAction from '../../redux/actions/addLoadedImageAction';
import addLoadedMapAction from '../../redux/actions/addLoadedMapAction';
import addLoadedJSONAction from '../../redux/actions/addLoadedJSONAction';
import addTilesetAction from '../../redux/actions/addTilesetAction';

// Selectors
import {
    selectLoadedAtlases,
    selectLoadedImages,
    selectLoadedFonts,
    selectLoadedJSONs,
    selectLoadedMaps,
} from '../../redux/selectors/selectLoadedAssets';

// Utils
import {
    asyncLoader,
    isMapFileAvailable,
    isImageFileAvailable,
    isTilesetFileAvailable,
    isGeneratedAtlasFileAvailable,
} from '../../utils/utils';

// Constants
import {
    KEY,
    COIN,
    ENEMY,
    HEART,
    CRYSTAL,
    KEY_SPRITE_NAME,
    COIN_SPRITE_NAME,
    IGNORED_TILESETS,
    ENEMY_SPRITE_NAME,
    HEART_SPRITE_NAME,
    CRYSTAL_SPRITE_NAME,
} from '../../constants';

export default class LoadAssetsScene extends Scene {
    constructor() {
        super('LoadAssetsScene');
    }

    init(initData) {
        this.initData = initData;
    }

    async create() {
        const {
            fonts = [],
            atlases = [],
            images = [],
            mapKey = '',
        } = this.initData?.assets || {};

        const { getState, dispatch } = store;
        const state = getState();

        // Pre-load all the fonts needed for the scene
        // so Phaser can render them properly
        let newFontsCount = 0;
        fonts?.forEach((font) => {
            const loadedFonts = selectLoadedFonts(state);

            // If a font is already loaded, then skip this
            if (loadedFonts.includes(font)) {
                return;
            }

            // Set font as already loaded in the redux store
            dispatch(addLoadedFontAction(font));
            newFontsCount += 1;
            const color = this.game.config.backgroundColor;
            this.add.text(
                0,
                0,
                '',
                {
                    fontFamily: font,
                    color: Display.Color.RGBToString(color.r, color.g, color.b, color.a),
                }
            );
        });

        const loadedAtlases = selectLoadedAtlases(state);
        const loadedImages = selectLoadedImages(state);
        const loadedMaps = selectLoadedMaps(state);
        // Load the Tiled map needed for the next scene
        if (
            mapKey
            && !loadedMaps.includes(mapKey)
            && isMapFileAvailable(`${mapKey}.json`)
        ) {
            const { default: mapJson } = await import(`../../assets/maps/${mapKey}.json`);
            const tilesets = mapJson.tilesets.map((tileset) =>
                // the string will be something like "../tilesets/village.json" or "../tilesets/village.png"
                tileset.source?.split('/').pop().split('.')[0] || tileset.image?.split('/').pop().split('.')[0]);

            // Load objects assets
            const objectLayers = mapJson.layers.filter((layer) => layer.type === 'objectgroup');
            objectLayers.forEach((layer) => {
                layer.objects.forEach(async (object) => {
                    const { gid, properties } = object;
                    switch (gid) {
                        case ENEMY: {
                            if (
                                isGeneratedAtlasFileAvailable(`${ENEMY_SPRITE_NAME}.json`)
                                && isGeneratedAtlasFileAvailable(`${ENEMY_SPRITE_NAME}.png`)
                                && !loadedAtlases.includes(ENEMY_SPRITE_NAME)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: jsonPath } =
                                    await import(`../../assets/atlases/generated/${ENEMY_SPRITE_NAME}.json`);
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`../../assets/atlases/generated/${ENEMY_SPRITE_NAME}.png`);

                                dispatch(addLoadedAtlasAction(ENEMY_SPRITE_NAME));
                                await asyncLoader(this.load.atlas(ENEMY_SPRITE_NAME, imagePath, jsonPath));
                            }

                            break;
                        }
                        case COIN: {
                            if (
                                isGeneratedAtlasFileAvailable(`${COIN_SPRITE_NAME}.json`)
                                && isGeneratedAtlasFileAvailable(`${COIN_SPRITE_NAME}.png`)
                            && !loadedAtlases.includes(COIN_SPRITE_NAME)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: jsonPath } =
                                    await import(`../../assets/atlases/generated/${COIN_SPRITE_NAME}.json`);
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`../../assets/atlases/generated/${COIN_SPRITE_NAME}.png`);

                                dispatch(addLoadedAtlasAction(COIN_SPRITE_NAME));
                                await asyncLoader(this.load.atlas(COIN_SPRITE_NAME, imagePath, jsonPath));
                            }

                            break;
                        }
                        case HEART: {
                            if (
                                isImageFileAvailable('heart_full.png')
                                && !loadedImages.includes(HEART_SPRITE_NAME)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } = await import('../../assets/images/heart_full.png'); // `../../assets/images/${HEART_SPRITE_NAME}.png`

                                dispatch(addLoadedImageAction(HEART_SPRITE_NAME));
                                await asyncLoader(this.load.image(HEART_SPRITE_NAME, imagePath));
                            }

                            break;
                        }
                        case CRYSTAL: {
                            if (
                                isImageFileAvailable(`${CRYSTAL_SPRITE_NAME}.png`)
                                && !loadedImages.includes(CRYSTAL_SPRITE_NAME)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`../../assets/images/${CRYSTAL_SPRITE_NAME}.png`);

                                dispatch(addLoadedImageAction(CRYSTAL_SPRITE_NAME));
                                await asyncLoader(this.load.image(CRYSTAL_SPRITE_NAME, imagePath));
                            }

                            break;
                        }
                        case KEY: {
                            if (
                                isImageFileAvailable(`${CRYSTAL_SPRITE_NAME}.png`)
                                && !loadedImages.includes(KEY_SPRITE_NAME)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`../../assets/images/${KEY_SPRITE_NAME}.png`);

                                dispatch(addLoadedImageAction(KEY_SPRITE_NAME));
                                await asyncLoader(this.load.image(KEY_SPRITE_NAME, imagePath));
                            }

                            break;
                        }
                        default: {
                            break;
                        }
                    }

                    properties?.forEach((property) => {
                        // TODO
                        const { name, type, value } = property;
                    });
                });
            });

            const loadedJSONs = selectLoadedJSONs(state);
            // eslint-disable-next-line no-restricted-syntax
            for (const tilesetName of tilesets) {
                if (tilesetName && !IGNORED_TILESETS.includes(tilesetName)) {
                    let tilesetJson = {};
                    if (!loadedJSONs.includes(tilesetName) && isTilesetFileAvailable(`${tilesetName}.json`)) {
                        // eslint-disable-next-line no-await-in-loop
                        const { default: jsonResult } = await import(`../../assets/tilesets/${tilesetName}.json`);
                        tilesetJson = jsonResult;

                        dispatch(addLoadedJSONAction(tilesetName));
                        // eslint-disable-next-line no-await-in-loop
                        await asyncLoader(this.load.json(tilesetName, tilesetJson));
                    } else {
                        tilesetJson = this.cache.json.get(tilesetName);
                    }

                    if (!loadedImages.includes(tilesetName) && isTilesetFileAvailable(tilesetJson.image)) {
                        // eslint-disable-next-line no-await-in-loop
                        const { default: tilesetImage } = await import(`../../assets/tilesets/${tilesetJson.image}`);

                        dispatch(addLoadedImageAction(tilesetName));
                        // eslint-disable-next-line no-await-in-loop
                        await asyncLoader(this.load.image(tilesetName, tilesetImage));
                    }

                    mapJson.tilesets = mapJson.tilesets
                        .filter(
                            (tileset) => !IGNORED_TILESETS.includes(tileset.source?.split('/')?.pop()?.split('.')?.[0])
                        ).map((tileset) => {
                            if (tileset.source?.includes(`/${tilesetName}.json`)) {
                                const imageExtension = tilesetJson.image.split('.').pop();
                                const imagePath = tileset.source.replace('.json', `.${imageExtension}`);
                                // eslint-disable-next-line no-param-reassign
                                delete tileset.source;

                                return {
                                    ...tileset,
                                    ...tilesetJson,
                                    image: imagePath, // not really necessary but why not
                                };
                            }

                            return tileset;
                        });

                    dispatch(addTilesetAction(tilesetName));
                }
            }

            dispatch(addLoadedMapAction(mapKey));
            // Load map with pre-loaded tilesets
            await asyncLoader(this.load.tilemapTiledJSON(mapKey, mapJson));
        }

        // Load all the atlases needed for the next scene
        // eslint-disable-next-line no-restricted-syntax
        for (const atlas of atlases) {
            if (
                !isGeneratedAtlasFileAvailable(`${atlas}.json`)
                || loadedAtlases.includes(atlas)
            ) {
                // eslint-disable-next-line no-continue
                continue;
            }

            // eslint-disable-next-line no-await-in-loop
            const { default: jsonPath } = await import(`../../assets/atlases/generated/${atlas}.json`);
            const imageName = jsonPath.textures.find((texture) => texture.image.includes(atlas)).image;
            if (!imageName || !isGeneratedAtlasFileAvailable(imageName)) {
                // eslint-disable-next-line no-continue
                continue;
            }

            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`../../assets/atlases/generated/${imageName}`);

            dispatch(addLoadedAtlasAction(atlas));
            // eslint-disable-next-line no-await-in-loop
            await asyncLoader(this.load.atlas(atlas, imagePath, jsonPath));
        }

        // Load all the images needed for the next scene
        // eslint-disable-next-line no-restricted-syntax
        for (const image of images) {
            if (
                isImageFileAvailable(`${image}.png`)
                || loadedImages.includes(image)
            ) {
                // eslint-disable-next-line no-continue
                continue;
            }

            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`../../assets/images/${image}.png`);

            dispatch(addLoadedImageAction(image));
            // eslint-disable-next-line no-await-in-loop
            await asyncLoader(this.load.image(image, imagePath));
        }

        // If we have fonts, then wait for them to be loaded before calling the next scene...
        if (newFontsCount > 0) {
            document.fonts.ready.then((fontFace) => {
                this.scene.start(
                    this.initData.nextScene
                );
            });
        } else {
            // ... otherwise just call the next scene already
            this.scene.start(
                this.initData.nextScene
            );
        }
    }
}
