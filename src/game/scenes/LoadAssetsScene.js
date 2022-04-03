import { Scene, Display } from 'phaser';

// Actions
import addLoadedFontAction from '../../redux/actions/loadedAssets/addLoadedFontAction';
import addLoadedAtlasAction from '../../redux/actions/loadedAssets/addLoadedAtlasAction';
import addLoadedImageAction from '../../redux/actions/loadedAssets/addLoadedImageAction';
import addLoadedMapAction from '../../redux/actions/loadedAssets/addLoadedMapAction';
import addLoadedJSONAction from '../../redux/actions/loadedAssets/addLoadedJSONAction';
import addTilesetAction from '../../redux/actions/mapData/addTilesetAction';

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
    getState,
    getDispatch,
    isMapFileAvailable,
    isImageFileAvailable,
    isTilesetFileAvailable,
    isGeneratedAtlasFileAvailable,
} from '../../utils/utils';
import { asyncLoader } from '../../utils/phaser';

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
        const { width: gameWidth, height: gameHeight } = this.cameras.main;
        const {
            fonts = [],
            atlases = [],
            images = [],
            mapKey = '',
        } = this.initData?.assets || {};

        const dispatch = getDispatch();
        const state = getState();
        const loadedFonts = selectLoadedFonts(state);

        // setup loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        const barWidth = Math.round(gameWidth * 0.6);
        const handleBarProgress = (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xFFFFFF, 1);
            progressBox.fillRect(
                (gameWidth - barWidth) / 2,
                gameHeight - 80,
                barWidth * value,
                20
            );
        };

        this.load.on('progress', handleBarProgress);

        this.load.on('fileprogress', (file) => {
            console.log(file.key);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();

            this.load.off('progress');
            this.load.off('fileprogress');
            this.load.off('complete');
        });

        // Pre-load all the fonts needed for the scene
        // so Phaser can render them properly
        let newFontsCount = 0;
        fonts?.forEach((font, idx) => {
            // If a font is already loaded, then skip this
            if (loadedFonts.includes(font)) {
                return;
            }

            if (!mapKey && atlases.length === 0 && images.length === 0) {
                handleBarProgress(fonts.length - (fonts.length - (idx + 1)));
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
                            // for some reason, if I don't assign this constant to a local variable
                            // webpack production build do something that the code doesn't work properly
                            // on the browser
                            const spriteName = ENEMY_SPRITE_NAME;

                            if (
                                isGeneratedAtlasFileAvailable(`${spriteName}.json`)
                                && isGeneratedAtlasFileAvailable(`${spriteName}.png`)
                                && !loadedAtlases.includes(spriteName)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: jsonPath } =
                                    await import(`../../assets/atlases/generated/${spriteName}.json`);
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`!!file-loader!../../assets/atlases/generated/${spriteName}.png`);

                                dispatch(addLoadedAtlasAction(spriteName));
                                await asyncLoader(this.load.atlas(spriteName, imagePath, jsonPath));
                            }

                            break;
                        }
                        case COIN: {
                            const spriteName = COIN_SPRITE_NAME;

                            if (
                                isGeneratedAtlasFileAvailable(`${spriteName}.json`)
                                && isGeneratedAtlasFileAvailable(`${spriteName}.png`)
                            && !loadedAtlases.includes(spriteName)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: jsonPath } =
                                    await import(`../../assets/atlases/generated/${spriteName}.json`);
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`!!file-loader!../../assets/atlases/generated/${spriteName}.png`);

                                dispatch(addLoadedAtlasAction(spriteName));
                                await asyncLoader(this.load.atlas(spriteName, imagePath, jsonPath));
                            }

                            break;
                        }
                        case HEART: {
                            const spriteName = HEART_SPRITE_NAME;
                            if (
                                isImageFileAvailable('heart_full.png')
                                && !loadedImages.includes(spriteName)
                            ) {
                                // eslint-disable-next-line no-await-in-loop, import/no-unresolved, import/no-webpack-loader-syntax
                                const { default: imagePath } = await import('!!file-loader!../../assets/images/heart_full.png'); // `../../assets/images/${spriteName}.png`

                                dispatch(addLoadedImageAction(spriteName));
                                await asyncLoader(this.load.image(spriteName, imagePath));
                            }

                            break;
                        }
                        case CRYSTAL: {
                            const spriteName = CRYSTAL_SPRITE_NAME;

                            if (
                                isImageFileAvailable(`${spriteName}.png`)
                                && !loadedImages.includes(spriteName)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`!!file-loader!../../assets/images/${spriteName}.png`);

                                dispatch(addLoadedImageAction(spriteName));
                                await asyncLoader(this.load.image(spriteName, imagePath));
                            }

                            break;
                        }
                        case KEY: {
                            const spriteName = KEY_SPRITE_NAME;

                            if (
                                isImageFileAvailable(`${spriteName}.png`)
                                && !loadedImages.includes(spriteName)
                            ) {
                                // eslint-disable-next-line no-await-in-loop
                                const { default: imagePath } =
                                    await import(`!!file-loader!../../assets/images/${spriteName}.png`);

                                dispatch(addLoadedImageAction(spriteName));
                                await asyncLoader(this.load.image(spriteName, imagePath));
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
            const imageName = jsonPath.textures.find((texture) => texture.image.includes(atlas))?.image;
            if (!imageName || !isGeneratedAtlasFileAvailable(imageName)) {
                // eslint-disable-next-line no-continue
                continue;
            }

            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`!!file-loader!../../assets/atlases/generated/${imageName}`);

            dispatch(addLoadedAtlasAction(atlas));
            // eslint-disable-next-line no-await-in-loop
            await asyncLoader(this.load.atlas(atlas, imagePath, jsonPath));
        }

        // Load all the images needed for the next scene
        // eslint-disable-next-line no-restricted-syntax
        for (const image of images) {
            if (
                !isImageFileAvailable(`${image}.png`)
                || loadedImages.includes(image)
            ) {
                // eslint-disable-next-line no-continue
                continue;
            }

            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`!!file-loader!../../assets/images/${image}.png`);

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
