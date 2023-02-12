export default (set) => ({
    setBattleItems: (items) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                items,
            },
        })),
    setBattlePickedAttack: (pickedItem) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                pickedItem,
            },
        })),
    setBattleEnemiesPickedAttack: (enemiesPickedItem) =>
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
    setBattleItemsListDom: (itemsListDOM) =>
        set((state) => ({
            ...state,
            battle: {
                ...state.battle,
                itemsListDOM,
            },
        })),
});
