import { Link } from "react-router-dom";

const Product = () => (
  <div className="App-content">
    <h1>Product page</h1>
    <form>
      <dl>
        <dt>Product name:</dt>
        {/* TODO - hook up value */}
        <dd className="dd">PRODUCT_NAME</dd><br />

        <dt>Product Status:</dt>
        {/* TODO - hook up value */}
        <dd className="dd">PRODUCT_STATUS</dd>
      </dl>

      <label>Product description:</label><br />
      {/* TODO - hook up value */}
      <textarea value="PRODUCT_DESCRIPTION"></textarea><br /><br />

      <div className="grid">
        <div className="col-3">
          {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
          <Link className="App-link">
            Cancel
          </Link>
        </div>
        <div className="col-3">
          {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
          <Link className="App-link">
            Save
          </Link>
        </div>
        <div className="col-3">
          {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
          <Link to="/product/abc/review" className="App-link">
            Submit
          </Link>
        </div>
        <div className="col-3">
          {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
          <Link to="/product/abc" className="App-link">
            Withdraw
          </Link>
        </div>
      </div>
    </form>
  </div>
);

export default Product;
