export const selectGameRooms = (state) => state.gameManager.rooms;

export const selectGameRoom = (roomId) => (state) => state.gameManager.rooms[roomId];

export const selectGameCurrentRoom = (state) => state.gameManager.currentRoom;
