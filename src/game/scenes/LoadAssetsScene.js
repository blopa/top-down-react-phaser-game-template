import { Scene, Display } from 'phaser';

// Store
import store from '../../redux/store';

// Actions
import addLoadedFontAction from '../../redux/actions/addLoadedFontAction';
import addLoadedAtlasAction from '../../redux/actions/addLoadedAtlasAction';
import addLoadedImageAction from '../../redux/actions/addLoadedImageAction';
import addLoadedMapAction from '../../redux/actions/addLoadedMapAction';

// Selectors
import {
    selectAtlases,
    selectFonts,
    selectImages,
    selectJSONs,
    selectMaps,
} from '../../redux/selectors/selectloadedAssets';

// Utils
import { asyncLoader } from '../../utils/utils';

// Constants
import {
    KEY,
    COIN,
    ENEMY,
    HEART,
    CRYSTAL,
    KEY_SPRITE_NAME,
    COIN_SPRITE_NAME,
    ENEMY_SPRITE_NAME,
    HEART_SPRITE_NAME,
    CRYSTAL_SPRITE_NAME, IGNORED_TILESETS,
} from '../../constants';
import addLoadedJSONAction from '../../redux/actions/addLoadedJSONAction';

export default class LoadAssetsScene extends Scene {
    constructor() {
        super('LoadAssetsScene');
    }

    init(initData) {
        this.initData = initData;
    }

