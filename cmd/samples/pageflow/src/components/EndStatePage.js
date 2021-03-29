import { LinkButton } from '../components';

const EndStatePage = ({ title }) => (
  <div className="App-content">
    <h1>{title}</h1>
    <LinkButton label="Return to home page" to="/" />
  </div>
);

export default EndStatePage;
