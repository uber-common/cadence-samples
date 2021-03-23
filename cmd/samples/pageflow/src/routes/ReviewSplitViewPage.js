import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductPage from './ProductPage';
import ProductSuccessPage from './ProductSuccessPage';
import ReviewPage from './ReviewPage';
import {
  selectProductStatus,
} from '../state/productSlice';

const ReviewSplitView = () => {
  const { productId } = useParams();
  const productStatus = useSelector((state) => selectProductStatus(state, productId));

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

export default ReviewSplitView;
