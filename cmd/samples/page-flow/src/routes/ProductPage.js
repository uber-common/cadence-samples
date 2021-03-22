import { Link } from "react-router-dom";

const Product = () => (
  <div class="App-content">
    <h1>Product page</h1>
    <form>
      <dl>
        <dt>Product name:</dt>
        {/* TODO - hook up value */}
        <dd class="dd">PRODUCT_NAME</dd><br />

        <dt>Product Status:</dt>
        {/* TODO - hook up value */}
        <dd class="dd">PRODUCT_STATUS</dd>
      </dl>

      <label>Product description:</label><br />
      {/* TODO - hook up value */}
      <textarea>PRODUCT_DESCRIPTION</textarea><br /><br />

      <div class="grid">
        <div class="col-3">
          {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
          <Link class="App-link">
            Cancel
          </Link>
        </div>
        <div class="col-3">
          {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
          <Link class="App-link">
            Save
          </Link>
        </div>
        <div class="col-3">
          {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
          <Link to="/product/abc/review" class="App-link">
            Submit
          </Link>
        </div>
        <div class="col-3">
          {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
          <Link to="/product/abc" class="App-link">
            Withdraw
          </Link>
        </div>
      </div>
    </form>
  </div>
);

export default Product;
