import { useEffect, useMemo } from 'react';

const useMutationObserver = (
    ref,
    callback,
    options = null
) => {
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
        if (ref.current) {
            const observer = new MutationObserver(callback);
            observer.observe(ref.current, observerOptions);
            return () => observer.disconnect();
        }

        return () => {};
    }, [callback, observerOptions, ref]);
};

export default useMutationObserver;
