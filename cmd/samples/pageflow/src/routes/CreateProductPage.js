import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
  selectModelProductName,
  selectModelProductDescription,
  updateModelField,
} from '../state/productSlice';

const Product = () => {
  const productName = useSelector(selectModelProductName);
  const productDescription = useSelector(selectModelProductDescription);
  const dispatch = useDispatch();

  return (
    <div className="App-content">
      <h1>Create a product</h1>
      <form>
        <label>Product name:</label><br />
        <input
          name="name"
          onChange={event => dispatch(updateModelField(event))}
          value={productName}
        /><br /><br />
        {/* onChange={dispatch(updateModelField('name'))} */}

        <label>Product description:</label><br />
        <textarea
          name="description"
          onChange={event => dispatch(updateModelField(event))}
          value={productDescription}
        /><br /><br />
        {/* onChange={dispatch(updateModelField('description'))} */}

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
            <Link to="/product/abc" className="App-link">
              Create
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Product;
