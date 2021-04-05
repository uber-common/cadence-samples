import { Button } from '../components';

const SimpleNavigationPage = ({
  linkText = 'Return to home page',
  linkTo = '/',
  title,
}) => (
  <div className="App-content">
    <h1>{title}</h1>
      <Button
        label={linkText}
        tag="link"
        to={linkTo}
      />
  </div>
);

export default SimpleNavigationPage;
