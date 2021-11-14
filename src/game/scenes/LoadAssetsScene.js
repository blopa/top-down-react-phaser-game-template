import { Scene, Display } from 'phaser';
import store from '../../redux/store';
import { addLoadedFontAction } from '../../redux/actions/addLoadedFontAction';
import { selectFonts } from '../../redux/selectors/selectAssets';

export default class LoadAssetsScene extends Scene {
    constructor() {
        super('LoadAssetsScene');
    }

    init(data) {
        this.data = data;
    }

    preload() {
        // TODO
    }

    create() {
        const { getState, dispatch } = store;
        this.data.assets?.fonts?.forEach((font) => {
            const fonts = selectFonts(getState());

            if (fonts.includes(font)) {
                return;
            }

            dispatch(addLoadedFontAction(font));
            const color = this.game.config.backgroundColor;
            this.add.text(
                0,
                0,
                '',
                {
                    fontFamily: font,
                    color: Display.Color.RGBToString(color.r, color.g, color.b, color.a),
                }
            );
        });

        if (this.data.assets.fonts.length > 0) {
            document.fonts.ready.then((fontFace) => {
                this.scene.start(this.data.nextScene);
            });
        }
    }
}
