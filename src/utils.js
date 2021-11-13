// eslint-disable-next-line import/prefer-default-export
export const calculateGameSize = (width, height, tileSize) => {
    const zoom = Math.min(Math.floor(window.innerWidth / width), Math.floor(window.innerHeight / height)) || 1;

    if (zoom > 1) {
        return {
            zoom,
            width: Math.floor(window.innerWidth / tileSize) * tileSize / zoom,
            height: Math.floor(window.innerHeight / tileSize) * tileSize / zoom,
        };
    }

    return { width, height, zoom };
};

// let width = 400; // 25 * 16
// let height = 224; // 16 * 14 = 224
