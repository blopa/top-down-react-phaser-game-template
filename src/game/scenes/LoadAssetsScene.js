import { Scene, Display } from 'phaser';
import store from '../../redux/store';
import { addLoadedFontAction } from '../../redux/actions/addLoadedFontAction';
import { selectFonts } from '../../redux/selectors/selectAssets';

export default class LoadAssetsScene extends Scene {
    constructor() {
        super('LoadAssetsScene');
    }

    ready = {
        fonts: false,
        atlases: false,
        images: false,
        tilesets: false,
        maps: false,
    };

    init(initData) {
        this.initData = initData;
    }

    preload() {
        const {
            // tilesets,
            atlases,
            images,
            mapKey,
        } = this.initData.assets;

        atlases?.forEach(async (atlas, index) => {
            // TODO
        });

        images?.forEach(async (image, index) => {
            // TODO
        });

        [null].forEach(async (dummy, index) => {
            const { default: mapJson } = await import(`../../assets/maps/${mapKey}.json`);
            const tilesets = mapJson.tilesets.map((tileset) =>
                // the string will be something like "../tilesets/village.json" or "../tilesets/village.png"
                tileset.source?.split('/').pop().split('.')[0] || tileset.image?.split('/').pop().split('.')[0]);

            // eslint-disable-next-line no-restricted-syntax
            for (const tilesetName of tilesets) {
                const idx = tilesets.indexOf(tilesetName);
                if (tilesetName) {
                    // eslint-disable-next-line no-await-in-loop
                    const { default: tilesetJson } = await import(`../../assets/tilesets/${tilesetName}.json`);
                    // eslint-disable-next-line no-await-in-loop
                    const { default: tilesetImage } = await import(`../../assets/tilesets/${tilesetJson.image}`);
                    this.load.image(tilesetName, tilesetImage);
                    // this.load.json(tilesetName, tilesetJson);
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

                if (tilesets.length === idx + 1) {
                    this.ready.tilesets = true;
                }
            }

            // Load map with pre-loaded tilesets
            this.load.tilemapTiledJSON(mapKey, mapJson);
            debugger;

            // TODO add this to redux?
            this.initData.initData = {
                ...this.initData.initData,
                mapData: {
                    ...this.initData.initData.mapData,
                    mapKey,
                },
            };

            if (tilesets.length === index + 1) {
                this.ready.maps = true;
            }
        });
    }

    create() {
        const { fonts } = this.initData.assets;
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

        if (fonts.length > 0) {
            document.fonts.ready.then((fontFace) => {
                this.ready.fonts = true;
            });
        }

        // for (const tilesetName of tilesets) {
        //     const tileset = await import(`../tilesets/${tilesetName}.json`);
        // }
    }

    update() {
        const {
            // tilesets,
            atlases,
            fonts,
            images,
            mapKey,
        } = this.initData.assets;

        if (
            (mapKey ? (this.ready.maps && this.ready.tilesets) : true)
            && (atlases.length > 0 ? this.ready.atlases : true)
            && (images.length > 0 ? this.ready.images : true)
            && (fonts.length > 0 ? this.ready.fonts : true)
        ) {
            this.scene.start(
                this.initData.nextScene,
                this.initData.initData
            );
        }
    }
}
