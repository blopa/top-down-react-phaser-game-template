export const selectPlayers = (state) => state.players.players;

export const selectMyPlayerId = (state) => state.players.myPlayerId;

export const selectMyCharacterId = (state) => state.players.myCharacterId;

export const selectMyPlayer = (state) => {
    const myPlayerId = selectMyPlayerId(state);

    return state.players.players.find(
        (player) => player.playerId === myPlayerId
    );
};
