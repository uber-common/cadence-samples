import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

const Button = ({
  className = 'button',
  label,
  tag = 'button',
  ...props
}) => {
  const ButtonComponent = tag === 'link' ?
    Link :
    'button';

  const classNames = [
    styles.button,
    className === 'progressButton' && styles.progressButton,
  ].join(' ');

  return (
    <ButtonComponent
      className={classNames}
      {...props}
    >
      {label}
    </ButtonComponent>
  )
};

Button.propTypes = {
  className: PropTypes.oneOf(['button', 'progressButton']),
  label: PropTypes.string,
  tag: PropTypes.oneOf(['button', 'link']),
};

export default Button;
