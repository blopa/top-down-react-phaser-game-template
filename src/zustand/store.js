import create from 'zustand';

// define the store
const useStore = create((set) => ({
    loadedAssets: {},
    heroData: {},
    mapData: {},
    game: {},
    dialog: {},
    battle: {},
    menu: {},
    text: {
        texts: [],
    },
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
    setDialogMessages: (messages) =>
        set((state) => ({
            ...state,
            dialog: {
                ...state.dialog,
                messages,
            },
        })),
    setDialogAction: (action) =>
        set((state) => ({
            ...state,
            dialog: {
                ...state.dialog,
                action,
            },
        })),
    setDialogCharacterName: (characterName) =>
        set((state) => ({
            ...state,
            dialog: {
                ...state.dialog,
                characterName,
            },
        })),
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
    setGameCanvas: (canvas) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                canvas,
            },
        })),
    setGameCameraSizeCallback: (cameraSizeUpdateCallback) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                cameraSizeUpdateCallback,
            },
        })),
    setGameLocale: (locale) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                locale,
            },
        })),
    setFacingDirection: (facingDirection) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                facingDirection,
            },
        })),
    setInitialPosition: (initialPosition) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                initialPosition,
            },
        })),
    setPreviousPosition: (previousPosition) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                previousPosition,
            },
        })),
    setInitialFrame: (initialFrame) =>
        set((state) => ({
            ...state,
            heroData: {
                ...state.heroData,
                initialFrame,
            },
        })),
    addLoadedFont: (fonts) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                fonts: [...fonts, ...state.loadedAssets.fonts],
            },
        })),
    addLoadedAtlas: (atlases) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                atlases: [...atlases, ...state.loadedAssets.atlases],
            },
        })),
    addLoadedImage: (images) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                images: [...images, ...state.loadedAssets.images],
            },
        })),
    addLoadedMap: (maps) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                maps: [...maps, ...state.loadedAssets.maps],
            },
        })),
    addLoadedJson: (jsons) =>
        set((state) => ({
            ...state,
            loadedAssets: {
                ...state.loadedAssets,
                // TODO make this a Set()
                jsons: [...jsons, ...state.loadedAssets.jsons],
            },
        })),
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
                tilesets: [...tilesets, ...state.mapData.tilesets],
            },
        })),
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
                items: [...items, ...state.menu.items],
            },
        })),
    setTextTexts: (texts) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                texts,
            },
        })),
    addTextTexts: (texts) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                // TODO make this a Set()
                texts: [...texts, ...state.text.texts],
            },
        })),
    updateTextTexts: (key, variables) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                texts: [
                    ...state.text.texts.map((text) => {
                        if (text.key === key) {
                            return {
                                ...text,
                                variables,
                            };
                        }

                        return text;
                    }),
                ],
            },
        })),
    removeTextTexts: (key) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                texts: [...state.text.texts.filter((text) => text.key !== key)],
            },
        })),
}));

export default useStore;
