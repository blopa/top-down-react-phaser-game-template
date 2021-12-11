import { Scene } from 'phaser';

// Utils
import { connectToServer, startGameScene } from '../../utils/sceneHelpers';
import { getDispatch, getSelectorData } from '../../utils/utils';

// Constants
import { LAST_TIME_CONNECTED_DATA_KEY, ONE_SECOND } from '../../utils/constants';
import { APPROVE_RECONNECTION, RECONNECTION_FAILED, REQUEST_RECONNECTION } from '../../server/constants';

// Selectors
import { selectGameCurrentRoomId } from '../../redux/selectors/selectGameManager';
import { selectMyPlayerId } from '../../redux/selectors/selectPlayers';
import { selectGameHeight, selectGameWidth } from '../../redux/selectors/selectGameSettings';

// Actions
import setMyCharacterIdAction from '../../redux/actions/players/setMyCharacterIdAction';

export default class ReconnectScene extends Scene {
    constructor() {
        super('ReconnectScene');
    }

    create() {
        const dispatch = getDispatch();
        const gameWidth = getSelectorData(selectGameWidth);
        const gameHeight = getSelectorData(selectGameHeight);

        const reconnectingText = this.add.text(
            gameWidth / 2,
            gameHeight * 0.6,
            'Reconnecting...',
            {
                fontFamily: '"Press Start 2P"',
                color: '#FFFFFF',
            }
        ).setOrigin(0.5);

        const roomId = getSelectorData(selectGameCurrentRoomId);
        const myPlayerId = getSelectorData(selectMyPlayerId);

        const socket = connectToServer();
        socket.emit(REQUEST_RECONNECTION, JSON.stringify({
            playerId: myPlayerId,
            roomId,
        }));

        socket.on(APPROVE_RECONNECTION, (stringfiedData) => {
            const players = JSON.parse(stringfiedData);
            localStorage.removeItem(LAST_TIME_CONNECTED_DATA_KEY);

            // TODO get rid of this state property
            const myPlayer = players.find((p) => p.playerId === myPlayerId);
            dispatch(setMyCharacterIdAction(myPlayer.characterId));

            startGameScene(this, 'main_map');
        });

        socket.on(RECONNECTION_FAILED, () => {
            localStorage.removeItem(LAST_TIME_CONNECTED_DATA_KEY);
            reconnectingText.setText(
                'Failed to reconnect'
            );

            this.time.delayedCall(5 * ONE_SECOND, () => {
                this.scene.start('LoadAssetsScene', {
                    nextScene: 'MainMenuScene',
                    assets: {},
                });
            });
        });
    }
}
