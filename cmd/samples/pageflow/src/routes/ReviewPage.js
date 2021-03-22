import { Link } from "react-router-dom";

const ReviewPage = () => (
  <div class="App-content">
    <h1>Review product</h1>
    <form>
      <dl>
        <dt>Product name:</dt>
        {/* TODO - hook up value */}
        <dd class="dd">PRODUCT_NAME</dd><br />

        <dt>Product Status:</dt>
        {/* TODO - hook up value */}
        <dd class="dd">PRODUCT_STATUS</dd><br />

        <dt>Product Description:</dt>
        {/* TODO - hook up value */}
        <dd class="dd">PRODUCT_DESCRIPTION</dd>
      </dl>

      <div class="grid">
        <div class="col-6">
          {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
          <Link to="/product/abc" class="App-link">
            Reject
          </Link>
        </div>
        <div class="col-6">
          {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
          <Link to="/product/abc/success" class="App-link">
            Approve
          </Link>
        </div>
      </div>
    </form>
  </div>
);

export default ReviewPage;
