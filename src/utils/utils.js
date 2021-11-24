export const isObject = (obj) =>
    typeof obj === 'object' && obj?.constructor === Object;

export const isObjectEmpty = (obj) =>
    isObject(obj) && Object.keys(obj).length === 0;

export const isObjectNotEmpty = (obj) =>
    isObject(obj) && Object.keys(obj).length > 0;

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

// Thanks yannick @ https://phaser.discourse.group/t/loading-audio/1306/4
export const asyncLoader = (loaderPlugin) => new Promise((resolve) => {
    loaderPlugin.on('filecomplete', resolve).on('loaderror', resolve);
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
        return false;
    }
};

export const isImageFileAvailable = (file) => {
    try {
        require.resolveWeak(`../assets/images/${file}`);
        return true;
    } catch {
        return false;
    }
};

export const isTilesetFileAvailable = (file) => {
    try {
        require.resolveWeak(`../assets/tilesets/${file}`);
        return true;
    } catch {
        return false;
    }
};

export const isGeneratedAtlasFileAvailable = (file) => {
    try {
        require.resolveWeak(`../assets/atlases/generated/${file}`);
        return true;
    } catch {
        return false;
    }
};

