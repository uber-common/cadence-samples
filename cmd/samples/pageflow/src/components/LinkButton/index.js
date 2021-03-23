import { Link } from 'react-router-dom';
import styles from './LinkButton.module.css';

const LinkButton = ({ label, ...props }) => (
  <Link
    className={styles.linkButton}
    {...props}
  >
    {label}
  </Link>
);

export default LinkButton;
