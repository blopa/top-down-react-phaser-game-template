import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useResizeObserver } from 'beautiful-react-hooks';

// Selectors
import { selectGameCanvasElement } from '../redux/selectors/selectGameData';

// Constants
import { OVERLAY_DIV_RESIZE_THRESHOLD } from '../constants';

// Hooks
import useMutationObserver from '../hooks/useMutationObserver';

const Battle = () => {
    const canvas = useSelector(selectGameCanvasElement);
    const ref = useMemo(() => ({ current: canvas }), [canvas]);
    const DOMRect = useResizeObserver(ref, OVERLAY_DIV_RESIZE_THRESHOLD);

    const [mutatedStyles, setMutatedStyles] = useState({});
    const defaultStyles = useMemo(() => ({
        backgroundColor: '#fff',
        position: 'absolute',
        ...DOMRect,
    }), [DOMRect]);

    useMutationObserver(ref, () => {
        setMutatedStyles({
            marginLeft: canvas?.style?.marginLeft,
            marginTop: canvas?.style?.marginTop,
        });
    });

    return (
        <div
            style={{
                ...defaultStyles,
                ...mutatedStyles,
            }}
        >
            <p>Battle</p>
        </div>
    );
};

export default Battle;
