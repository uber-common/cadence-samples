import ProductPage from '../product-page/ProductPage';
import ReviewPage from '../review-page/ReviewPage';

const ReviewSplitView = () => (
  <div className="grid">
    <div className="col-6 border-right">
      <ProductPage />
    </div>
    <div className="col-6">
      <ReviewPage />
    </div>
  </div>
);

export default ReviewSplitView;
