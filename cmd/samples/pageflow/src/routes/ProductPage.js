import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  resetProductDescription,
  selectModelProduct,
  selectProduct,
  updateProductModel,
  updateProductDescription,
  updateProductState,
} from '../state/productSlice';
import { Button } from '../components';

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
  const isModelDescriptionEmpty = productModelDescription === '';
  const isDescriptionEmpty = productDescription === '';

  const isFormDisabled = productStatus === 'submitted';

  const isCancelDisabled = isFormDisabled || isDescriptionEqual;
  const isSaveDisabled = isFormDisabled || isDescriptionEqual || isModelDescriptionEmpty;
  const isSubmitDisabled = isFormDisabled || !isDescriptionEqual || isDescriptionEmpty;
  const isWithdrawDisabled = productStatus !== 'submitted';

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
            <Button
              className="progressButton"
              disabled={isSaveDisabled}
              label="Save"
              onClick={() => !isSaveDisabled && dispatch(updateProductDescription(productName))}
            />
          </div>
          <div className="col-3">
            <Button
              className="progressButton"
              disabled={isSubmitDisabled}
              label="Submit"
              onClick={() => !isSubmitDisabled && dispatch(updateProductState({ name: productName, state: 'submit' }))}
            />
          </div>
          <div className="col-3">
            <Button
              className="progressButton"
              disabled={isWithdrawDisabled}
              label="Withdraw"
              onClick={() => !isWithdrawDisabled && dispatch(updateProductState({ name: productName, state: 'withdraw' }))}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductPage;
