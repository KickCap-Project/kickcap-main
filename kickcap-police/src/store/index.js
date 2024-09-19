import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import storageSession from 'redux-persist/lib/storage/session';
import navReducer from './nav';
import pageReducer from './page';
import modalReducer from './modal';

const reducers = combineReducers({
  nav: navReducer,
  page: pageReducer,
  modal: modalReducer,
});

const persistConfig = {
  key: 'redux-state',
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;
