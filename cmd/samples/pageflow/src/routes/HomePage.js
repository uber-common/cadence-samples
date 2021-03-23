import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetProductState } from '../state/productSlice';
import { LinkButton } from '../components';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetProductState());
  }, [dispatch]);

  return (
    <div className="App-content">
      <h1>Home page</h1>
      <LinkButton
        label="Create a new product"
        to="/products"
      />
    </div>
  );
}

export default Home;
