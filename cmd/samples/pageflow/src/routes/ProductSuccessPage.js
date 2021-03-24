import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectProduct,
} from '../state/productSlice';
import { LinkButton } from '../components';

const ProductSuccessPage = () => {
  const { productId } = useParams();
  const { name: productName } = useSelector((state) => selectProduct(state, productId));

  return (
    <div className="App-content">
      <h1>Product "{productName}" has been approved!</h1>
      <LinkButton label="Return to home page" to="/" />
    </div>
  );
};

export default ProductSuccessPage;
