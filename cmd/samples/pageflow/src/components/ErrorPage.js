import { LinkButton } from '../components';

const ErrorPage = () => {
  return (
    <div className="App-content">
      <h1>Oops, something went wrong!</h1>
      <LinkButton
        label=""
        to="/"
      />
    </div>
  );
}

export default ErrorPage;
