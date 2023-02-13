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
        () => gameHeight - itemsListDOM.offsetHeight || 0,
        [gameHeight, itemsListDOM.offsetHeight]
    );

    const diceSize = useMemo(() => 40 * gameZoom, [gameZoom]);

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
                            ...index === 0 && { marginTop: `${50 * gameZoom}px` },
                            ...index === 1 && {
                                marginTop: `${50 * gameZoom}px`,
                                marginLeft: `${50 * gameZoom}px`,
                            },
                            ...index === 2 && {
                                marginTop: `${100 * gameZoom}px`,
                                marginLeft: `${50 * gameZoom}px`,
                            },
                            ...index === 3 && { marginLeft: `${50 * gameZoom}px` },
                            ...index > 3 && {
                                marginLeft: `${50 * gameZoom * (index - 2)}px`,
                                marginTop: `${50 * gameZoom}px`,
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
