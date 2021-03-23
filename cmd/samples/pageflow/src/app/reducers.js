import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counterReducer from '../features/counter/counterSlice';
import productReducer from '../state/productSlice';

const createReducer = ({ history, ...injectedReducers } = {}) => {
  const rootReducer = combineReducers({
    counter: counterReducer,
    products: productReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
};

export default createReducer;
