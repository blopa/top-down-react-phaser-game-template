import { useMemo } from 'react';
import { animated, useTransition } from 'react-spring';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    dialogMessage: ({ zoom }) => ({
        fontFamily: '"Press Start 2P"',
        fontSize: `${6 * zoom}px`,
        textTransform: 'uppercase',
        lineHeight: `${8 * zoom}px`,
    }),
}));

const Message = ({
    message = [],
    trail = 35,
    zoom = 1,
    onMessageEnded = () => {},
    forceShowFullMessage = false,
}) => {
    const classes = useStyles({ zoom });
    const items = useMemo(
        () => message.trim().split('').map((letter, index) => ({
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
        <div className={classes.dialogMessage}>
            {forceShowFullMessage && (
                <span>{message}</span>
            )}

            {!forceShowFullMessage && transitions((styles, { item, key }) => (
                <animated.span key={key} style={styles}>
                    {item}
                </animated.span>
            ))}
        </div>
    );
};

export default Message;
