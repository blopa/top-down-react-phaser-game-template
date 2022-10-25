import { FormattedMessage } from 'react-intl';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

// Selectors
import {
    selectGameZoom,
    selectGameWidth,
    selectGameHeight,
    selectGameCanvasElement,
} from '../redux/selectors/selectGameData';

// Hooks
import useRect from '../hooks/useRect';

const PREFIX = 'GameText';

const classes = {
    textWrapper: `${PREFIX}-textWrapper`,
    textPositionWrapper: `${PREFIX}-textPositionWrapper`,
    text: `${PREFIX}-text`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.textWrapper}`]: ({ zoom, top, position, domRect }) => ({
        top: `${(domRect?.top || 0) + top * zoom}px`,
        userSelect: 'none',
        userDrag: 'none',
        position: 'absolute',
        textAlign: position,
        width: `calc(100% - ${(domRect?.left || 0) * 2 + 10 * zoom}px)`,
        transform: 'translate(-50%, 0%)',
    }),

    [`&.${classes.textPositionWrapper}`]: ({ position }) => {
        if (position === 'center') {
            return {
                left: '50%',
            };
        }

        return {};
    },

    [`& .${classes.text}`]: ({ zoom, color, size }) => ({
        fontFamily: '"Press Start 2P"',
        fontSize: `${size * zoom}px`,
        textTransform: 'uppercase',
        margin: 0,
        color,
    }),
}));

const GameText = ({ translationKey, variables = {}, config = {}, component: Component = 'p' }) => {
    // Game
    const gameWidth = useSelector(selectGameWidth);
    const gameHeight = useSelector(selectGameHeight);
    const gameZoom = useSelector(selectGameZoom);
    const canvas = useSelector(selectGameCanvasElement);
    const domRect = useRect(canvas);

    const { color = '#FFFFFF', position = 'center', top = 0, size = 10 } = config;

    return (
        <Root
            className={classNames(classes.textWrapper, classes.textPositionWrapper)}
            height={gameHeight}
            width={gameWidth}
            zoom={gameZoom}
            position={position}
            domRect={domRect}
            color={color}
            size={size}
            top={top}
        >
            <Component className={classes.text}>
                <FormattedMessage id={translationKey} values={variables} />
            </Component>
        </Root>
    );
};

export default GameText;
