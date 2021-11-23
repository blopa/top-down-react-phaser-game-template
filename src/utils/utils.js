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

// eslint-disable-next-line consistent-return
export const loadModule = (modulePath) => {
    try {
        return import(modulePath);
    } catch {
        console.error(`Unable to import module ${modulePath}`);
    }

    return new Promise();
};
