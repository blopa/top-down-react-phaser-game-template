import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

// Selectors
import {
    selectBattleItems,
    selectBattleOnHover,
    selectBattleSetters,
    selectBattleOnSelect,
} from '../../zustand/battle/selectBattle';

// Constants
import {
    ENTER_KEY,
    ARROW_UP_KEY,
    ARROW_DOWN_KEY,
    ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY,
} from '../../constants';

// Utils
import { getTranslationVariables } from '../../utils/utils';

// Store
import { useGameStore } from '../../zustand/store';

// Styles
import styles from './Battle.module.scss';

// Components
import BattleDiceViewer from '../BattleDiceViewer/BattleDiceViewer';

function Battle() {
    const battleListRef = useRef();

    // TODO for now only works for four items
    const battleItems = useGameStore(selectBattleItems);

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const onSelected = useGameStore(selectBattleOnSelect);
    const onHover = useGameStore(selectBattleOnHover);
    const { setBattleItemsListDom } = useGameStore(selectBattleSetters);

    useEffect(() => {
        setBattleItemsListDom(battleListRef.current);
    }, [battleListRef, setBattleItemsListDom]);

    useEffect(() => {
        onHover?.(selectedItemIndex);
    }, [onHover, selectedItemIndex]);

    useEffect(() => {
        const handleKeyPressed = (e) => {
            switch (e.code) {
                case ENTER_KEY: {
                    onSelected(battleItems[selectedItemIndex], selectedItemIndex);
                    break;
                }

                case ARROW_UP_KEY: {
                    const increment = selectedItemIndex === 1 ? 1 : -2;
                    setSelectedItemIndex(
                        Math.max(0, selectedItemIndex + increment)
                    );

                    break;
                }

                case ARROW_DOWN_KEY: {
                    const increment = selectedItemIndex === battleItems.length / 2 ? -1 : 2;
                    setSelectedItemIndex(
                        Math.min(3, selectedItemIndex + increment)
                    );

                    break;
                }

                case ARROW_LEFT_KEY: {
                    setSelectedItemIndex(
                        Math.max(0, selectedItemIndex - 1)
                    );

                    break;
                }

                case ARROW_RIGHT_KEY: {
                    setSelectedItemIndex(
                        Math.min(3, selectedItemIndex + 1)
                    );

                    break;
                }

                default: {
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyPressed);

        return () => window.removeEventListener('keydown', handleKeyPressed);
    }, [battleItems, onSelected, selectedItemIndex]);

    return (
        <div className={classNames(styles['battle-wrapper'])}>
            <BattleDiceViewer />
            <ul ref={battleListRef} className={styles['battle-items-wrapper']}>
                {battleItems.map((item, index) => {
                    const [key, variables] = getTranslationVariables(item);

                    return (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                        <li
                            key={key}
                            className={classNames(styles['battle-item'], {
                                [styles['selected-battle-item']]: index === selectedItemIndex,
                                [styles['fewer-items']]: battleItems.length < 3,
                            })}
                            onMouseEnter={() => {
                                setSelectedItemIndex(index);
                            }}
                            onClick={() => {
                                onSelected?.(item, index);
                            }}
                        >
                            <FormattedMessage
                                id={key}
                                values={variables}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Battle;
