import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  approveProduct,
  selectProductDescription,
  selectProductName,
  selectProductStatus,
  rejectProduct,
} from '../state/productSlice';
import { ProgressButton } from '../components';

const ReviewPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const productDescription = useSelector((state) => selectProductDescription(state, productId));
  const productName = useSelector((state) => selectProductName(state, productId));
  const productStatus = useSelector((state) => selectProductStatus(state, productId));

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
            {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
            <ProgressButton
              label="Reject"
              onClick={() => dispatch(rejectProduct(productId))}
            />
          </div>
          <div className="col-6">
            {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
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
