import { Link } from "react-router-dom";

const Product = () => (
  <div class="App-content">
    <h1>Create a product</h1>
    <form>
      <label>Product name:</label><br />
      <input /><br /><br />

      <label>Product description:</label><br />
      <textarea></textarea><br /><br />

      <div class="grid">
        <div class="col-6">
          <Link to="/" class="App-link">
            Cancel
          </Link>
        </div>
        <div class="col-6">
          {/* TODO
          - Setup onclick handler
          - Setup loading spinner
          */}
          <Link to="/product/abc" class="App-link">
            Create
          </Link>
        </div>
      </div>
    </form>
  </div>
);

export default Product;
