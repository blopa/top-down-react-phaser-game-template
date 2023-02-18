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
    addHeroInventoryDice: (die) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                inventory: {
                    ...state.heroData.inventory,
                    // TODO make this a Set()
                    dice: [...state.heroData.inventory.dice, die],
                },
            },
        })),
});
