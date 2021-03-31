import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createProduct,
  resetProductError,
  resetProductModel,
  selectModelProduct,
  selectProductError,
  updateProductModel,
} from '../state/productSlice';
import { Button } from '../components';

const CreateProductPage = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectProductError);

  useEffect(() => {
    dispatch(resetProductModel());
    dispatch(resetProductError());
  }, [dispatch]);

  const { name: productName } = useSelector(selectModelProduct);
  const isCreateDisabled = productName === '';

  return (
    <div className="App-content">
      <h1>Create a product</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <label for="name">Product name:</label><br />
        <input
          id="name"
          name="name"
          onChange={event => dispatch(updateProductModel(event))}
          value={productName}
        /><br />
        {error && (
          <div>This name has already been registered</div>
        )}
        <br />

        <div className="grid">
          <div className="col-6">
            <Button
              label="Cancel"
              tag="link"
              to="/"
            />
          </div>
          <div className="col-6">
            <Button
              className="progressButton"
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

export default CreateProductPage;
