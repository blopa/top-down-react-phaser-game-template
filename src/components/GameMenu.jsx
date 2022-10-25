import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Constants
import { ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY } from '../constants';

// Selectors
import { selectGameHeight, selectGameWidth, selectGameZoom } from '../redux/selectors/selectGameData';
import { selectMenuItems, selectMenuOnSelect, selectMenuPosition } from '../redux/selectors/selectMenu';

// Utils
import { getTranslationVariables } from '../utils/utils';

const PREFIX = 'GameMenu';

const classes = {
    menuWrapper: `${PREFIX}-menuWrapper`,
    menuPositionWrapper: `${PREFIX}-menuPositionWrapper`,
    menuItemsWrapper: `${PREFIX}-menuItemsWrapper`,
    menuItem: `${PREFIX}-menuItem`,
    selectedMenuItem: `${PREFIX}-selectedMenuItem`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.menuWrapper}`]: ({ zoom }) => ({
        fontFamily: '"Press Start 2P"',
        fontSize: `${10 * zoom}px`,
        textTransform: 'uppercase',
        position: 'absolute',
        transform: 'translate(-50%, 0%)',
    }),

    [`&.${classes.menuPositionWrapper}`]: ({ zoom, position, width, height }) => {
        const left = window.innerWidth - width * zoom;
        const menuWidth = 160 * zoom;
        if (position === 'center') {
            return {
                minWidth: `${menuWidth}px`,
                left: '50%',
                top: `${(height * zoom) / 2}px`,
            };
        }

        if (position === 'left') {
            return {
                minWidth: `${menuWidth}px`,
                left: `${95 * zoom + left / 2}px`,
                top: `${50 * zoom}px`,
            };
        }

        return {};
    },

    [`& .${classes.menuItemsWrapper}`]: {
        textAlign: 'center',
        padding: 0,
    },

    [`& .${classes.menuItem}`]: ({ zoom }) => ({
        cursor: 'pointer',
        listStyle: 'none',
        padding: `${5 * zoom}px`,
        marginBottom: `${5 * zoom}px`,
        backgroundColor: '#94785c',
        border: `${zoom}px solid #79584f`,
    }),

    [`& .${classes.selectedMenuItem}`]: ({ zoom }) => ({
        fontSize: `${11 * zoom}px`,
        border: `${zoom}px solid #ddd`,
    }),
}));

const GameMenu = () => {
    // Game
    const gameWidth = useSelector(selectGameWidth);
    const gameHeight = useSelector(selectGameHeight);
    const gameZoom = useSelector(selectGameZoom);

    // Menu
    const position = useSelector(selectMenuPosition);
    const items = useSelector(selectMenuItems);
    const onSelected = useSelector(selectMenuOnSelect);

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
                        setSelectedItemIndex(selectedItemIndex - 1);
                    }

                    break;
                }

                case ARROW_DOWN_KEY: {
                    if (items.length - 1 > selectedItemIndex) {
                        setSelectedItemIndex(selectedItemIndex + 1);
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
        <Root
            className={classNames(classes.menuWrapper, classes.menuPositionWrapper)}
            width={gameWidth}
            height={gameHeight}
            zoom={gameZoom}
            position={position}
        >
            <ul className={classes.menuItemsWrapper}>
                {items.map((item, index) => {
                    const [key, variables] = getTranslationVariables(item);

                    return (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                        <li
                            key={key}
                            className={classNames(classes.menuItem, {
                                [classes.selectedMenuItem]: selectedItemIndex === index,
                            })}
                            onMouseEnter={() => {
                                setSelectedItemIndex(index);
                            }}
                            onClick={() => {
                                onSelected(key, item);
                            }}
                        >
                            <FormattedMessage id={key} values={variables} />
                        </li>
                    );
                })}
            </ul>
        </Root>
    );
};

export default GameMenu;
