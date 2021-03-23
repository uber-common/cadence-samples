import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  resetProductDescription,
  selectModelProductDescription,
  selectProductName,
  selectProductStatus,
  updateProductModel,
  updateProductDescription,
} from '../state/productSlice';
import { Button, LinkButton } from '../components';

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const productDescription = useSelector(selectModelProductDescription);
  const productName = useSelector((state) => selectProductName(state, productId));
  const productStatus = useSelector((state) => selectProductStatus(state, productId));

  return (
    <div className="App-content">
      <h1>Product page</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <dl>
          <dt>Product name:</dt>
          {/* TODO - hook up value */}
          <dd className="dd">{productName}</dd><br />

          <dt>Product Status:</dt>
          {/* TODO - hook up value */}
          <dd className="dd">{productStatus}</dd>
        </dl>

        <label>Product description:</label><br />
        {/* TODO - hook up value */}
        <textarea
          name="description"
          onChange={event => dispatch(updateProductModel(event))}
          value={productDescription}
        /><br /><br />

        <div className="grid">
          <div className="col-3">
            {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
            <Button
              label="Cancel"
              onClick={() => dispatch(resetProductDescription(productId))}
            />
          </div>
          <div className="col-3">
            <Button
              label="Save"
              onClick={() => dispatch(updateProductDescription(productId))}
            />
          </div>
          <div className="col-3">
            {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
            <LinkButton label="Submit" to={`/products/${productId}/review`} />
          </div>
          <div className="col-3">
            {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
            <LinkButton label="Withdraw" to={`/products/${productId}`} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Product;
