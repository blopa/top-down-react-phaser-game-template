import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

// Selectors
import classNames from 'classnames';
import { selectGameWidth, selectGameZoom } from '../redux/selectors/selectGameData';

// Constants
import { ARROW_DOWN_KEY, ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ENTER_KEY } from '../constants';
import { getTranslationVariables } from '../utils/utils';
import { selectMenuOnSelect } from '../redux/selectors/selectMenu';

const useStyles = makeStyles((theme) => ({
    battleItemsWrapper: ({ width, height, zoom }) => {
        const borderSize = zoom;

        return {
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
        };
    },
    battleItem: ({ width, zoom }) => {
        const margin = Math.round(width * zoom * 0.003);
        const borderSize = zoom;

        return {
            cursor: 'pointer',
            padding: '3% 0',
            minWidth: `${Math.floor((width * zoom) / 2) - (margin * 2) - (borderSize * 2)}px`,
            margin: `${margin}px`,
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
    const gameWidth = useSelector(selectGameWidth);
    const gameZoom = useSelector(selectGameZoom);
    const classes = useStyles({
        width: gameWidth,
        zoom: gameZoom,
    });

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const onSelected = useSelector(selectMenuOnSelect);

    // TODO for now only works for four items
    const items = ['melee', 'magic', 'defend', 'run'];

    useEffect(() => {
        const handleKeyPressed = (e) => {
            switch (e.code) {
                case ENTER_KEY: {
                    onSelected(items[selectedItemIndex]);
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
                    const increment = selectedItemIndex === items.length / 2 ? -1 : 2;
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
    }, [items, onSelected, selectedItemIndex]);

    return (
        <div>
            <ul className={classes.battleItemsWrapper}>
                {items.map((item, index) => {
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
                                onSelected(item);
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
