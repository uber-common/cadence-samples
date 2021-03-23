import { Button, LinkButton } from '../components';

const Product = () => {
  const productId = 'abc';

  return (
    <div className="App-content">
      <h1>Product page</h1>
      <form onSubmit={(event) => event.preventDefault()}>
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
            <Button label="Cancel" />
          </div>
          <div className="col-3">
            {/* TODO
           - Setup onclick handler
           - Setup enable / disable
           - Setup loading spinner
           */}
            <Button label="Save" />
          </div>
          <div className="col-3">
            {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
            <LinkButton label="Submit" to={`/products/${productId}/review`} />
          </div>
          <div className="col-3">
            {/* TODO
          - Setup onclick handler
          - Setup enable / disable
          - Setup loading spinner
          */}
            <LinkButton label="Withdraw" to={`/products/${productId}`} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Product;
