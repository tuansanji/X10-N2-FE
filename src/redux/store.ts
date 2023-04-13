import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './authSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: authReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
    reducer: persistedReducer
})

export const persistor = persistStore(store)