import { useMemo } from 'react';
import { Dice } from 'cyber-dice';

// Styles
import styles from './BattleDiceViewer.module.scss';

// Store
import { useGameStore } from '../../zustand/store';

// Selectors
import { selectGameHeight, selectGameZoom } from '../../zustand/game/selectGameData';
import { selectHeroEquipedInventoryDice } from '../../zustand/hero/selectHeroData';
import { selectBattleHoveredItem, selectBattleItemsListDOM } from '../../zustand/battle/selectBattle';

function BattleDiceViewer() {
    const equipedDice = useGameStore(selectHeroEquipedInventoryDice);
    const itemsListDOM = useGameStore(selectBattleItemsListDOM);
    const hoveredItem = useGameStore(selectBattleHoveredItem);
    const gameHeight = useGameStore(selectGameHeight);
    const gameZoom = useGameStore(selectGameZoom);
    const availableScreenHeight = useMemo(
        // eslint-disable-next-line no-unsafe-optional-chaining
        () => gameHeight - (itemsListDOM?.offsetHeight || 0) / gameZoom,
        [gameZoom, gameHeight, itemsListDOM?.offsetHeight]
    );

    const baseDiceSize = useMemo(
        () => Math.min((availableScreenHeight / 5), 40), [availableScreenHeight]
    );
    const diceSize = useMemo(() => baseDiceSize * gameZoom, [gameZoom, baseDiceSize]);
    const diceMargin = useMemo(() => (diceSize * 1.25), [diceSize]);

    if (equipedDice.length === 0 || hoveredItem === null || hoveredItem === 3) {
        return null;
    }

    const { faces: diceFaces } = equipedDice[hoveredItem];
    return (
        <div
            className={styles['dice-faces-wrapper']}
            style={{
                // marginTop: `${90 * gameZoom}px`,
            }}
        >
            <ul className={styles['dice-faces-list-wrapper']}>
                {diceFaces.map((faceNumber, index) => (
                    <li
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={styles.face}
                        style={{
                            ...index === 0 && { marginTop: `${diceMargin}px` },
                            ...index === 1 && {
                                marginTop: `${diceMargin}px`,
                                marginLeft: `${diceMargin}px`,
                            },
                            ...index === 2 && {
                                marginTop: `${diceMargin * 2}px`,
                                marginLeft: `${diceMargin}px`,
                            },
                            ...index === 3 && { marginLeft: `${diceMargin}px` },
                            ...index > 3 && {
                                marginLeft: `${diceMargin * (index - 2)}px`,
                                marginTop: `${diceMargin}px`,
                            },
                        }}
                    >
                        <Dice
                            randomNumber={faceNumber}
                            size={diceSize}
                            key={diceSize}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BattleDiceViewer;
