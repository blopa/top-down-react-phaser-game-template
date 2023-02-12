import { useMemo } from 'react';
import { animated, useTransition } from '@react-spring/web';

// Styles
import styles from './Message.module.scss';

function Message({
    message = '',
    trail = 35,
    onMessageEnded = () => {},
    forceShowFullMessage = false,
}) {
    const items = useMemo(
        () => [...message.trim()].map((letter, index) => ({
            item: letter,
            key: index,
        })),
        [message]
    );

    const transitions = useTransition(items, {
        trail,
        from: { display: 'none' },
        enter: { display: '' },
        onRest: (status, controller, item) => {
            if (item.key === items.length - 1) {
                onMessageEnded();
            }
        },
    });

    return (
        <div className={styles['dialog-message']}>
            {forceShowFullMessage && (
                <span>{message}</span>
            )}

            {!forceShowFullMessage && transitions((animatedStyles, { item, key }) => (
                <animated.span key={key} style={animatedStyles}>
                    {item}
                </animated.span>
            ))}
        </div>
    );
}

export default Message;
