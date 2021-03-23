import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  resetProductState,
} from '../state/productSlice';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetProductState());
  });

  return (
    <div className="App-content">
      <h1>Home page</h1>
      <Link to="/products" className="App-link">
        Create a new product
    </Link>
    </div>
  );
}

export default Home;
