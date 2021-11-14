import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    font: {
        fontFamily: '"Press Start 2P"',
    },
}));

const PreLoadFonts = () => {
    const classes = useStyles();

    return (
        <p className={classes.font}>
            a
        </p>
    );
};

export default PreLoadFonts;
