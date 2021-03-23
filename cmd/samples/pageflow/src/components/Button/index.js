import styles from './Button.module.css';

const Button = ({ label, ...props }) => (
  <button
    className={styles.button}
    {...props}
  >
    {label}
  </button>
);

export default Button;
