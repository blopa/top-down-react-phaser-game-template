import { SET_BATTLE_ENEMIES_PICKED_ATTACK } from '../../constants';

const setBattleEnemiesPickedItemAction = (enemies) => (dispatch) => {
    const payload = [];

    enemies.forEach((enemy) => {
        const { types } = enemy;

        // get random value from array
        const pickedAttack = Math.floor(Math.random() * types.length);
        payload.push(pickedAttack);
    });

    return dispatch({
        type: SET_BATTLE_ENEMIES_PICKED_ATTACK,
        payload,
    });
};

export default setBattleEnemiesPickedItemAction;
