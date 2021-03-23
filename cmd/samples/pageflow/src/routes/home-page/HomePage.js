import { Link } from "react-router-dom";

const Home = () => (
  <div className="App-content">
    <h1>Home page</h1>
    <Link to="/product" className="App-link">
      Create a new product
    </Link>
  </div>
);

export default Home;
