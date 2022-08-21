import { useEffect, useMemo, useRef } from 'react';

const useMutationObserver = (
    ref,
    callback,
    options = null
) => {
    const currentRef = useRef();

    const observerOptions = useMemo(() => {
        if (options) {
            return options;
        }

        return {
            // characterDataOldValue: true,
            // attributeOldValue: true,
            // attributeFilter: true,
            // characterData: true,
            attributes: true,
            childList: true,
            subtree: true,
        };
    }, [options]);

    useEffect(() => {
        if (ref.current && ref.current !== currentRef.current) {
            currentRef.current = ref.current;
            const observer = new MutationObserver(callback);
            observer.observe(ref.current, observerOptions);
            return () => observer.disconnect();
        }

        return () => {};
    }, [callback, observerOptions, ref.current, currentRef.current]);
};

export default useMutationObserver;
