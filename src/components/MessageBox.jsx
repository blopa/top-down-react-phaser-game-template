import { useCallback, useEffect, useState } from 'react';

// Components
import Message from './Message';

// Selectors
import { selectGameZoom } from '../zustand/selectors/selectGameData';
import { selectDialogAction, selectDialogCharacterName, selectDialogMessages } from '../zustand/selectors/selectDialog';

// Constants
import { ENTER_KEY, ESCAPE_KEY, SPACE_KEY } from '../constants';

// Store
import { useStore } from '../zustand/store';

const MessageBox = ({
    showNext = false,
    dialogWindowClassname = null,
    dialogTitleClassname = null,
    dialogFooterClassname = null,
}) => {
    const dialogMessages = useStore(selectDialogMessages);
    const dialogAction = useStore(selectDialogAction);
    const gameZoom = useStore(selectGameZoom);
    const characterName = useStore(selectDialogCharacterName);

    const [currentMessage, setCurrentMessage] = useState(0);
    const [messageEnded, setMessageEnded] = useState(false);
    const [forceShowFullMessage, setForceShowFullMessage] = useState(false);

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
        <div className={dialogWindowClassname}>
            <div className={dialogTitleClassname}>
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
            {showNext && (
                <div
                    onClick={handleClick}
                    className={dialogFooterClassname}
                >
                    {(currentMessage === dialogMessages.length - 1 && messageEnded) ? 'Ok' : 'Next'}
                </div>
            )}
        </div>
    );
};

export default MessageBox;
