import { useParams } from 'react-router-dom';
import { LinkButton } from '../components';

const ProductWithdrawnPage = () => {
  const { productName } = useParams();

  return (
    <div className="App-content">
      <h1>Product "{productName}" has been withdrawn.</h1>
      <LinkButton label="Return to home page" to="/" />
    </div>
  );
};

export default ProductWithdrawnPage;
