import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

// Components
import MessageBox from './MessageBox';

// Selectors
import { selectGameHeight, selectGameWidth, selectGameZoom } from '../redux/selectors/selectGameData';

const useStyles = makeStyles((theme) => ({
    dialogWindow: ({ width, height, zoom }) => ({
        imageRendering: 'pixelated',
        fontFamily: '"Press Start 2P"',
        textTransform: 'uppercase',
        backgroundColor: '#e2b27e',
        border: 'solid',
        padding: `${8 * zoom}px`,
        position: 'absolute',
        // bottom: `${Math.ceil((height * zoom * 0.05))}px`,
        // width: `${Math.ceil(width * zoom * 0.8)}px`,
        bottom: '5%',
        width: '80%',
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
    const gameWidth = useSelector(selectGameWidth);
    const gameHeight = useSelector(selectGameHeight);
    const gameZoom = useSelector(selectGameZoom);

    const classes = useStyles({
        width: gameWidth,
        height: gameHeight,
        zoom: gameZoom,
    });

    return (
        <MessageBox
            dialogWindowClassname={classes.dialogWindow}
            dialogTitleClassname={classes.dialogTitle}
            dialogFooterClassname={classes.dialogFooter}
            showNext
        />
    );
};

export default DialogBox;
