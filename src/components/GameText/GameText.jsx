import { useEffect, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

// Selectors
import {
    selectGameZoom,
    selectGameCanvasElement,
} from '../../zustand/game/selectGameData';

// Hooks
import useRect from '../../hooks/useRect';

// Store
import { useGameStore } from '../../zustand/store';

// Styles
import styles from './GameText.module.scss';

function GameText({
    translationKey,
    variables = {},
    config = {},
    component: Component = 'p',
}) {
    // Game
    const gameZoom = useGameStore(selectGameZoom);
    const canvas = useGameStore(selectGameCanvasElement);
    const domRect = useRect(canvas);
    const textWrapperRef = useRef(null);

    const {
        color = '#FFFFFF',
        position = 'center',
        top = 0,
        size = 10,
    } = config;

    const textTop = useMemo(
        () => ((domRect?.top || 0) + (top * gameZoom)),
        [domRect?.top, gameZoom, top]
    );

    const textWidth = useMemo(
        () => (((domRect?.left || 0) * 2) + (gameZoom * 10)),
        [domRect?.left, gameZoom]
    );

    useEffect(() => {
        if (textWrapperRef.current) {
            textWrapperRef.current.style.setProperty('--game-text-align', position);
            textWrapperRef.current.style.setProperty('--game-text-color', color);
            textWrapperRef.current.style.setProperty('--game-text-size', size);
            textWrapperRef.current.style.setProperty('--game-text-top', textTop);
            textWrapperRef.current.style.setProperty('--game-text-width', textWidth);
        }
    }, [
        textWidth,
        position,
        textTop,
        color,
        size,
    ]);

    return (
        <div
            ref={textWrapperRef}
            className={classNames(styles['text-wrapper'], styles['text-position-wrapper'], {
                [styles['text-center']]: position === 'center',
            })}
        >
            <Component className={styles.text}>
                <FormattedMessage
                    id={translationKey}
                    values={variables}
                />
            </Component>
        </div>
    );
}

export default GameText;
