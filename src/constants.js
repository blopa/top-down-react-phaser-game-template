export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const MIN_GAME_WIDTH = 25 * TILE_WIDTH; // 400
export const MIN_GAME_HEIGHT = 14 * TILE_HEIGHT; // 224

export const RESIZE_THRESHOLD = 500;
export const RE_RESIZE_THRESHOLD = 10;
export const OVERLAY_DIV_RESIZE_THRESHOLD = RE_RESIZE_THRESHOLD;

export const HERO_SPRITE_NAME = 'hero';
export const ENEMY_SPRITE_NAME = 'enemy';
export const COIN_SPRITE_NAME = 'coin';
export const HEART_SPRITE_NAME = 'heart';
export const CRYSTAL_SPRITE_NAME = 'crystal';
export const KEY_SPRITE_NAME = 'key';

// Game Objects Tiled IDs
export const ENEMY = 1;
export const COIN = 2;
export const HEART = 3;
export const CRYSTAL = 4;
export const KEY = 5;
export const DOOR = 6;

export const IDLE_FRAME = 'walk_position_02';

// Directions
export const RIGHT_DIRECTION = 'right';
export const LEFT_DIRECTION = 'left';
export const UP_DIRECTION = 'up';
export const DOWN_DIRECTION = 'down';

export const IGNORED_TILESETS = ['objects'];

// Keys
export const ENTER_KEY = 'Enter';
export const SPACE_KEY = 'Space';
export const ESCAPE_KEY = 'Escape';
export const ARROW_LEFT_KEY = 'ArrowLeft';
export const ARROW_UP_KEY = 'ArrowUp';
export const ARROW_RIGHT_KEY = 'ArrowRight';
export const ARROW_DOWN_KEY = 'ArrowDown';

// Battle
// export const MELEE_ITEM_INDEX = 0;
// export const MAGIC_ITEM_INDEX = 1;
// export const DEFEND_ITEM_INDEX = 2;
// export const RUN_ITEM_INDEX = 3;
export const MELEE_BATTLE_ITEM = 'melee';
export const MAGIC_BATTLE_ITEM = 'magic';
export const DEFEND_BATTLE_ITEM = 'defend';
export const RUN_BATTLE_ITEM = 'run';
