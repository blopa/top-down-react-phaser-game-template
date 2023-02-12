export default (set) => ({
    setHeroFacingDirection: (facingDirection) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                facingDirection,
            },
        })),
    setHeroInitialPosition: (initialPosition) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                initialPosition,
            },
        })),
    setHeroPreviousPosition: (previousPosition) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                previousPosition,
            },
        })),
    setHeroInitialFrame: (initialFrame) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                initialFrame,
            },
        })),
});
