export default (set) => ({
    setMenuItems: (items) =>
        set((state) => ({
            ...state,
            menu: {
                ...state.menu,
                items,
            },
        })),
    setMenuOnSelect: (onSelect) =>
        set((state) => ({
            ...state,
            menu: {
                ...state.menu,
                onSelect,
            },
        })),
    setMenuPosition: (position) =>
        set((state) => ({
            ...state,
            menu: {
                ...state.menu,
                position,
            },
        })),
    addMenuItems: (items) =>
        set((state) => ({
            ...state,
            menu: {
                ...state.menu,
                // TODO make this a Set()
                items: [...state.menu.items, ...items],
            },
        })),
});
