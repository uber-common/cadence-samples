import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
  createProduct,
  resetProductModel,
  selectModelProductName,
  selectModelProductDescription,
  updateProductModel,
} from '../state/productSlice';
import { ProgressButton } from '../components';

const Product = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetProductModel());
  }, []);

  const productName = useSelector(selectModelProductName);
  const productDescription = useSelector(selectModelProductDescription);

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
            <Link to="/" className="App-link">
              Cancel
            </Link>
          </div>
          <div className="col-6">
            {/* TODO
            - Setup onclick handler
            - Setup loading spinner
            */}
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
