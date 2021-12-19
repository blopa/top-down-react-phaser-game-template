import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// Selectors
import {
    selectGameZoom,
    selectGameWidth,
    selectGameHeight,
    selectGameCanvasElement,
} from '../redux/selectors/selectGameSettings';

// images
import crystalImage from '../assets/images/crystal.png';

// Constants
import { CRYSTAL_SPRITE_NAME } from '../utils/constants';

const useStyles = makeStyles((theme) => ({
    itemCountWrapper: ({ zoom, domRect }) => {
        return {
            top: `${(domRect?.top || 0) + (10 * zoom)}px`,
            left: `${(domRect?.left || 0) + (10 * zoom)}px`,
            userSelect: 'none',
            userDrag: 'none',
            display: 'flex',
            position: 'absolute',
            alignItems: 'flex-start',
        };
    },
    itemImage: ({ zoom }) => {
        return {
            imageRendering: 'pixelated',
            transform: `scale(${zoom})`,
        };
    },
    quantityText: ({ zoom }) => {
        return {
            fontFamily: '"Press Start 2P"',
            fontSize: `${10 * zoom}px`,
            textTransform: 'uppercase',
            margin: 0,
            color: '#FFFFFF',
            marginLeft: `${7 * zoom}px`,
        };
    },
}));

const images = {
    [CRYSTAL_SPRITE_NAME]: crystalImage,
};

const ItemCount = ({ itemType, quantity }) => {
    // Game
    const gameWidth = useSelector(selectGameWidth);
    const gameHeight = useSelector(selectGameHeight);
    const gameZoom = useSelector(selectGameZoom);
    const canvas = useSelector(selectGameCanvasElement);

    const domRect = useMemo(
        () => canvas?.getBoundingClientRect() || {},
        [gameWidth, gameHeight, gameZoom, canvas]
    );

    const classes = useStyles({
        height: gameHeight,
        width: gameWidth,
        zoom: gameZoom,
        domRect,
    });

    return (
        <div className={classes.itemCountWrapper}>
            <img
                alt="something"
                src={images[itemType]}
                className={classes.itemImage}
            />
            <p className={classes.quantityText}>
                {quantity.toString().padStart(2, '0')}
            </p>
        </div>
    );
};

export default ItemCount;
