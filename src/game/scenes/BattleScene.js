// Utils
import { getSelectorData } from '../../utils/utils';

// Selectors
import { selectGameSetters, selectGameWidth } from '../../zustand/game/selectGameData';
import { selectBattleEnemies } from '../../zustand/battle/selectBattle';

export const scene = {};

export const key = 'BattleScene';

export function create() {
    const { addGameCameraSizeUpdateCallback } = getSelectorData(selectGameSetters);
    const backgroundImage = scene.add.image(0, 0, 'background_grass').setOrigin(0, 0);
    const gameWidth = getSelectorData(selectGameWidth);
    backgroundImage.setScale(gameWidth / backgroundImage.width);

    addGameCameraSizeUpdateCallback(() => {
        const gameWidth = getSelectorData(selectGameWidth);
        backgroundImage.setScale(gameWidth / backgroundImage.width);
    });

    const enemies = getSelectorData(selectBattleEnemies);
    enemies.forEach(({ sprite, position }) => {
        // TODO do this https://medium.com/@junhongwang/sprite-outline-with-phaser-3-9c17190b04bc
        // const outline = scene.add.image(position.x, position.y, sprite)
        //     .setScale(3.5)
        //     .setTintFill(0x85F9DC)
        //     .setVisible(false);
        const enemy = scene.add.image(position.x, position.y, sprite).setScale(3);
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
