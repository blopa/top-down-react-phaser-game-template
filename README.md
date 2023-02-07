# Top-Down Phaser Game with React UI Template

This project came from this Medium post: https://javascript.plainenglish.io/i-made-a-top-down-game-version-of-my-blog-with-phaser-and-react-faf5c28cf768

<img src="/source_files/game_sample.gif?raw=true" width="890px" />

## Test it here: https://blopa.github.io/top-down-react-phaser-game-template/

# Features
- Create React App
- Phaser 3
- Zustand
- Material UI
- React 18 as game UI
- Functional programming
- Arcade physics
- Automatically resize game when browser window change size
- Automatically load Tilesets into Tiled maps
- Automatically preload assets with the `LoadAssetsScene` scene
- Automatically load items and enemies from Tiled objects layer
- Script to automatically generate atlases sheets
- Adjustable tile sizes
- Integration between Phaser and React via Zustand
- Dialog system (with React)
- Game menu (with React)
- Virtual Gamepad for mobile (with React)
- Free 2D assets by Kenney.nl AKA assets God

# How to use it

## Automatically load scene files
The function `getScenesModules` will use the [require.context](https://webpack.js.org/guides/dependency-management/#requirecontext) from Webpack to load all `.js` and `.ts` files from the `/src/assets/games/scenes` directory, so simply add your game scenes there, and they will be loaded into the game.

The first scene loaded by Phaser JS will be the scene with the name defined in the `constants.js` file in the `BOOT_SCENE_NAME` variable.

## Functional programming approach
For a better readability of the code, it's possible to implement game scenes by simply exporting functions from the scene file, instead of using the `Phaser.Scene` class.

```javascript
// Export game scene using the regular class way
export default class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('background', background);
    }

    create() {
        this.add.image(100, 100, 'background');
    }
}
```

```javascript
// Export game scene in the functional approach
export const scene = {};

export const key = 'BootScene';

export function preload() {
    scene.load.image('background', background);
}

export function create() {
    scene.add.image(100, 100, 'background');
}
```

The `scene` object that is exported will be the global variable with the `Phaser.Scene` helper functions. You can still access it with `this`, but the idea is to avoid using `this` to improve code readability.

The magic of using the exported `scene` variable happens in the `prepareScene` function.

## Maps
Add your Tiled tilesets JSON and images to `/src/assets/tilesets` and your Tiled maps to `/src/assets/maps`. Then call the `LoadAssetsScene` scene like:

```javascript
this.scene.start('LoadAssetsScene', {
    nextScene: 'GameScene', // scene to be loaded after the assets are loaded
    assets: {
        mapKey: 'sample_map', // name of your map, like sample_map.json in this case
    },
});
```

Any tileset inside your `sample_map.json` will be automatically loaded, as long as they are in the `/src/assets/tilesets` directory.

## Other assets
To load any other asset, call the `LoadAssetsScene` with a list of the assets you need it to be automatically loaded.

```javascript
this.scene.start('LoadAssetsScene', {
    nextScene: 'GameScene', // scene to be loaded after the assets are loaded
    assets: {
        fonts: ['"Press Start 2P"'], // fonts to be loaded
        atlases: ['hero'], // atlases to be loaded, must be in `/src/assets/atlases/generated/` as hero.json and hero.png
        images: ['background'], // images to be loaded, must be in `/src/assets/images` as background.png
    },
});
```

## The 'GameScene'
This file is where the game map is rendered, with all items, enemies, etc. The `create` function is split into smaller functions that can be found in the `sceneHelpers.js` file.

## Virtual Gamepad
The Virtual Gamepad will be loaded automatically if the game is being run in a mobile device. The Virtual Gamepad is a React component that simulate keyboard keys to control que game, using the function `simulateKeyEvent` found in [this GitHub Gist](https://gist.github.com/GlauberF/d8278ce3aa592389e6e3d4e758e6a0c2).

## Dialog System
A dialog box will automatically show up whenever the `state.dialog.messages` variable is filled with messages. You can call the `setDialogMessagesAction` Redux action to do this.

```javascript
setDialogMessages(['hello world', 'hello world 2']);
```

# Assets by Kenney.nl:
- https://www.kenney.nl/assets/rpg-urban-pack
- https://www.kenney.nl/assets/roguelike-rpg-pack
- https://www.kenney.nl/assets/pixel-platformer
- https://www.kenney.nl/assets/onscreen-controls
- https://www.kenney.nl/assets/background-elements-redux
- https://kenney.itch.io/creature-mixer

# License
MIT License

Copyright (c) 2023 Pablo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Free Software, Hell Yeah!**
