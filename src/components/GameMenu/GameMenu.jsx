import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

// Store
import { useGameStore } from '../../zustand/store';

// Constants
import { ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY } from '../../constants';

// Selectors
import {
    selectMenuItems,
    selectMenuOnSelect,
    selectMenuPosition,
} from '../../zustand/menu/selectMenu';

// Utils
import { getTranslationVariables } from '../../utils/utils';

// Styles
import styles from './GameMenu.module.scss';

function GameMenu() {
    // Menu
    const position = useGameStore(selectMenuPosition);
    const items = useGameStore(selectMenuItems);
    const onSelected = useGameStore(selectMenuOnSelect);

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    useEffect(() => {
        const handleKeyPressed = (e) => {
            switch (e.code) {
                case ENTER_KEY: {
                    onSelected(items[selectedItemIndex]);
                    break;
                }

                case ARROW_UP_KEY: {
                    if (selectedItemIndex > 0) {
                        setSelectedItemIndex(
                            selectedItemIndex - 1
                        );
                    }

                    break;
                }

                case ARROW_DOWN_KEY: {
                    if (items.length - 1 > selectedItemIndex) {
                        setSelectedItemIndex(
                            selectedItemIndex + 1
                        );
                    }

                    break;
                }

                default: {
                    break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyPressed);

        return () => window.removeEventListener('keydown', handleKeyPressed);
    }, [items, onSelected, selectedItemIndex]);

    return (
        <div
            className={classNames(styles['menu-wrapper'], {
                [styles['position-left']]: position === 'left',
                [styles['position-center']]: position === 'center',
                [styles['position-right']]: position === 'right',
            })}
        >
            <ul className={styles['menu-items-wrapper']}>
                {items.map((item, index) => {
                    const [key, variables] = getTranslationVariables(item);

                    return (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                        <li
                            key={key}
                            className={classNames(styles['menu-item'], {
                                [styles['selected-menu-item']]: selectedItemIndex === index,
                            })}
                            onMouseEnter={() => {
                                setSelectedItemIndex(index);
                            }}
                            onClick={() => {
                                onSelected(key, item);
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

export default GameMenu;
