const path = require('path');
const { TextStyle2BitmapFont } = require('@rtpa/phaser-bitmapfont-generator');

const FONTS_PATH = path.resolve(__dirname, '../src/assets/fonts');

const sizes = [{
    fontSize: '10px',
    fileName: 'press-start-small-white',
}, {
    fontSize: '18px',
    fileName: 'press-start-medium-white',
}, {
    fontSize: '20px',
    fileName: 'press-start-normal-white',
}];

const doWork = async () => {
    const fontFamily = process.argv[2] || '"Press Start 2P"';

    // eslint-disable-next-line no-restricted-syntax
    for (const sizeData of sizes) {
        const { fontSize, fileName } = sizeData;
        // eslint-disable-next-line no-await-in-loop
        await TextStyle2BitmapFont(
            {
                path: FONTS_PATH,
                fileName,
                compression: null,
                antialias: false,
                // Phaser.GameObjects.RetroFont.TEXT_SET1
                textSet: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZÁÂÉÍÕÚÇÃÀÊÓÔÜ[\\]^_`abcdefghijklmnopqrstuvwxyzáâéíõúçãàêóôü{|}~',
                textStyle: {
                    fontFamily,
                    fontSize,
                    color: '#ffffff',
                    // shadow: {
                    //     offsetX: 4,
                    //     offsetY: 4,
                    //     blur: 0,
                    //     fill: true,
                    //     stroke: true,
                    //     color: '#000000',
                    // },
                },
            }
        );
    }

    return process.exit(1);
};

doWork();
