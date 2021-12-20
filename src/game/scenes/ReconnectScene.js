import { Scene } from 'phaser';

// Utils
import { changeScene, connectToServer, startGameScene } from '../../utils/sceneHelpers';
import { getDispatch, getSelectorData } from '../../utils/utils';

// Constants
import { LAST_TIME_CONNECTED_DATA_KEY, ONE_SECOND } from '../../utils/constants';
import { APPROVE_RECONNECTION, RECONNECTION_FAILED, REQUEST_RECONNECTION } from '../../server/constants';

// Selectors
import { selectGameCurrentRoomId } from '../../redux/selectors/selectGameManager';
import { selectMyPlayerId } from '../../redux/selectors/selectPlayers';
import { selectGameHeight } from '../../redux/selectors/selectGameSettings';

// Actions
import setMyCharacterIdAction from '../../redux/actions/players/setMyCharacterIdAction';
import setPlayersAction from '../../redux/actions/players/setPlayersAction';
import addTextAction from '../../redux/actions/text/addTextAction';
import removeTextAction from '../../redux/actions/text/removeTextAction';

export default class ReconnectScene extends Scene {
    constructor() {
        super('ReconnectScene');
    }

    create() {
        const dispatch = getDispatch();
        const gameHeight = getSelectorData(selectGameHeight);

        dispatch(addTextAction({
            key: 'reconnecting_ellipsis',
            config: {
                position: 'center',
                color: '#FFFFFF',
                top: gameHeight * 0.6,
            },
        }));

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

            const myPlayer = players.find((p) => p.playerId === myPlayerId);
            dispatch(setMyCharacterIdAction(myPlayer.characterId));

            startGameScene(
                this,
                'main_map',
                () => dispatch(setPlayersAction(players))
            );
        });

        socket.on(RECONNECTION_FAILED, () => {
            localStorage.removeItem(LAST_TIME_CONNECTED_DATA_KEY);

            dispatch(removeTextAction('reconnecting_ellipsis'));
            dispatch(addTextAction({
                key: 'failed_to_reconnect',
                config: {
                    position: 'center',
                    color: '#FFFFFF',
                    top: gameHeight * 0.6,
                },
            }));

            this.time.delayedCall(5 * ONE_SECOND, () => {
                changeScene(this, 'MainMenuScene');
                return dispatch(removeTextAction('failed_to_reconnect'));
            });
        });
    }
}
