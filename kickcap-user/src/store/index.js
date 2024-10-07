import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import storageSession from 'redux-persist/lib/storage/session';
import modalReducer from './modal';
import locationReducer from './location';
import carouselModalReducer from './carouselModal';

const reducers = combineReducers({
  modal: modalReducer,
  location: locationReducer,
  carouselModal: carouselModalReducer,
});

const persistConfig = {
  key: 'redux-state',
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
