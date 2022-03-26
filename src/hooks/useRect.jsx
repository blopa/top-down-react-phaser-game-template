import { useLayoutEffect, useCallback, useState } from 'react';

// code by https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
const useRect = (element) => {
    const [rect, setRect] = useState(getRect(element || null));

    const handleResize = useCallback(() => {
        if (!element) {
            return;
        }

        // Update client rect
        setRect(getRect(element));
    }, [element]);

    useLayoutEffect(() => {
        if (!element) {
            return () => {};
        }

        handleResize();
        let resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(element);

        let intersectionObserver = new IntersectionObserver(() => handleResize());
        intersectionObserver.observe(element);

        return () => {
            if (!resizeObserver) {
                return;
            }

            intersectionObserver.disconnect();
            resizeObserver.disconnect();
            resizeObserver = null;
            intersectionObserver = null;
        };
    }, [handleResize, element]);

    return rect;
};

function getRect(element) {
    if (!element) {
        return {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
        };
    }

    return element.getBoundingClientRect();
}

export default useRect;
