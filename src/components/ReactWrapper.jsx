import { useCallback, useMemo, useState } from 'react';
import { useResizeObserver } from 'beautiful-react-hooks';

// Store
import { useGameStore } from '../zustand/store';

// Constants
import { OVERLAY_DIV_RESIZE_THRESHOLD } from '../constants';

// Hooks
import useMutationObserver from '../hooks/useMutationObserver';

// Components
import DialogBox from './DialogBox/DialogBox';
import GameMenu from './GameMenu/GameMenu';
import GameText from './GameText/GameText';

// Selectors
import { selectGameCanvasElement } from '../zustand/game/selectGameData';
import { selectDialogMessages } from '../zustand/dialog/selectDialog';
import { selectMenuItems } from '../zustand/menu/selectMenu';
import { selectTexts } from '../zustand/text/selectText';

function ReactWrapper() {
    const canvas = useGameStore(selectGameCanvasElement);
    const dialogMessages = useGameStore(selectDialogMessages);
    const menuItems = useGameStore(selectMenuItems);
    const gameTexts = useGameStore(selectTexts);
    // const s = useGameStore((store) => store);
    // console.log(s);
    const ref = useMemo(() => ({ current: canvas }), [canvas]);
    const DOMRect = useResizeObserver(ref, OVERLAY_DIV_RESIZE_THRESHOLD);

    const [mutatedStyles, setMutatedStyles] = useState({});
    const defaultStyles = useMemo(() => ({
        // backgroundColor: '#fff',
        position: 'absolute',
        overflow: 'hidden',
        ...DOMRect,
    }), [DOMRect]);

    const mutationObserverCallback = useCallback((mutations) => {
        const { target } = mutations.at(0);

        setMutatedStyles({
            marginLeft: target?.style?.marginLeft,
            marginTop: target?.style?.marginTop,
        });
    }, []);

    useMutationObserver(ref, mutationObserverCallback);

    const inlineStyles = useMemo(() => ({
        marginLeft: canvas?.style?.marginLeft,
        marginTop: canvas?.style?.marginTop,
        ...defaultStyles,
        ...mutatedStyles,
    }), [canvas?.style?.marginLeft, canvas?.style?.marginTop, defaultStyles, mutatedStyles]);

    // const handleWrapperClicked = useCallback((event) => {
    //     const { clientX, clientY } = event;
    //
    //     canvas.dispatchEvent(new Event('click', {
    //         clientX,
    //         clientY,
    //     }));
    // }, [canvas]);

    // TODO maybe this is not needed anymore
    // console.log(defaultStyles, mutatedStyles);
    // console.log(mutatedStyles);

    return (
        <div
            id="react-content"
            style={inlineStyles}
            // onClick={handleWrapperClicked}
        >
            <DialogBox show={dialogMessages.length > 0} />
            {menuItems.length > 0 && (
                <GameMenu />
            )}
            {gameTexts.length > 0 && gameTexts.map((text) => {
                const { key, variables, config } = text;

                return (
                    <GameText
                        key={key}
                        translationKey={key}
                        variables={variables}
                        config={config}
                    />
                );
            })}
        </div>
    );
}

export default ReactWrapper;
