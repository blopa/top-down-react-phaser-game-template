import { GameObjects } from 'phaser';
import {
    ENTER_KEY,
    SPACE_KEY,
    ARROW_UP_KEY,
    ARROW_DOWN_KEY,
    ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY,
} from '../constants';

export const isObject = (obj) =>
    typeof obj === 'object' && obj?.constructor === Object;

export const isObjectEmpty = (obj) =>
    isObject(obj) && Object.keys(obj).length === 0;

export const isObjectNotEmpty = (obj) =>
    isObject(obj) && Object.keys(obj).length > 0;

/**
 * source https://gist.github.com/GlauberF/d8278ce3aa592389e6e3d4e758e6a0c2
 * Simulate a key event.
 * @param {String} code The code of the key to simulate
 * @param {String} type (optional) The type of event : down, up or press. The default is down
 */
export const simulateKeyEvent = (code, type = 'down') => {
    const keysMap = {
        [ENTER_KEY]: 13,
        [SPACE_KEY]: 32,
        [ARROW_LEFT_KEY]: 37,
        [ARROW_UP_KEY]: 38,
        [ARROW_RIGHT_KEY]: 39,
        [ARROW_DOWN_KEY]: 40,
    };

    const event = document.createEvent('HTMLEvents');
    event.initEvent(`key${type}`, true, false);
    event.code = code;
    event.keyCode = keysMap[code];

    document.dispatchEvent(event);
};

export const calculateGameSize = (
    width,
    height,
    tileWidth,
    tileHeight,
    widthThreshold = 0.5,
    heightThreshold = 0.5
) => {
    const widthScale = Math.floor(window.innerWidth / width);
    const heightScale = Math.floor(window.innerHeight / height);
    const zoom = Math.min(widthScale, heightScale) || 1;

    const newWidth = Math.floor(window.innerWidth / tileWidth) * tileWidth / zoom;
    const newHeight = Math.floor(window.innerHeight / tileHeight) * tileHeight / zoom;

    return {
        zoom,
        width: Math.min(newWidth, Math.floor((width * (1 + widthThreshold)) / tileWidth) * tileWidth),
        height: Math.min(newHeight, Math.floor((height * (1 + heightThreshold)) / tileHeight) * tileHeight),
    };
};

export const createInteractiveGameObject = (
    scene,
    x,
    y,
    width,
    height,
    isDebug = false,
    origin = { x: 0, y: 0 }
) => {
    const customCollider = new GameObjects.Rectangle(
        scene,
        x,
        y,
        width,
        height
    ).setOrigin(origin.x, origin.y);

    if (isDebug) {
        customCollider.setFillStyle(0x741B47);
    }

    scene.physics.add.existing(customCollider);

    return customCollider;
};

// Thanks yannick @ https://phaser.discourse.group/t/loading-audio/1306/4
export const asyncLoader = (loaderPlugin) => new Promise((resolve, reject) => {
    loaderPlugin.on('filecomplete', resolve).on('loaderror', reject);
    loaderPlugin.start();
});

// Functions to check if a file exists within Webpack modules
// This might look dumb, but due to the way Webpack works, this is the only way to properly check
// Using a full path as a variable doesn't work because: https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
export const isMapFileAvailable = (file) => {
    try {
        require.resolveWeak(`../assets/maps/${file}`);
        return true;
    } catch {
        console.error(`Error loading file ${file}`);
        return false;
    }
};

export const isImageFileAvailable = (file) => {
    try {
        require.resolveWeak(`../assets/images/${file}`);
        return true;
    } catch {
        console.error(`Error loading file ${file}`);
        return false;
    }
};

export const isTilesetFileAvailable = (file) => {
    try {
        require.resolveWeak(`../assets/tilesets/${file}`);
        return true;
    } catch {
        console.error(`Error loading file ${file}`);
        return false;
    }
};

export const isGeneratedAtlasFileAvailable = (file) => {
    try {
        require.resolveWeak(`../assets/atlases/generated/${file}`);
        return true;
    } catch {
        console.error(`Error loading file ${file}`);
        return false;
    }
};

