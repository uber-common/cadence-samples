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

  useEffect(() => {
    dispatch(resetProductModel());
  }, [dispatch]);

  const { name: productName , description: productDescription } = useSelector(selectModelProduct);

  return (
    <div className="App-content">
      <h1>Create a product</h1>
      <form onSubmit={(event) => dispatch(createProduct(event))}>
        <label>Product name:</label><br />
        <input
          name="name"
          onChange={event => dispatch(updateProductModel(event))}
          value={productName}
        /><br /><br />

        <label>Product description:</label><br />
        <textarea
          name="description"
          onChange={event => dispatch(updateProductModel(event))}
          value={productDescription}
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
              label="Create"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Product;
