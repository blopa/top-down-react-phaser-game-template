const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { packAsync } = require('free-tex-packer-core');
const path = require('path');

const SOURCE_SPRITES_PATH = path.resolve(
    __dirname,
    '..',
    'src',
    'assets',
    'atlases',
    'sources'
);

const SPRITES_PATH = path.resolve(
    __dirname,
    '..',
    'src',
    'assets',
    'atlases',
    'generated'
);

async function generateAtlasFiles(assetName = null) {
    let spritesFolders;
    if (assetName) {
        spritesFolders = [assetName];
    } else {
        spritesFolders = await readdirSync(SOURCE_SPRITES_PATH);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const spritesFolder of spritesFolders) {
        // eslint-disable-next-line no-await-in-loop
        const spritesFiles = await readdirSync(path.resolve(__dirname, SOURCE_SPRITES_PATH, spritesFolder));
        const images = [];
        spritesFiles.forEach((spritesFile) => {
            images.push({
                path: spritesFile,
                contents: readFileSync(
                    path.resolve(__dirname, SOURCE_SPRITES_PATH, spritesFolder, spritesFile)
                ),
            });
        });

        // eslint-disable-next-line no-await-in-loop
        await packImages(images, spritesFolder);
    }
}

async function packImages(images, spriteName) {
    try {
        const files = await packAsync(images, {
            allowRotation: false,
            removeFileExtension: true,
            prependFolderName: false,
            exporter: 'Phaser3',
            allowTrim: true,
            detectIdentical: true,
            fixedSize: false,
            textureName: spriteName,
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const item of files) {
            const fileExt = item.name.split('.').pop();
            // eslint-disable-next-line no-await-in-loop
            await writeFileSync(
                path.resolve(__dirname, SPRITES_PATH, `${spriteName}.${fileExt}`),
                item.buffer
            );
        }
    } catch (error) {
        console.log(error);
    }
}

generateAtlasFiles(process.argv[2]);
