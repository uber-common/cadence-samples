import {
  configureStore,
} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { routerMiddleware } from 'connected-react-router';

import createReducer from './reducers';

const configureAppStore = (initialState = {}, history) => {
  const persistConfig = {
    key: 'root',
    storage,
  }

  const store = configureStore({
    reducer: persistReducer(persistConfig, createReducer({ history })),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }).concat(routerMiddleware(history)),
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export default configureAppStore;
