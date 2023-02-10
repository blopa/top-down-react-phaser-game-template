export default (set) => ({
    addLoadedFont: (font) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                fonts: [...state.loadedAssets.fonts, font],
            },
        })),
    addLoadedAtlas: (atlas) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                atlases: [...state.loadedAssets.atlases, atlas],
            },
        })),
    addLoadedImage: (image) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                images: [...state.loadedAssets.images, image],
            },
        })),
    addLoadedMap: (map) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                maps: [...state.loadedAssets.maps, map],
            },
        })),
    addLoadedJson: (json) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                jsons: [...state.loadedAssets.jsons, json],
            },
        })),
});
