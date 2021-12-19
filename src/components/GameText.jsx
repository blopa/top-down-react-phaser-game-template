import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

// Selectors
import {
    selectGameZoom,
    selectGameWidth,
    selectGameHeight,
    selectGameDomRect,
} from '../redux/selectors/selectGameSettings';

const useStyles = makeStyles((theme) => ({
    textWrapper: ({ zoom, position, domRect }) => {
        let baseStyle = {
            top: domRect?.top,
            userSelect: 'none',
            userDrag: 'none',
            fontFamily: '"Press Start 2P"',
            fontSize: `${10 * zoom}px`,
            textTransform: 'uppercase',
            position: 'absolute',
            transform: 'translate(-50%, 0%)',
        };

        if (position === 'center') {
            baseStyle = {
                ...baseStyle,
                left: '50%',
            };
        }

        return baseStyle;
    },
}));

const GameText = ({ translationKey, variables = {}, config = {} }) => {
    // Game
    const gameWidth = useSelector(selectGameWidth);
    const gameHeight = useSelector(selectGameHeight);
    const gameZoom = useSelector(selectGameZoom);
    const domRect = useSelector(selectGameDomRect);

    const { color, position } = config;

    const classes = useStyles({
        height: gameHeight,
        width: gameWidth,
        zoom: gameZoom,
        position,
        domRect,
        color,
    });

    return (
        <div className={classes.textWrapper}>
            <FormattedMessage
                id={translationKey}
                values={variables}
            />
        </div>
    );
};

export default GameText;
