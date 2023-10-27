import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import productReducer from '../state/productSlice';

const createReducer = ({ history, ...injectedReducers } = {}) => {
  const rootReducer = combineReducers({
    products: productReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
};

export default createReducer;
