import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import ProductPage from './ProductPage';
import ProductSuccessPage from './ProductSuccessPage';
import ReviewPage from './ReviewPage';
import {
  selectProduct,
} from '../state/productSlice';

const ProductSplitViewPage = () => {
  const { productId } = useParams();
  const { status: productStatus } = useSelector((state) => selectProduct(state, productId));

  if (productStatus === 'UNKNOWN') {
    return <ErrorPage />;
  }

  if (productStatus === 'APPROVED') {
    return <ProductSuccessPage />;
  }

  if (productStatus === 'SUBMITTED') {
    return (
      <div className="grid">
        <div className="col-6 border-right">
          <ProductPage />
        </div>
        <div className="col-6">
          <ReviewPage />
        </div>
      </div>
    );
  }

  return <ProductPage />;
}

export default ProductSplitViewPage;
