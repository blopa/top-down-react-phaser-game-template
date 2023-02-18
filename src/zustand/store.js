import { createStore, useStore } from 'zustand';

// Constants
import { MIN_GAME_HEIGHT, MIN_GAME_WIDTH } from '../constants';

// Setters
import setLoadedAssets from './assets/setLoadedAssets';
import setGameData from './game/setGameData';
import setHeroData from './hero/setHeroData';
import setDialog from './dialog/setDialog';
import setMapData from './map/setMapData';
import setMenu from './menu/setMenu';
import setText from './text/setText';

// define the store
const store = createStore((set) => ({
    loadedAssets: {
        fonts: [],
        atlases: [],
        images: [],
        maps: [],
        jsons: [],
        setters: setLoadedAssets(set),
    },
    heroData: {
        facingDirection: '',
        initialPosition: {},
        previousPosition: {},
        initialFrame: '',
        inventory: {
            dice: [],
        },
        setters: setHeroData(set),
    },
    mapData: {
        mapKey: '',
        tilesets: [],
        setters: setMapData(set),
    },
    game: {
        width: MIN_GAME_WIDTH,
        height: MIN_GAME_HEIGHT,
        zoom: 1,
        locale: 'en',
        cameraSizeUpdateCallbacks: [],
        setters: setGameData(set),
    },
    dialog: {
        messages: [],
        action: null,
        characterName: '',
        setters: setDialog(set),
    },
    menu: {
        items: [],
        position: 'center',
        onSelect: null,
        setters: setMenu(set),
    },
    text: {
        texts: [],
        setters: setText(set),
    },
}));

export const useGameStore = (selector) => useStore(store, selector);

export const getState = () => store.getState();
