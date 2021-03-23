import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  resetProductDescription,
  selectIsModelProductDescriptionEqual,
  selectModelProductDescription,
  selectProductName,
  selectProductStatus,
  submitProduct,
  updateProductModel,
  updateProductDescription,
  withdrawProduct,
} from '../state/productSlice';
import { Button, LinkButton, ProgressButton } from '../components';

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const productDescription = useSelector(selectModelProductDescription);
  const productName = useSelector((state) => selectProductName(state, productId));
  const productStatus = useSelector((state) => selectProductStatus(state, productId));
  const isDescriptionEqual = useSelector((state) => selectIsModelProductDescriptionEqual(state, productId));

  const isFormDisabled = productStatus === 'SUBMITTED';

  const isCancelDisabled = isFormDisabled || isDescriptionEqual;
  const isSaveDisabled = isFormDisabled || isDescriptionEqual || productDescription === '';
  const isSubmitDisabled = isFormDisabled || !isDescriptionEqual;
  const isWithdrawDisabled = productStatus !== 'SUBMITTED';

  return (
    <div className="App-content">
      <h1>Product page</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <dl>
          <dt>Product name:</dt>
          <dd className="dd">{productName}</dd><br />

          <dt>Product Status:</dt>
          <dd className="dd">{productStatus}</dd>
        </dl>

        <label>Product description:</label><br />
        <textarea
          disabled={isFormDisabled}
          name="description"
          onChange={event => dispatch(updateProductModel(event))}
          value={productDescription}
        /><br /><br />

        <div className="grid">
          <div className="col-3">
            <Button
              disabled={isCancelDisabled}
              label="Cancel"
              onClick={() => !isCancelDisabled && dispatch(resetProductDescription(productId))}
            />
          </div>
          <div className="col-3">
            <ProgressButton
              disabled={isSaveDisabled}
              label="Save"
              onClick={() => !isSaveDisabled && dispatch(updateProductDescription(productId))}
            />
          </div>
          <div className="col-3">
            <ProgressButton
              disabled={isSubmitDisabled}
              label="Submit"
              onClick={() => !isSubmitDisabled && dispatch(submitProduct(productId))}
            />
          </div>
          <div className="col-3">
            <ProgressButton
              disabled={isWithdrawDisabled}
              label="Withdraw"
              onClick={() => !isWithdrawDisabled && dispatch(withdrawProduct(productId))}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Product;
