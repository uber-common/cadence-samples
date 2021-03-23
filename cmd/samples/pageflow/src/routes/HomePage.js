import { LinkButton } from '../components';

const Home = () => {
  return (
    <div className="App-content">
      <h1>Product home page</h1>
      <LinkButton
        label="Create a new product"
        to="/products"
      />
    </div>
  );
}

export default Home;