    async create() {
        const {
            fonts,
            atlases,
            images,
            mapKey,
        } = this.initData.assets;
        const { getState, dispatch } = store;
        const state = getState();

        // Pre-load all the fonts needed for the scene
        // so Phaser can render them properly
        fonts?.forEach((font) => {
            const loadedFonts = selectFonts(state);

            // If a font is already loaded, then skip this
            if (loadedFonts.includes(font)) {
                return;
            }

            // Set font as already loaded in the redux store
            dispatch(addLoadedFontAction(font));
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

        const loadedAtlases = selectAtlases(state);
        const loadedImages = selectImages(state);
        const loadedMaps = selectMaps(state);
        // Load the Tiled map needed for the next scene
        if (mapKey && !loadedMaps.includes(mapKey)) {
            dispatch(addLoadedMapAction(mapKey));
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
                            if (loadedAtlases.includes(ENEMY_SPRITE_NAME)) {
                                break;
                            }

                            dispatch(addLoadedAtlasAction(ENEMY_SPRITE_NAME));
                            // eslint-disable-next-line no-await-in-loop
                            const { default: jsonPath } = await import('../../assets/atlases/generated/enemy.json');
                            // eslint-disable-next-line no-await-in-loop
                            const { default: imagePath } = await import('../../assets/atlases/generated/enemy.png');

                            // eslint-disable-next-line no-await-in-loop
                            await asyncLoader(this.load.atlas(ENEMY_SPRITE_NAME, imagePath, jsonPath));
                            break;
                        }
                        case COIN: {
                            if (loadedAtlases.includes(COIN_SPRITE_NAME)) {
                                break;
                            }

                            dispatch(addLoadedAtlasAction(COIN_SPRITE_NAME));
                            // eslint-disable-next-line no-await-in-loop
                            const { default: jsonPath } = await import('../../assets/atlases/generated/coin.json');
                            // eslint-disable-next-line no-await-in-loop
                            const { default: imagePath } = await import('../../assets/atlases/generated/coin.png');

                            // eslint-disable-next-line no-await-in-loop
                            await asyncLoader(this.load.atlas(COIN_SPRITE_NAME, imagePath, jsonPath));
                            break;
                        }
                        case HEART: {
                            if (loadedImages.includes(HEART_SPRITE_NAME)) {
                                break;
                            }

                            dispatch(addLoadedImageAction(HEART_SPRITE_NAME));
                            // eslint-disable-next-line no-await-in-loop
                            const { default: imagePath } = await import('../../assets/images/heart_full.png');

                            await asyncLoader(this.load.image(HEART_SPRITE_NAME, imagePath));
                            break;
                        }
                        case CRYSTAL: {
                            if (loadedImages.includes(CRYSTAL_SPRITE_NAME)) {
                                break;
                            }

                            dispatch(addLoadedImageAction(CRYSTAL_SPRITE_NAME));
                            // eslint-disable-next-line no-await-in-loop
                            const { default: imagePath } = await import('../../assets/images/crystal.png');

                            await asyncLoader(this.load.image(CRYSTAL_SPRITE_NAME, imagePath));
                            break;
                        }
                        case KEY: {
                            if (loadedImages.includes(KEY_SPRITE_NAME)) {
                                break;
                            }

                            dispatch(addLoadedImageAction(KEY_SPRITE_NAME));
                            // eslint-disable-next-line no-await-in-loop
                            const { default: imagePath } = await import('../../assets/images/key.png');

                            await asyncLoader(this.load.image(KEY_SPRITE_NAME, imagePath));
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

            const loadedJSONs = selectJSONs(state);
            // eslint-disable-next-line no-restricted-syntax
            for (const tilesetName of tilesets) {
                if (tilesetName && !IGNORED_TILESETS.includes(tilesetName)) {
                    let tilesetJson = {};
                    if (!loadedJSONs.includes(tilesetName)) {
                        dispatch(addLoadedJSONAction(tilesetName));

                        // TODO make sure the firstgid value is the same
                        // eslint-disable-next-line no-await-in-loop
                        const { default: jsonResult } = await import(`../../assets/tilesets/${tilesetName}.json`);
                        tilesetJson = jsonResult;
                        // eslint-disable-next-line no-await-in-loop
                        await asyncLoader(this.load.json(tilesetName, tilesetJson));
                    } else {
                        tilesetJson = this.cache.json.get(tilesetName);
                    }

                    if (!loadedImages.includes(tilesetName)) {
                        dispatch(addLoadedImageAction(tilesetName));

                        // eslint-disable-next-line no-await-in-loop
                        const { default: tilesetImage } = await import(`../../assets/tilesets/${tilesetJson.image}`);

                        // eslint-disable-next-line no-await-in-loop
                        await asyncLoader(this.load.image(tilesetName, tilesetImage));
                    }

                    mapJson.tilesets = mapJson.tilesets.map((tileset) => {
                        if (tileset.source?.includes(`/${tilesetName}.json`)) {
                            // eslint-disable-next-line no-param-reassign
                            delete tileset.source;

                            return {
                                ...tileset,
                                ...tilesetJson,
                            };
                        }

                        return tileset;
                    });

                    const savedTilesets = this.data.get('tilesets') || [];
                    this.data.set('tilesets', [...savedTilesets, tilesetName]);
                }
            }

            // Load map with pre-loaded tilesets
            await asyncLoader(this.load.tilemapTiledJSON(mapKey, mapJson));
            this.data.set('mapKey', mapKey);
        }

        // Load all the atlases needed for the next scene
        // eslint-disable-next-line no-restricted-syntax
        for (const atlas of atlases) {
            if (loadedAtlases.includes(atlas)) {
                // eslint-disable-next-line no-continue
                continue;
            }

            dispatch(addLoadedAtlasAction(atlas));
            // eslint-disable-next-line no-await-in-loop
            const { default: jsonPath } = await import(`../../assets/atlases/generated/${atlas}.json`);
            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`../../assets/atlases/generated/${atlas}.png`);

            // eslint-disable-next-line no-await-in-loop
            await asyncLoader(this.load.atlas(atlas, imagePath, jsonPath));
        }

        // Load all the images needed for the next scene
        // eslint-disable-next-line no-restricted-syntax
        for (const image of images) {
            if (loadedImages.includes(image)) {
                // eslint-disable-next-line no-continue
                continue;
            }

            dispatch(addLoadedImageAction(image));
            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`../../assets/images/${image}.png`);
            // eslint-disable-next-line no-await-in-loop
            await asyncLoader(this.load.image(image, imagePath));
        }

        // TODO move this to redux
        // Prepare data and call next scene
        const sceneData = {
            ...this.initData.sceneData,
            mapData: {
                ...this.initData.sceneData.mapData,
                mapKey: this.data.get('mapKey'),
                tilesets: this.data.get('tilesets'),
            },
        };

        // If we have fonts, then wait for them to be loaded before calling the next scene...
        if (fonts.length > 0) {
            document.fonts.ready.then((fontFace) => {
                this.scene.start(
                    this.initData.nextScene,
                    sceneData
                );
            });
        } else {
            // ... otherwise just call the next scene already
            this.scene.start(
                this.initData.nextScene,
                sceneData
            );
        }
    }
}
