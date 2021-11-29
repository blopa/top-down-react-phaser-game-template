import { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

// Components
import Message from './Message';

// Selectors
import { selectGameHeight, selectGameWidth, selectGameZoom } from '../redux/selectors/selectGameData';
import { selectDialogAction, selectDialogCharacterName, selectDialogMessages } from '../redux/selectors/selectDialog';

// Constants
import { ENTER_KEY, ESCAPE_KEY, SPACE_KEY } from '../constants';

const useStyles = makeStyles((theme) => ({
    dialogWindow: ({ width, height, zoom }) => ({
        imageRendering: 'pixelated',
        fontFamily: '"Press Start 2P"',
        textTransform: 'uppercase',
        backgroundColor: '#e2b27e',
        border: 'solid',
        padding: `${8 * zoom}px`,
        position: 'absolute',
        bottom: `${Math.ceil(window.innerHeight - (height * zoom) + (height * 0.05))}px`,
        width: `${Math.ceil(width * 0.8 * zoom)}px`,
        left: '50%',
        transform: 'translate(-50%, 0%)',
        minHeight: `${Math.ceil((height / 4) * zoom)}px`,
        maxHeight: `${Math.ceil((height / 3) * zoom)}px`,
    }),
    dialogTitle: ({ zoom }) => ({
        fontSize: `${8 * zoom}px`,
        marginBottom: `${6 * zoom}px`,
        fontWeight: 'bold',
    }),
    dialogFooter: ({ zoom }) => ({
        fontSize: `${8 * zoom}px`,
        cursor: 'pointer',
        textAlign: 'end',
        position: 'absolute',
        right: `${6 * zoom}px`,
        bottom: `${6 * zoom}px`,
    }),
}));

const DialogBox = () => {
    const dialogMessages = useSelector(selectDialogMessages);
    const dialogAction = useSelector(selectDialogAction);
    const gameWidth = useSelector(selectGameWidth);
    const gameHeight = useSelector(selectGameHeight);
    const gameZoom = useSelector(selectGameZoom);
    const characterName = useSelector(selectDialogCharacterName);

    const [currentMessage, setCurrentMessage] = useState(0);
    const [messageEnded, setMessageEnded] = useState(false);
    const [forceShowFullMessage, setForceShowFullMessage] = useState(false);
    const classes = useStyles({
        width: gameWidth,
        height: gameHeight,
        zoom: gameZoom,
    });

    const handleClick = useCallback(() => {
        if (messageEnded) {
            setMessageEnded(false);
            setForceShowFullMessage(false);
            if (currentMessage < dialogMessages.length - 1) {
                setCurrentMessage(currentMessage + 1);
            } else {
                setCurrentMessage(0);
                dialogAction?.();
            }
        } else {
            setMessageEnded(true);
            setForceShowFullMessage(true);
        }
    }, [dialogAction, currentMessage, messageEnded, dialogMessages.length]);

    useEffect(() => {
        const handleKeyPressed = (e) => {
            if ([ENTER_KEY, SPACE_KEY, ESCAPE_KEY].includes(e.code)) {
                handleClick();
            }
        };
        window.addEventListener('keydown', handleKeyPressed);

        return () => window.removeEventListener('keydown', handleKeyPressed);
    }, [dialogMessages.length, handleClick]);

    return (
        <div className={classes.dialogWindow}>
            <div className={classes.dialogTitle}>
                {characterName}
            </div>
            <Message
                message={dialogMessages[currentMessage]}
                key={currentMessage}
                zoom={gameZoom}
                forceShowFullMessage={forceShowFullMessage}
                onMessageEnded={() => {
                    setMessageEnded(true);
                }}
            />
            <div
                onClick={handleClick}
                className={classes.dialogFooter}
            >
                {(currentMessage === dialogMessages.length - 1 && messageEnded) ? 'Ok' : 'Next'}
            </div>
        </div>
    );
};

export default DialogBox;
