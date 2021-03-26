import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createProduct,
  resetProductModel,
  selectModelProduct,
  updateProductModel,
} from '../state/productSlice';
import { LinkButton, ProgressButton } from '../components';

const Product = () => {
  const dispatch = useDispatch();

  useEffect(() => dispatch(resetProductModel()), [dispatch]);

  const { name: productName } = useSelector(selectModelProduct);
  const isCreateDisabled = productName === '';

  return (
    <div className="App-content">
      <h1>Create a product</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>Product name:</label><br />
        <input
          name="name"
          onChange={event => dispatch(updateProductModel(event))}
          value={productName}
        /><br /><br />

        <div className="grid">
          <div className="col-6">
            <LinkButton
              label="Cancel"
              to="/"
            />
          </div>
          <div className="col-6">
            <ProgressButton
              disabled={isCreateDisabled}
              label="Create"
              type="submit"
              onClick={() => !isCreateDisabled && dispatch(createProduct())}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Product;
