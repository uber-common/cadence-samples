import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counterReducer from '../features/counter/counterSlice';
import productReducer from '../state/productSlice';

import history from './history';

console.log('productReducer = ', productReducer);

const createReducer = (injectedReducers = {}) => {
  const rootReducer = combineReducers({
    counter: counterReducer,
    product: productReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
};

export default createReducer;
