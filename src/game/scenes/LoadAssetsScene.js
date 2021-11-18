import { Scene, Display } from 'phaser';
import store from '../../redux/store';
import { addLoadedFontAction } from '../../redux/actions/addLoadedFontAction';
import { selectFonts } from '../../redux/selectors/selectAssets';
import { asyncLoader } from '../../utils';

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

        // Pre-load all the fonts needed for the scene
        // so Phaser can render them properly
        fonts?.forEach((font) => {
            const loadedFonts = selectFonts(getState());

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

        // Load the Tiled map needed for the next scene
        if (mapKey) {
            const { default: mapJson } = await import(`../../assets/maps/${mapKey}.json`);
            const tilesets = mapJson.tilesets.map((tileset) =>
                // the string will be something like "../tilesets/village.json" or "../tilesets/village.png"
                tileset.source?.split('/').pop().split('.')[0] || tileset.image?.split('/').pop().split('.')[0]);

            const objectLayers = mapJson.layers.filter((layer) => layer.type === 'objectgroup');
            objectLayers.forEach((layer) => {
                layer.objects.forEach((object) => {
                    const { gid, properties } = object;

                    properties.forEach((property) => {
                        const { name, type, value } = property;
                    });
                });
            });

            // eslint-disable-next-line no-restricted-syntax
            for (const tilesetName of tilesets) {
                if (tilesetName) {
                    // eslint-disable-next-line no-await-in-loop
                    const { default: tilesetJson } = await import(`../../assets/tilesets/${tilesetName}.json`);
                    // eslint-disable-next-line no-await-in-loop
                    const { default: tilesetImage } = await import(`../../assets/tilesets/${tilesetJson.image}`);

                    // eslint-disable-next-line no-await-in-loop
                    await asyncLoader(this.load.image(tilesetName, tilesetImage));
                    // eslint-disable-next-line no-await-in-loop
                    await asyncLoader(this.load.json(tilesetName, tilesetJson));

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
            // eslint-disable-next-line no-await-in-loop
            const { default: jsonPath } = await import(`../../assets/atlases/generated/${atlas}.json`);
            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`../../assets/atlases/generated/${atlas}.png`);
            // TODO for some reason the image above is loaded as base64 :(

            // eslint-disable-next-line no-await-in-loop
            await asyncLoader(this.load.atlas(atlas, imagePath, jsonPath));
        }

        // Load all the images needed for the next scene
        // eslint-disable-next-line no-restricted-syntax
        for (const image of images) {
            // eslint-disable-next-line no-await-in-loop
            const { default: imagePath } = await import(`../../assets/images/${image}.png`);
            // eslint-disable-next-line no-await-in-loop
            await asyncLoader(this.load.image(image, imagePath));
        }

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
