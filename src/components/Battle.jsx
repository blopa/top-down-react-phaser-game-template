import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

// Selectors
import { selectGameWidth, selectGameZoom } from '../redux/selectors/selectGameData';
import { selectBattleItems, selectBattleOnSelect } from '../redux/selectors/selectBattle';

// Constants
import { ARROW_DOWN_KEY, ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ENTER_KEY } from '../constants';

// Utils
import { getTranslationVariables } from '../utils/utils';

// Store
import { useStore } from '../zustand/store';

const useStyles = makeStyles((theme) => ({
    battleItemsWrapper: ({ width, height, zoom }) => {
        const borderSize = zoom;

        return {
            userSelect: 'none',
            userDrag: 'none',
            position: 'absolute',
            fontSize: `${10 * zoom}px`,
            listStyle: 'none',
            imageRendering: 'pixelated',
            fontFamily: '"Press Start 2P"',
            textTransform: 'uppercase',
            display: 'flex',
            flexWrap: 'wrap',
            margin: 0,
            padding: 0,
            bottom: 0,
            backgroundColor: '#83a37d',
            outline: `${borderSize}px solid #53814b`,
            outlineOffset: `-${borderSize}px`,
            justifyContent: 'center',
        };
    },
    battleItem: ({ width, zoom, quantity }) => {
        const margin = Math.round(width * zoom * 0.003);
        const borderSize = zoom;

        return {
            cursor: 'pointer',
            padding: '3% 0',
            minWidth: `${Math.floor((width * zoom) / 2) - (margin * 2) - (borderSize * 2)}px`,
            ...quantity < 3 && {
                width: `${(width * zoom) - (borderSize * 2)}px`,
            },
            // margin: `${margin}px`,
            margin: '0.22%',
            textAlign: 'center',
            border: `${borderSize}px solid black`,
            // '&:hover': {
            //     backgroundColor: '#fff',
            // },
        };
    },
    selectedBattleItem: {
        backgroundColor: '#53814b',
    },
}));

const Battle = () => {
    // Game
    const gameWidth = useStore(selectGameWidth);
    const gameZoom = useStore(selectGameZoom);
    const battleListRef = useRef();

    // TODO for now only works for four items
    const battleItems = useStore(selectBattleItems);

    const dispatch = useDispatch();

    const classes = useStyles({
        width: gameWidth,
        zoom: gameZoom,
        quantity: battleItems.length,
    });

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const onSelected = useStore(selectBattleOnSelect);
    const setBattleItemsListDom = useStore((state) => state.setBattleItemsListDom);

    useEffect(() => {
        setBattleItemsListDom(battleListRef.current);
    }, [dispatch, battleListRef, setBattleItemsListDom]);

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
        <div>
            <ul ref={battleListRef} className={classes.battleItemsWrapper}>
                {battleItems.map((item, index) => {
                    const [key, variables] = getTranslationVariables(item);

                    return (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                        <li
                            key={key}
                            className={classNames(classes.battleItem, {
                                [classes.selectedBattleItem]: index === selectedItemIndex,
                            })}
                            onMouseEnter={() => {
                                setSelectedItemIndex(index);
                            }}
                            onClick={() => {
                                onSelected(item, index);
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
};

export default Battle;
