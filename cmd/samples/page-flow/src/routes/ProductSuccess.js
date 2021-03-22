import { Link } from "react-router-dom";

const ProductSuccess = () => (
  <div class="App-content">
    <h1>Product PRODUCT_NAME has been approved!</h1>
    <Link to="/" class="App-link">
      Return to home page
    </Link>
  </div>
);

export default ProductSuccess;
