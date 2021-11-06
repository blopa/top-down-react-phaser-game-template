const { readdirSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');

const TILESETS_PATH = path.resolve(
    __dirname,
    '..',
    'src',
    'assets',
    'maps'
);

async function copyTilesetData(mapName = null) {
    if (!mapName) {
        console.error('No map passed');
        return;
    }

    const allFiles = [];
    let sourceTilesetData = [];
    const mapsFolders = await readdirSync(TILESETS_PATH);
    // eslint-disable-next-line no-restricted-syntax
    for (const tilesetPath of mapsFolders) {
        const filePath = path.resolve(TILESETS_PATH, tilesetPath);
        // eslint-disable-next-line no-await-in-loop
        const spritesFiles = await readdirSync(filePath);
        // eslint-disable-next-line no-restricted-syntax
        for (const spritesFile of spritesFiles) {
            if (spritesFile === `${mapName}.json`) {
                // eslint-disable-next-line no-await-in-loop
                const jsonData = JSON.parse(await readFileSync(path.resolve(filePath, spritesFile)));
                sourceTilesetData = jsonData.tilesets;
            } else {
                allFiles.push(path.resolve(filePath, spritesFile));
            }
        }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const jsonFile of allFiles) {
        // eslint-disable-next-line no-await-in-loop
        const jsonData = JSON.parse(await readFileSync(
            jsonFile
        ));

        jsonData.tilesets = sourceTilesetData;

        // eslint-disable-next-line no-await-in-loop
        await writeFileSync(
            jsonFile,
            JSON.stringify(jsonData, null, 2)
        );
    }
}

copyTilesetData(process.argv[2]);
