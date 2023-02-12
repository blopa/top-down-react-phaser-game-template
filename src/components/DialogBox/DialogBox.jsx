// Components
import MessageBox from '../MessageBox';

// Styles
import styles from './DialogBox.module.scss';

function DialogBox({ show = false }) {
    return (
        <MessageBox
            dialogWindowClassname={styles['dialog-window']}
            dialogFooterClassname={styles['dialog-footer']}
            dialogTitleClassname={styles['dialog-title']}
            show={show}
            showNext
        />
    );
}

export default DialogBox;
