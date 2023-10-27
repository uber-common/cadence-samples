import {
  configureStore,
} from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';

import createReducer from './reducers';

const configureAppStore = (initialState = {}, history) => {
  const store = configureStore({
    reducer: createReducer({ history }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }).concat(routerMiddleware(history)),
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

export default configureAppStore;
