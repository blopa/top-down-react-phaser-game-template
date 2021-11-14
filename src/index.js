/* eslint-disable react/jsx-filename-extension */
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Store
import configureStore from './redux/store';

// Styles
import './index.css';

// Components
import Game from './Game';
import PreLoadFonts from './components/PreLoadFonts';

const theme = createTheme();

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <PreLoadFonts />
            <Game />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);

