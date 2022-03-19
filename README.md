# Top-Down Phaser Game with React UI Template

This project came from this Medium post: https://javascript.plainenglish.io/i-made-a-top-down-game-version-of-my-blog-with-phaser-and-react-faf5c28cf768

<img src="/source_files/game_sample.gif?raw=true" width="890px" />

## Test it here: https://blopa.github.io/top-down-react-phaser-game-template/

# Features
- Create React App
- Phaser 3
- Redux
- Material UI
- React 17 as game UI
- Arcade physics
- Grid Engine for grid movements
- Automatically resize game when browser window change size
- Automatically load Tilesets into Tiled maps
- Automatically pre-load assets with the `LoadAssetsScene` scene
- Automatically load items and enemies from Tiled objects layer
- Script to automatically generate atlases sheets
- Adjustable tile sizes
- Integration between Phaser and React via Redux
- Dialog system (with React)
- Game menu (with React)
- Virtual Gamepad for mobile (with React)
- Free 2D assets by Kenney.nl (assets God)

# How to use it

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
dispatch(setDialogMessagesAction(['hello world', 'hello world 2']));
```

# Assets by Kenney.nl:
- https://www.kenney.nl/assets/rpg-urban-pack
- https://www.kenney.nl/assets/roguelike-rpg-pack
- https://www.kenney.nl/assets/pixel-platformer
- https://www.kenney.nl/assets/onscreen-controls

# License
MIT License

Copyright (c) 2022 Pablo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Free Software, Hell Yeah!**
