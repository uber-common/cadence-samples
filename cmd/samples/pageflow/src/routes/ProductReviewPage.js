import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  approveProduct,
  selectProduct,
  rejectProduct,
} from '../state/productSlice';
import { ProgressButton } from '../components';

const ProductReviewPage = () => {
  const { productName } = useParams();
  const dispatch = useDispatch();

  const {
    description: productDescription,
    status: productStatus
  } = useSelector((state) => selectProduct(state, productName));

  return (
    <div className="App-content">
      <h1>Review product</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <dl>
          <dt>Product name:</dt>
          <dd className="dd">{productName}</dd><br />

          <dt>Product Status:</dt>
          <dd className="dd">{productStatus}</dd><br />

          <dt>Product Description:</dt>
          <dd className="dd">{productDescription}</dd>
        </dl>

        <div className="grid">
          <div className="col-6">
            <ProgressButton
              label="Reject"
              onClick={() => dispatch(rejectProduct(productName))}
            />
          </div>
          <div className="col-6">
            <ProgressButton
              label="Approve"
              onClick={() => dispatch(approveProduct(productName))}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductReviewPage;
