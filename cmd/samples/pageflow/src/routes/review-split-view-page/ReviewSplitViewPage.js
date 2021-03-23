import ProductPage from '../product-page/ProductPage';
import ReviewPage from '../review-page/ReviewPage';

const ReviewSplitView = () => (
  <div class="grid">
    <div class="col-6 border-right">
      <ProductPage />
    </div>
    <div class="col-6">
      <ReviewPage />
    </div>
  </div>
);

export default ReviewSplitView;
