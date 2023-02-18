export const selectBattleItems = (state) => state.battle.items;

export const selectBattleEnemies = (state) => state.battle.enemies;

export const selectBattleSkills = (state) => state.battle.skills;

export const selectBattleOnSelect = (state) => state.battle.onSelect;

export const selectBattleOnHover = (state) => state.battle.onHover;

export const selectBattleItemsListDOM = (state) => state.battle.itemsListDOM;

export const selectBattlePickedItem = (state) => state.battle.pickedItem;

export const selectBattleHoveredItem = (state) => state.battle.hoveredItem;

export const selectBattleEnemiesPickedItem = (state) => state.battle.enemiesPickedItem;

export const selectBattleAttackDice = (state) => state.battle.attackDice;

export const selectBattleDefenseDice = (state) => state.battle.defenseDice;

export const selectBattleSetters = (state) => state.battle.setters;
