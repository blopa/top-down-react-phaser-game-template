export default (set) => ({
    setMapKey: (mapKey) =>
        set((state) => ({
            ...state,
            mapData: {
                ...state.mapData,
                mapKey,
            },
        })),
    addTileset: (tilesets) =>
        set((state) => ({
            ...state,
            mapData: {
                ...state.mapData,
                // TODO make this a Set()
                tilesets: [...state.mapData.tilesets, tilesets],
            },
        })),
});
