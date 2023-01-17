import create from 'zustand';
import { MIN_GAME_HEIGHT, MIN_GAME_WIDTH } from '../constants';

// define the store
const store = create((set) => ({
    loadedAssets: {
        fonts: [],
        atlases: [],
        images: [],
        maps: [],
        jsons: [],
    },
    heroData: {
        facingDirection: '',
        initialPosition: {},
        previousPosition: {},
        initialFrame: '',
    },
    mapData: {
        mapKey: '',
        tilesets: [],
    },
    game: {
        width: MIN_GAME_WIDTH,
        height: MIN_GAME_HEIGHT,
        zoom: 1,
        locale: 'en',
    },
    dialog: {
        messages: [],
        action: null,
        characterName: '',
    },
    battle: {
        items: [],
        enemies: [],
        skills: [],
        onSelect: null,
        pickedItem: null,
        enemiesPickedItem: null,
    },
    menu: {
        items: [],
        position: 'center',
        onSelect: null,
    },
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
    setGameCanvasElement: (canvas) =>
        set((state) => ({
            ...state,
            game: {
                ...state.game,
                canvas,
            },
        })),
    setGameCameraSizeUpdateCallback: (cameraSizeUpdateCallback) =>
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
                jsons: [...state.loadedAssets.jsons, ...json],
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
                tilesets: [...state.mapData.tilesets, tilesets],
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
                items: [...state.menu.items, ...items],
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
                texts: [...state.text.texts, ...texts],
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

// TODO https://github.com/pmndrs/zustand#using-zustand-without-react
export const useStore = store;
export default store;
