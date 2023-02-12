export default (set) => ({
    setBattleItems: (items) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                items,
            },
        })),
    setBattlePickedItem: (pickedItem) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                pickedItem,
            },
        })),
    setBattleHoveredItem: (hoveredItem) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                hoveredItem,
            },
        })),
    setBattleEnemiesPickedItem: (enemiesPickedItem) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                enemiesPickedItem,
            },
        })),
    setBattleEnemies: (enemies) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                enemies,
            },
        })),
    setBattleSkills: (skills) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                skills,
            },
        })),
    setBattleOnSelect: (onSelect) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                onSelect,
            },
        })),
    setBattleOnHover: (onHover) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                onHover,
            },
        })),
    setBattleItemsListDom: (itemsListDOM) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                itemsListDOM,
            },
        })),
});
