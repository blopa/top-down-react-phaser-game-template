/* eslint-disable import/no-unresolved, import/no-webpack-loader-syntax */
import { useCallback, useEffect, useRef } from 'react';
import { Geom } from 'phaser';
import classNames from 'classnames';

// Images
import dPadButton from '../../assets/images/d_pad_button.png';
import aButton from '../../assets/images/a_button.png';
import bButton from '../../assets/images/b_button.png';

// Utils
import { simulateKeyEvent } from '../../utils/utils';

// Constants
import {
    ENTER_KEY,
    SPACE_KEY,
    ARROW_UP_KEY,
    ARROW_DOWN_KEY,
    ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY,
} from '../../constants';

// Styles
import styles from './VirtualGamepad.module.scss';

function VirtualGamepad() {
    // TODO redo this with that answer from stackoverflow
    // https://stackoverflow.com/a/70192263/4307769

    const dPadLeftRef = useRef(null);
    const dPadRightRef = useRef(null);
    const dPadUpRef = useRef(null);
    const dPadDownRef = useRef(null);
    const aButtonRef = useRef(null);
    const bButtonRef = useRef(null);
    const eventRef = useRef({});

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

    const getPressedButton = useCallback((x, y) => {
        if (wasLeftButtonClicked(x, y)) {
            return [ARROW_LEFT_KEY, dPadLeftRef];
        }

        if (wasRightButtonClicked(x, y)) {
            return [ARROW_RIGHT_KEY, dPadRightRef];
        }

        if (wasUpButtonClicked(x, y)) {
            return [ARROW_UP_KEY, dPadUpRef];
        }

        if (wasDownButtonClicked(x, y)) {
            return [ARROW_DOWN_KEY, dPadDownRef];
        }

        if (wasAButtonClicked(x, y)) {
            return [SPACE_KEY, aButtonRef];
        }

        if (wasBButtonClicked(x, y)) {
            return [ENTER_KEY, bButtonRef];
        }

        return [];
    }, [
        wasAButtonClicked,
        wasBButtonClicked,
        wasUpButtonClicked,
        wasDownButtonClicked,
        wasLeftButtonClicked,
        wasRightButtonClicked,
    ]);

    const handleButtonPressed = useCallback((event, type) => {
        const { x, y } = event;

        const [pressedButton, element] = getPressedButton(x, y);
        if (pressedButton && element) {
            simulateKeyEvent(pressedButton, type);
            if (type === 'down') {
                element.current.classList.add(styles['is-touched']);
            } else {
                element.current.classList.remove(styles['is-touched']);
            }
        }
    }, [getPressedButton]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            eventRef.current = event;
            handleButtonPressed(event, 'down');
        };
        document.addEventListener('pointerdown', handlePointerDown);

        const handlePointerUp = (event) => {
            handleButtonPressed(eventRef.current, 'up');
            eventRef.current = {};
        };
        document.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [handleButtonPressed]);

    const handleContextMenuCallback = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }, []);

    return (
        <div className={styles['buttons-wrapper']}>
            <div className={styles['d-pad-wrapper']}>
                <img
                    ref={dPadLeftRef}
                    className={classNames(styles.button, styles['d-pad-left'])}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={dPadRightRef}
                    className={classNames(styles.button, styles['d-pad-right'])}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={dPadUpRef}
                    className={classNames(styles.button, styles['d-pad-up'])}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={dPadDownRef}
                    className={classNames(styles.button, styles['d-pad-down'])}
                    src={dPadButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
            </div>
            <div>
                <img
                    ref={aButtonRef}
                    className={classNames(styles.button, styles['a-button'])}
                    src={aButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
                <img
                    ref={bButtonRef}
                    className={classNames(styles.button, styles['b-button'])}
                    src={bButton}
                    alt="test"
                    onContextMenu={handleContextMenuCallback}
                />
            </div>
        </div>
    );
}

export default VirtualGamepad;
