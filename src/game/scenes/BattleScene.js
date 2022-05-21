import { Scene } from 'phaser';

// Utils
import { getSelectorData } from '../../utils/utils';

// Selectors
import { selectBattleEnemies } from '../../redux/selectors/selectBattle';

export default class BattleScene extends Scene {
    constructor() {
        super('BattleScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        // TODO
        const backgroundImage = this.add.image(0, 0, 'background_grass');
        backgroundImage.setScale(
            Math.max(1, 2 - ((backgroundImage.width / this.game.config.width) - 1))
        );

        const enemies = getSelectorData(selectBattleEnemies);

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
