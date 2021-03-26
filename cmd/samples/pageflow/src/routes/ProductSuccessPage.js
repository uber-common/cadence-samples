import { useParams } from 'react-router-dom';
import { LinkButton } from '../components';

const ProductSuccessPage = () => {
  const { productName } = useParams();

  return (
    <div className="App-content">
      <h1>Product "{productName}" has been approved!</h1>
      <LinkButton label="Return to home page" to="/" />
    </div>
  );
};

export default ProductSuccessPage;
