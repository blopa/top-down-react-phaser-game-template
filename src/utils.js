// eslint-disable-next-line import/prefer-default-export
export const calculateGameSize = (
    width,
    height,
    tileSize,
    threshold = 0.5
) => {
    const widthScale = Math.floor(window.innerWidth / width);
    const heightScale = Math.floor(window.innerHeight / height);
    const zoom = Math.min(widthScale, heightScale) || 1;

    if (zoom > 1) {
        const newWidth = Math.floor(window.innerWidth / tileSize) * tileSize / zoom;
        const newHeight = Math.floor(window.innerHeight / tileSize) * tileSize / zoom;

        return {
            zoom,
            width: Math.min(newWidth, Math.floor((width * (1 + threshold)) / tileSize) * tileSize),
            height: Math.min(newHeight, Math.floor((height * (1 + threshold)) / tileSize) * tileSize),
        };
    }

    return {
        zoom: 1,
        width,
        height,
    };
};

// let width = 400; // 25 * 16
// let height = 224; // 16 * 14 = 224
