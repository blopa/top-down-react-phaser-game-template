import { isObject } from './utils';
import BootScene from '../game/scenes/BootScene';

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
export const asyncLoader = (loaderPlugin) => new Promise((resolve, reject) => {
    loaderPlugin.on('filecomplete', resolve).on('loaderror', reject);
    loaderPlugin.start();
});

export const prepareScene = (module, modulePath) => {
    if (Object.getOwnPropertyDescriptor(module.default || {}, 'prototype')) {
        return module.default;
    }

    function init(data) {
        // eslint-disable-next-line no-undefined
        if (isObject(module.scene)) {
            // when this function is called, "this" will be the scene
            // eslint-disable-next-line @babel/no-invalid-this
            Object.entries(this).forEach(([key, value]) => {
                // eslint-disable-next-line no-param-reassign
                module.scene[key] = value;
            });
        }

        module.init?.(data);
    }

    const key = module.key || modulePath.split('/').pop().split('.').shift();
    return {
        ...module,
        name: key,
        key,
        init,
    };
};

export const getScenesModules = () => {
    // automatically import all scenes from the scenes folder
    const contextResolver = require.context('../game/scenes/', true, /\.js$/);
    const scenes = contextResolver.keys().map(
        (modulePath) => prepareScene(contextResolver(modulePath), modulePath)
    );

    return [
        BootScene,
        ...scenes.filter((scene) => scene.name !== BootScene.name),
    ];
};
