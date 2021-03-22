import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';

import createReducer from './reducers';

const configureAppStore = (initialState = {}, history) => {
  // const enhancers = [
  //   createInjectorsEnhancer({
  //     createReducer,
  //     runSaga,
  //   }),
  // ];

  // const middlewares = [routerMiddleware];

  const store = configureStore({
    reducer: createReducer(),
    // middleware: [...getDefaultMiddleware(), ...middlewares],
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  // if (module.hot) {
  //   module.hot.accept('./reducers', () => {
  //     forceReducerReload(store);
  //   });
  // }

  return store;
};

export default configureAppStore;
