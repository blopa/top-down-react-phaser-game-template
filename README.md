# Top-Down Phaser Game with React UI Template

This project is based on a Medium post: https://javascript.plainenglish.io/i-made-a-top-down-game-version-of-my-blog-with-phaser-and-react-faf5c28cf768

<img src="/source_files/game_sample.gif?raw=true" width="890px" />

## Try it out: https://blopa.github.io/top-down-react-phaser-game-template/

# Key Features
- Built with Create React App
- Uses Phaser 3 for game engine
- State management with Zustand
- UI with Material UI and React 18
- CSS Modules
- Uses functional programming style
- Arcade physics
- Automatically resizes game to fit browser window
- Automatically loads Tilesets and assets
- Generates atlas sheets with included script
- Adjustable tile sizes
- Integrates Phaser and React through Zustand
- Dialog system (React-based)
- Game menu (React-based)
- Virtual Gamepad for mobile devices (React-based)
- Includes 2D assets from Kenney.nl

# How to Use

## Load Scene Files
The `getScenesModules` function uses Webpack's [require.context](https://webpack.js.org/guides/dependency-management/#requirecontext) to load all `.js` and `.ts` files from the `/src/assets/games/scenes` directory. Simply add your game scenes there to have them loaded into the game.

The first scene loaded by Phaser JS is the one defined in the `constants.js` file, in the `BOOT_SCENE_NAME` variable.

## Functional Programming
Scene code can be written in a functional style for improved readability, by exporting functions instead of using the `Phaser.Scene` class.

```javascript
// Export scene using class-based approach
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
// Export scene in functional approach
export const scene = {};

export const key = 'BootScene';

export function preload() {
    scene.load.image('background', background);
}

export function create() {
    scene.add.image(100, 100, 'background');
}
```

The exported `scene` object will have all the helper functions of `Phaser.Scene`. While it can still be accessed with `this`, the functional approach is designed to improve code readability.

This "magic" is made possible by the `prepareScene` function.

## Maps
To use Tiled maps, add your Tiled tilesets JSON and images to `/src/assets/tilesets` and your Tiled maps to `/src/assets/maps`. Then start the `LoadAssetsScene` like this:

```javascript
this.scene.start('LoadAssetsScene', {
    nextScene: 'GameScene', // Scene to load after assets are loaded
    assets: {
        mapKey: 'sample_map', // Map name, e.g. sample_map.json
    },
});
```

Any tilesets used in your `sample_map.json` will be automatically loaded from the `/src/assets/tilesets` directory, as long as they are located there.

## Other assets
To load other assets such as images, fonts, or atlases, call the `LoadAssetsScene` with the following parameters:

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
The `GameScene` file is where the game map is rendered, along with all items, enemies, etc. The `create` function is split into smaller functions for easier readability, which can be found in the `sceneHelpers.js` file.

## Virtual Gamepad
The virtual gamepad will be automatically loaded when the game is run on a mobile device. The virtual gamepad is a React component that simulates keyboard keys to control the game, using the `simulateKeyEvent` function found in this [GitHub Gist](https://gist.github.com/GlauberF/d8278ce3aa592389e6e3d4e758e6a0c2).

## Dialog System
A dialog box will appear automatically whenever the `state.dialog.messages` variable is populated with messages. To accomplish this, you can call the `setDialogMessagesAction` Zustand setter function.

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
