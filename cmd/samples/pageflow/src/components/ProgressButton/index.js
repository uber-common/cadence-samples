import styles from './ProgressButton.module.css';

const ProgressButton = ({ label, ...props }) => (
  <button
    className={styles.progressButton}
    {...props}
  >
    {label}
  </button>
);

export default ProgressButton;
