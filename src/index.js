/* eslint-disable react/jsx-filename-extension */
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Store
import store from './redux/store';

// Styles
import './index.css';

// Components
import Game from './Game';

const theme = createTheme();

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Game />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);

