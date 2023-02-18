export default (set) => ({
    setGameWidth: (width) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                width,
            },
        })),
    setGameHeight: (height) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                height,
            },
        })),
    setGameZoom: (zoom) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                zoom,
            },
        })),
    setGameCanvasElement: (canvas) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                canvas,
            },
        })),
    addGameCameraSizeUpdateCallback: (cameraSizeUpdateCallback) => {
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                // TODO make this a Set()
                cameraSizeUpdateCallbacks: [...state.game.cameraSizeUpdateCallbacks, cameraSizeUpdateCallback],
            },
        }));

        return cameraSizeUpdateCallback;
    },
    setGameLocale: (locale) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                locale,
            },
        })),
});
