/* eslint-disable react/jsx-filename-extension */
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';

// Store
import store from './redux/store';

// Styles
import './index.css';

// Components
import Game from './Game';

const theme = createTheme();

ReactDOM.render(
    <Provider store={store}>
        <Helmet>
            <title>My Phaser Game</title>
        </Helmet>
        <ThemeProvider theme={theme}>
            <Game />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);

