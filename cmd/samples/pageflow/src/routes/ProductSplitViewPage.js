import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import LoadingPage from './LoadingPage';
import ProductPage from './ProductPage';
import ProductReviewPage from './ProductReviewPage';
import ProductSuccessPage from './ProductSuccessPage';
import ProductWithdrawnPage from './ProductWithdrawnPage';
import {
  fetchProduct,
  selectProduct,
  selectProductError,
} from '../state/productSlice';

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

  const { status: productStatus } = product;

  if (productStatus === 'withdrawn') {
    return <ProductWithdrawnPage />;
  }

  if (productStatus === 'approved') {
    return <ProductSuccessPage />;
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
