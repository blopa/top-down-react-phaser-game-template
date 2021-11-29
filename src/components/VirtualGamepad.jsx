import { useCallback, useEffect, useRef } from 'react';
import { Geom } from 'phaser';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

// Images
import dPadButton from '../assets/images/d_pad_button.png';
import aButton from '../assets/images/a_button.png';
import bButton from '../assets/images/b_button.png';

// Selectors
import { selectGameHeight, selectGameWidth, selectGameZoom } from '../redux/selectors/selectGameData';
import { simulateKeyEvent } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
    buttonsWrapper: ({ zoom }) => ({
        display: 'flex',
        justifyContent: 'space-between',
        padding: `0 ${15 * zoom}px`,
        marginTop: `-${85 * zoom}px`,
        position: 'relative',
        zIndex: 10,
    }),
    button: ({ zoom, width }) => ({
        pointerEvents: 'none',
        '-webkit-touch-callout': 'none',
        userSelect: 'none',
    }),
    aButton: ({ zoom, width }) => ({
        width: `${40 * zoom}px`,
        height: `${40 * zoom}px`,
    }),
    bButton: ({ zoom, width }) => ({
        width: `${40 * zoom}px`,
        height: `${40 * zoom}px`,
    }),
    dPadWrapper: ({ zoom, width }) => ({
        width: `${76 * zoom}px`,
        height: `${76 * zoom}px`,
    }),
    dPadLeft: ({ zoom, width }) => ({
        width: `${38 * zoom}px`,
        height: `${30.5 * zoom}px`,
        marginBottom: `-${19 * zoom}px`,
    }),
    dPadRight: ({ zoom, width }) => ({
        transform: 'rotate(180deg)',
        width: `${38 * zoom}px`,
        height: `${30.5 * zoom}px`,
        marginBottom: `-${19 * zoom}px`,
    }),
    dPadUp: ({ zoom, width }) => ({
        transform: 'rotate(90deg)',
        width: `${38 * zoom}px`,
        height: `${30.5 * zoom}px`,
        marginLeft: `-${57 * zoom}px`,
    }),
    dPadDown: ({ zoom, width }) => ({
        transform: 'rotate(270deg)',
        width: `${38 * zoom}px`,
        height: `${30.5 * zoom}px`,
        marginLeft: `-${38 * zoom}px`,
        marginBottom: `-${38 * zoom}px`,
    }),
}));

