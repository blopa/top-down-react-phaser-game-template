import { animated, useSpring } from '@react-spring/web';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// Components
import Message from './Message/Message';

// Selectors
import {
    selectDialogAction,
    selectDialogMessages,
    selectDialogCharacterName,
} from '../zustand/dialog/selectDialog';
import { selectGameHeight, selectGameZoom } from '../zustand/game/selectGameData';

// Constants
import { ENTER_KEY, ESCAPE_KEY, SPACE_KEY } from '../constants';

// Store
import { useGameStore } from '../zustand/store';

function MessageBox({
    showNext = false,
    dialogWindowClassname = null,
    dialogTitleClassname = null,
    dialogFooterClassname = null,
    show = false,
}) {
    const intl = useIntl();
    const gameZoom = useGameStore(selectGameZoom);
    const gameHeight = useGameStore(selectGameHeight);
    const dialogAction = useGameStore(selectDialogAction);
    const dialogMessages = useGameStore(selectDialogMessages);
    const characterName = useGameStore(selectDialogCharacterName);

    const [currentMessage, setCurrentMessage] = useState(0);
    const [messageEnded, setMessageEnded] = useState(false);
    const [forceShowFullMessage, setForceShowFullMessage] = useState(false);
    const [shouldShowMessage, setShouldShowMessage] = useState(false);
    const dialogDone = currentMessage === dialogMessages.length - 1 && messageEnded;

    const springOnRestCallback = useCallback(({ finished }) => {
        setShouldShowMessage(finished && show);
    }, [show]);

    const animatedStyles = useSpring({
        config: { duration: 250 },
        from: { transform: `translate(-50%, ${gameHeight * gameZoom}px)` },
        to: { transform: show ? 'translate(-50%, 0%)' : `translate(-50%, ${gameHeight * gameZoom}px)` },
        onRest: springOnRestCallback,
    });

    useEffect(() => {
        if (!show) {
            setCurrentMessage(0);
            setMessageEnded(false);
            setShouldShowMessage(false);
            setForceShowFullMessage(false);
        }
    }, [show]);

    const handleClick = useCallback(() => {
        if (!shouldShowMessage) {
            return;
        }

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
    }, [shouldShowMessage, messageEnded, currentMessage, dialogMessages.length, dialogAction]);

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
        <animated.div className={dialogWindowClassname} style={animatedStyles}>
            <div className={dialogTitleClassname}>
                {characterName}
            </div>
            {shouldShowMessage && (
                <Message
                    message={dialogMessages[currentMessage]}
                    key={currentMessage}
                    forceShowFullMessage={forceShowFullMessage}
                    onMessageEnded={() => {
                        setMessageEnded(true);
                    }}
                />
            )}
            {showNext && (
                <div
                    onClick={handleClick}
                    className={dialogFooterClassname}
                >
                    {dialogDone ? intl.formatMessage({ id: 'ok' }) : intl.formatMessage({ id: 'next' })}
                </div>
            )}
        </animated.div>
    );
}

export default MessageBox;
