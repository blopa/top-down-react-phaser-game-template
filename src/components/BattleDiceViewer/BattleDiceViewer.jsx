import { useMemo } from 'react';
import { Dice } from 'cyber-dice';

// Styles
import styles from './BattleDiceViewer.module.scss';

// Store
import { useGameStore } from '../../zustand/store';

// Selectors
import { selectGameZoom } from '../../zustand/game/selectGameData';
import { selectHeroEquipedInventoryDice } from '../../zustand/hero/selectHeroData';
import { selectBattleHoveredItem } from '../../zustand/battle/selectBattle';

function BattleDiceViewer() {
    const equipedDice = useGameStore(selectHeroEquipedInventoryDice);
    const hoveredItem = useGameStore(selectBattleHoveredItem);
    const gameZoom = useGameStore(selectGameZoom);
    const diceSize = useMemo(() => 40 * gameZoom, [gameZoom]);
    const faceStyles = useMemo(() => ({
        marginRight: `-${30 * gameZoom}px`,
    }), [gameZoom]);

    if (equipedDice.length === 0 || hoveredItem === null || hoveredItem === 3) {
        return null;
    }

    const { faces: diceFaces } = equipedDice[hoveredItem];
    return (
        <div
            className={styles['dice-faces-wrapper']}
            style={{
                marginTop: `${90 * gameZoom}px`,
            }}
        >
            <ul className={styles['dice-faces-list-wrapper']}>
                {diceFaces.map((faceNumber, index) => (
                    <li
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={styles.face}
                        style={{
                            ...faceStyles,
                            ...index === 1 && { marginTop: `${50 * gameZoom}px` },
                            ...index === 2 && {
                                marginTop: `-${50 * gameZoom}px`,
                                marginLeft: `-${50 * gameZoom}px`,
                            },
                            ...index === 3 && { marginLeft: `-${50 * gameZoom}px` },
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