const VirtualGamepad = () => {
    const gameWidth = useSelector(selectGameWidth);
    const gameHeight = useSelector(selectGameHeight);
    const gameZoom = useSelector(selectGameZoom);

    const classes = useStyles({
        width: gameWidth,
        height: gameHeight,
        zoom: gameZoom,
    });

    const dPadLeftRef = useRef(null);
    const dPadRightRef = useRef(null);
    const dPadUpRef = useRef(null);
    const dPadDownRef = useRef(null);
    const aButtonRef = useRef(null);
    const bButtonRef = useRef(null);

    const wasAButtonClicked = useCallback((x, y) => {
        const { width, x: elX, y: elY } = aButtonRef.current.getBoundingClientRect();
        const radius = width / 2;
        const circle = new Geom.Circle(
            // this is needed because Circles have origin set to 0.5
            elX + radius,
            elY + radius,
            radius
        );

        return circle.contains(x, y);
    }, [aButtonRef]);

    const wasBButtonClicked = useCallback((x, y) => {
        const { width, x: elX, y: elY } = bButtonRef.current.getBoundingClientRect();
        const radius = width / 2;
        const circle = new Geom.Circle(
            // this is needed because Circles have origin set to 0.5
            elX + radius,
            elY + radius,
            radius
        );

        return circle.contains(x, y);
    }, [bButtonRef]);

    const wasLeftButtonClicked = useCallback((x, y) => {
        const { left, right, top, bottom, height } = dPadLeftRef.current.getBoundingClientRect();
        const polygon = new Geom.Polygon([
            { x: left, y: top },
            { x: right - 31, y: top },
            { x: right, y: top + (height / 2) },
            { x: right - 31, y: bottom },
            { x: left, y: bottom },
        ]);

        return polygon.contains(x, y);
    }, [dPadLeftRef]);

    const wasUpButtonClicked = useCallback((x, y) => {
        const { left, right, top, bottom, width } = dPadUpRef.current.getBoundingClientRect();
        const polygon = new Geom.Polygon([
            { x: left, y: top },
            { x: right, y: top },
            { x: right, y: bottom - 31 },
            { x: left + (width / 2), y: bottom },
            { x: left, y: bottom - 31 },
        ]);

        return polygon.contains(x, y);
    }, [dPadUpRef]);

    const wasRightButtonClicked = useCallback((x, y) => {
        const { left, right, top, bottom, height } = dPadRightRef.current.getBoundingClientRect();
        const polygon = new Geom.Polygon([
            { x: left, y: top + (height / 2) },
            { x: left + 31, y: top },
            { x: right, y: top },
            { x: right, y: bottom },
            { x: left + 31, y: bottom },
        ]);

        return polygon.contains(x, y);
    }, [dPadRightRef]);

    const wasDownButtonClicked = useCallback((x, y) => {
        const { left, right, top, bottom, width } = dPadDownRef.current.getBoundingClientRect();
        const polygon = new Geom.Polygon([
            { x: left + (width / 2), y: top },
            { x: right, y: top + 31 },
            { x: right, y: bottom },
            { x: left, y: bottom },
            { x: left, y: top + 31 },
        ]);

        return polygon.contains(x, y);
    }, [dPadDownRef]);

    const handleButtonPressed = useCallback((event, type) => {
        const { x, y } = event;

        if (wasLeftButtonClicked(x, y)) {
            simulateKeyEvent('ArrowLeft', type);
            console.log('left pressed');
        }

        if (wasRightButtonClicked(x, y)) {
            simulateKeyEvent('ArrowRight', type);
            console.log('right pressed');
        }

        if (wasUpButtonClicked(x, y)) {
            simulateKeyEvent('ArrowUp', type);
            console.log('up pressed');
        }

        if (wasDownButtonClicked(x, y)) {
            simulateKeyEvent('ArrowDown', type);
            console.log('down pressed');
        }

        if (wasAButtonClicked(x, y)) {
            simulateKeyEvent('Space', type);
            console.log('a pressed');
        }

        if (wasBButtonClicked(x, y)) {
            simulateKeyEvent('Enter', type);
            console.log('b pressed');
        }
    }, [
        wasAButtonClicked,
        wasBButtonClicked,
        wasUpButtonClicked,
        wasDownButtonClicked,
        wasLeftButtonClicked,
        wasRightButtonClicked,
    ]);

    useEffect(() => {
        document.addEventListener('pointerdown', (event) => {
            handleButtonPressed(event, 'down');
        });

        document.addEventListener('pointerup', (event) => {
            handleButtonPressed(event, 'up');
        });

        document.addEventListener('pointerout', (event) => {
            handleButtonPressed(event, 'up');
        });
    }, [handleButtonPressed]);

    const handleContextMenuCallback = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }, []);

    return (
        <div className={classes.buttonsWrapper}>
            <div className={classes.dPadWrapper}>
                <img
                    ref={dPadLeftRef}
                    className={classNames(classes.button, classes.dPadLeft)}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={dPadRightRef}
                    className={classNames(classes.button, classes.dPadRight)}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={dPadUpRef}
                    className={classNames(classes.button, classes.dPadUp)}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={dPadDownRef}
                    className={classNames(classes.button, classes.dPadDown)}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
            </div>
            <div>
                <img
                    ref={aButtonRef}
                    className={classNames(classes.button, classes.aButton)}
                    src={aButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={bButtonRef}
                    className={classNames(classes.button, classes.bButton)}
                    src={bButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
            </div>
        </div>
    );
};

export default VirtualGamepad;
