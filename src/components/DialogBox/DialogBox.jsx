// Components
import MessageBox from '../MessageBox';

// Styles
import styles from './DialogBox.module.scss';

const DialogBox = () => (
    <MessageBox
        dialogWindowClassname={styles['dialog-window']}
        dialogTitleClassname={styles['dialog-title']}
        dialogFooterClassname={styles['dialog-footer']}
        showNext
    />
);

export default DialogBox;
