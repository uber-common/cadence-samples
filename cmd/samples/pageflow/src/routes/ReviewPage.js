import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  approveProduct,
  selectProduct,
  rejectProduct,
} from '../state/productSlice';
import { ProgressButton } from '../components';

const ReviewPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const {
    description: productDescription,
    name: productName,
    status: productStatus
  } = useSelector((state) => selectProduct(state, productId));

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
              onClick={() => dispatch(rejectProduct(productId))}
            />
          </div>
          <div className="col-6">
            <ProgressButton
              label="Approve"
              onClick={() => dispatch(approveProduct(productId))}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReviewPage;
