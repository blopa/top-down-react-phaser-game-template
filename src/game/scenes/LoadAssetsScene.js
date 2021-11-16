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

        fonts?.forEach((font) => {
            const loadedFonts = selectFonts(getState());

            if (loadedFonts.includes(font)) {
                return;
            }

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

        // eslint-disable-next-line no-restricted-syntax
        for (const atlas of atlases) {
            // TODO
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const image of images) {
            // TODO
        }

        if (mapKey) {
            const { default: mapJson } = await import(`../../assets/maps/${mapKey}.json`);
            const tilesets = mapJson.tilesets.map((tileset) =>
                // the string will be something like "../tilesets/village.json" or "../tilesets/village.png"
                tileset.source?.split('/').pop().split('.')[0] || tileset.image?.split('/').pop().split('.')[0]);

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
                    // const data = this.cache.json.get(tilesetName);

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

                    this.initData.initData = {
                        ...this.initData.initData,
                        mapData: {
                            ...this.initData.initData.mapData,
                            tilesetName,
                        },
                    };
                }
            }

            // Load map with pre-loaded tilesets
            await asyncLoader(this.load.tilemapTiledJSON(mapKey, mapJson));

            // TODO add this to redux?
            this.initData.initData = {
                ...this.initData.initData,
                mapData: {
                    ...this.initData.initData.mapData,
                    mapKey,
                },
            };
        }

        if (fonts.length > 0) {
            document.fonts.ready.then((fontFace) => {
                this.scene.start(
                    this.initData.nextScene,
                    this.initData.initData
                );
            });
        } else {
            this.scene.start(
                this.initData.nextScene,
                this.initData.initData
            );
        }
    }
}
