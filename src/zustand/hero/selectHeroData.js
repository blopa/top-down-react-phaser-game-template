export const selectHeroFacingDirection = (state) => state.heroData.facingDirection;

export const selectHeroInitialPosition = (state) => state.heroData.initialPosition;

export const selectHeroPreviousPosition = (state) => state.heroData.previousPosition;

export const selectHeroInitialFrame = (state) => state.heroData.initialFrame;

export const selectHeroInventoryDice = (state) => state.heroData.inventory.dice;

export const selectHeroEquipedInventoryDice = (state) =>
    selectHeroInventoryDice(state).filter((die) => die.equiped);

export const selectHeroSetters = (state) => state.heroData.setters;
