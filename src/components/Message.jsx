import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { animated, useTransition } from 'react-spring';

const classes = {
    dialogMessage: 'Message-dialogMessage',
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.dialogMessage}`]: ({ zoom }) => ({
        fontFamily: '"Press Start 2P"',
        fontSize: `${6 * zoom}px`,
        textTransform: 'uppercase',
        lineHeight: `${8 * zoom}px`,
    }),
}));

const Message = ({ message = [], trail = 35, zoom = 1, onMessageEnded = () => {}, forceShowFullMessage = false }) => {
    const items = useMemo(
        () =>
            message
                .trim()
                .split('')
                .map((letter, index) => ({
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
        <Root className={classes.dialogMessage}>
            {forceShowFullMessage && <span>{message}</span>}

            {!forceShowFullMessage &&
                transitions((styles, { item, key }) => (
                    <animated.span key={key} style={styles}>
                        {item}
                    </animated.span>
                ))}
        </Root>
    );
};

export default Message;
