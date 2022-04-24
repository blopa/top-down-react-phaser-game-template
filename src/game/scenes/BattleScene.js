import { Scene } from 'phaser';

export default class BattleScene extends Scene {
    constructor() {
        super('BattleScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        console.log(2222);
        this.add.image(0, 0, 'background_grass');
        this.add.image(200, 120, 'enemy_01').setScale(3);
        this.add.image(300, 120, 'enemy_02').setScale(3);

        this.input.on('pointerdown', () => {
            console.log('click');
        });
    }
}
