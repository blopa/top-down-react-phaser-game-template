import { useSelector } from 'react-redux';
import useResizeObserver from 'beautiful-react-hooks/useResizeObserver';

import { selectGameCanvasElement } from '../redux/selectors/selectGameData';

const Battle = () => {
    const canvas = useSelector(selectGameCanvasElement);
    const DOMRect = useResizeObserver({ current: canvas }, 1000);
    console.log({ DOMRect });

    return (
        <div>
            <p>Battle</p>
        </div>
    );
};

export default Battle;
