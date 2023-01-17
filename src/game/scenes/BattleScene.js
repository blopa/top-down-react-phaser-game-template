import { Scene } from 'phaser';

// Utils

// Selectors
import store from '../../zustand/store';

export default class BattleScene extends Scene {
    constructor() {
        super('BattleScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        const backgroundImage = this.add.image(0, 0, 'background_grass').setOrigin(0, 0);
        const { game } = store.getState();
        const { width: gameWidth } = game;
        backgroundImage.setScale(gameWidth / backgroundImage.width);

        const { battle } = store.getState();
        const { enemies } = battle;
        enemies.forEach(({ sprite, position }) => {
            // TODO do this https://medium.com/@junhongwang/sprite-outline-with-phaser-3-9c17190b04bc
            // const outline = this.add.image(position.x, position.y, sprite)
            //     .setScale(3.5)
            //     .setTintFill(0x85F9DC)
            //     .setVisible(false);
            const enemy = this.add.image(position.x, position.y, sprite).setScale(3);
            // enemy.outline = outline;
            // enemy.setInteractive();
            // enemy.on('pointerover', () => {
            //     enemy.outline.setVisible(true);
            // });
            // enemy.on('pointerout', () => {
            //     enemy.outline.setVisible(false);
            // });
            enemies.push(enemy);
        });
    }
}
