import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import LoadingPage from './LoadingPage';
import ProductPage from './ProductPage';
import ProductReviewPage from './ProductReviewPage';
import {
  fetchProduct,
  selectProduct,
  selectProductError,
} from '../state/productSlice';
import { EndStatePage } from '../components';

const ProductSplitViewPage = () => {
  const { productName } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => selectProduct(state, productName));
  const error = useSelector(selectProductError);

  useEffect(() => {
    dispatch(fetchProduct(productName));
  }, [dispatch, productName]);

  if (error) {
    return <ErrorPage />;
  }

  if (!product) {
    return <LoadingPage />;
  }

  const {
    status: productStatus,
  } = product;

  if (productStatus === 'withdrawn') {
    return <EndStatePage
      title={`Product "${productName}" has been withdrawn.`}
    />;
  }

  if (productStatus === 'approved') {
    return <EndStatePage
      title={`Product "${productName}" has been approved!`}
    />;
  }

  if (productStatus === 'submitted') {
    return (
      <div className="grid">
        <div className="col-6 border-right">
          <ProductPage />
        </div>
        <div className="col-6">
          <ProductReviewPage />
        </div>
      </div>
    );
  }

  return <ProductPage />;
}

export default ProductSplitViewPage;
