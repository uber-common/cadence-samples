import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  resetProductDescription,
  selectModelProduct,
  selectProduct,
  submitProduct,
  updateProductModel,
  updateProductDescription,
  withdrawProduct,
} from '../state/productSlice';
import { Button, ProgressButton } from '../components';

const ProductPage = () => {
  const { productName } = useParams();
  const dispatch = useDispatch();

  const { description: productModelDescription } = useSelector(selectModelProduct);
  const {
    description: productDescription,
    status: productStatus,
  } = useSelector((state) => selectProduct(state, productName));

  useEffect(() => {
    dispatch(resetProductDescription(productName));
  }, [dispatch, productName]);

  const isDescriptionEqual = productModelDescription === productDescription;

  const isFormDisabled = productStatus === 'SUBMITTED';

  const isCancelDisabled = isFormDisabled || isDescriptionEqual;
  const isSaveDisabled = isFormDisabled || isDescriptionEqual || productModelDescription === '';
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
          value={productModelDescription}
        /><br /><br />

        <div className="grid">
          <div className="col-3">
            <Button
              disabled={isCancelDisabled}
              label="Cancel"
              onClick={() => !isCancelDisabled && dispatch(resetProductDescription(productName))}
            />
          </div>
          <div className="col-3">
            <ProgressButton
              disabled={isSaveDisabled}
              label="Save"
              onClick={() => !isSaveDisabled && dispatch(updateProductDescription(productName))}
            />
          </div>
          <div className="col-3">
            <ProgressButton
              disabled={isSubmitDisabled}
              label="Submit"
              onClick={() => !isSubmitDisabled && dispatch(submitProduct(productName))}
            />
          </div>
          <div className="col-3">
            <ProgressButton
              disabled={isWithdrawDisabled}
              label="Withdraw"
              onClick={() => !isWithdrawDisabled && dispatch(withdrawProduct(productName))}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductPage;
