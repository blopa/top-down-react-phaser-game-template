/* eslint-disable */
import { Scene } from 'phaser';

// Utils
import { changeScene } from '../../utils/sceneHelpers';

// TODO move this somewhere else
import backgroundDesert from '../../assets/images/background_desert.png';
import backgroundFall from '../../assets/images/background_fall.png';
import backgroundForest from '../../assets/images/background_forest.png';
import backgroundGrass from '../../assets/images/background_grass.png';
import backgroundWinter from '../../assets/images/background_winter.png';
import enemy01 from '../../assets/images/enemy_01.png';
import enemy02 from '../../assets/images/enemy_02.png';
import enemy03 from '../../assets/images/enemy_03.png';

export default class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload assets for the splash and title screens
        this.load.image('background_desert', backgroundDesert);
        this.load.image('background_fall', backgroundFall);
        this.load.image('background_forest', backgroundForest);
        this.load.image('background_grass', backgroundGrass);
        this.load.image('background_winter', backgroundWinter);

        this.load.image('enemy_01', enemy01);
        this.load.image('enemy_02', enemy02);
        this.load.image('enemy_03', enemy03);
    }

    create() {
        changeScene(this, 'MainMenuScene', {
            fonts: ['"Press Start 2P"'],
        });
    }
}
