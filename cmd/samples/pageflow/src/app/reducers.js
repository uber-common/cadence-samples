import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counterReducer from '../features/counter/counterSlice';

import history from './history';

const createReducer = (injectedReducers = {}) => {
  const rootReducer = combineReducers({
    counter: counterReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
};

export default createReducer;
