/* eslint-disable react/jsx-filename-extension */
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { Fragment } from 'react';

// Styles
import './index.css';

// Components
import Game from './Game';

const theme = createTheme();

ReactDOM.render(
    <Fragment>
        <Helmet>
            <title>My Phaser Game</title>
        </Helmet>
        <ThemeProvider theme={theme}>
            <Game />
        </ThemeProvider>
    </Fragment>,
    document.getElementById('root')
);

