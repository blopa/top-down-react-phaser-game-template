import { Display } from 'phaser';

// Utils
import {
    getSelectorData,
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

// Selectors
import {
    selectLoadedAtlases,
    selectAssetsSetters,
    selectLoadedImages,
    selectLoadedFonts,
    selectLoadedJSONs,
    selectLoadedMaps,
} from '../../zustand/assets/selectLoadedAssets';
import { selectMapSetters } from '../../zustand/map/selectMapData';

export const scene = {};

export const key = 'LoadAssetsScene';

export async function create(initData) {
    const { width: gameWidth, height: gameHeight } = scene.cameras.main;
    const {
        fonts = [],
        atlases = [],
        images = [],
        mapKey = '',
    } = initData?.assets || {};

    const {
        addLoadedAtlas,
        addLoadedFont,
        addLoadedImage,
        addLoadedMap,
        addLoadedJson,
    } = getSelectorData(selectAssetsSetters);

    const loadedAtlases = getSelectorData(selectLoadedAtlases);
    const loadedImages = getSelectorData(selectLoadedImages);
    const loadedFonts = getSelectorData(selectLoadedFonts);
    const loadedMaps = getSelectorData(selectLoadedMaps);

    // setup loading bar
    const progressBar = scene.add.graphics();
    const progressBox = scene.add.graphics();

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

    scene.load.on('progress', handleBarProgress);

    scene.load.on('fileprogress', (file) => {
        // console.info(file.key);
    });

    scene.load.on('complete', () => {
        progressBar.destroy();
        progressBox.destroy();

        scene.load.off('progress');
        scene.load.off('fileprogress');
        scene.load.off('complete');
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

        // Set font as already loaded in the zustand store
        addLoadedFont(font);
        newFontsCount += 1;
        const color = scene.game.config.backgroundColor;
        scene.add.text(
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
                                await import(`../../assets/atlases/generated/${spriteName}.png`);

                            addLoadedAtlas(spriteName);
                            await asyncLoader(scene.load.atlas(spriteName, imagePath, jsonPath));
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
                                await import(`../../assets/atlases/generated/${spriteName}.png`);

                            addLoadedAtlas(spriteName);
                            await asyncLoader(scene.load.atlas(spriteName, imagePath, jsonPath));
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
                            const { default: imagePath } = await import('../../assets/images/heart_full.png'); // `../../assets/images/${spriteName}.png`

                            addLoadedImage(spriteName);
                            await asyncLoader(scene.load.image(spriteName, imagePath));
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
                                await import(`../../assets/images/${spriteName}.png`);

                            addLoadedImage(spriteName);
                            await asyncLoader(scene.load.image(spriteName, imagePath));
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
                                await import(`../../assets/images/${spriteName}.png`);

                            addLoadedImage(spriteName);
                            await asyncLoader(scene.load.image(spriteName, imagePath));
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

        const loadedJSONs = getSelectorData(selectLoadedJSONs);
        // eslint-disable-next-line no-restricted-syntax
        for (const tilesetName of tilesets) {
            if (tilesetName && !IGNORED_TILESETS.includes(tilesetName)) {
                let tilesetJson = {};
                if (!loadedJSONs.includes(tilesetName) && isTilesetFileAvailable(`${tilesetName}.json`)) {
                    // eslint-disable-next-line no-await-in-loop
                    const { default: jsonResult } = await import(`../../assets/tilesets/${tilesetName}.json`);
                    tilesetJson = jsonResult;

                    addLoadedJson(tilesetName);
                    // eslint-disable-next-line no-await-in-loop
                    await asyncLoader(scene.load.json(tilesetName, tilesetJson));
                } else {
                    tilesetJson = scene.cache.json.get(tilesetName);
                }

                if (!loadedImages.includes(tilesetName) && isTilesetFileAvailable(tilesetJson.image)) {
                    // remove the file extension so webpack only pre-load the files with the png extension
                    const fileName = tilesetJson.image.replace(/\.[^/.]+$/, '');
                    // eslint-disable-next-line no-await-in-loop
                    const { default: tilesetImage } = await import(
                        `../../assets/tilesets/${fileName}.png`
                    );

                    addLoadedImage(tilesetName);
                    // eslint-disable-next-line no-await-in-loop
                    await asyncLoader(scene.load.image(tilesetName, tilesetImage));
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

                const { addTileset } = getSelectorData(selectMapSetters);
                addTileset(tilesetName);
            }
        }

        addLoadedMap(mapKey);
        // Load map with pre-loaded tilesets
        await asyncLoader(scene.load.tilemapTiledJSON(mapKey, mapJson));
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

        const fileName = imageName.replace(/\.[^/.]+$/, '');
        // eslint-disable-next-line no-await-in-loop
        const { default: imagePath } = await import(`../../assets/atlases/generated/${fileName}.png`);

        addLoadedAtlas(atlas);
        // eslint-disable-next-line no-await-in-loop
        await asyncLoader(scene.load.atlas(atlas, imagePath, jsonPath));
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
        const { default: imagePath } = await import(`../../assets/images/${image}.png`);

        addLoadedImage(image);
        // eslint-disable-next-line no-await-in-loop
        await asyncLoader(scene.load.image(image, imagePath));
    }

    // If we have fonts, then wait for them to be loaded before calling the next scene...
    if (newFontsCount > 0) {
        document.fonts.ready.then((fontFace) => {
            scene.scene.start(
                initData.nextScene
            );
        });
    } else {
        // ... otherwise just call the next scene already
        scene.scene.start(
            initData.nextScene
        );
    }
}
