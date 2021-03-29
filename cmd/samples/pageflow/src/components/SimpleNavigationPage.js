import { LinkButton } from '../components';

const SimpleNavigationPage = ({
  linkText = 'Return to home page',
  linkTo = '/',
  title,
}) => (
  <div className="App-content">
    <h1>{title}</h1>
      <LinkButton
        label={linkText}
        to={linkTo}
      />
  </div>
);

export default SimpleNavigationPage;
