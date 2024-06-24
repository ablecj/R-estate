import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './User/userSlice'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage';



// mking an root reducer
const rootReducer = combineReducers({user: userReducer});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
}

// creating an persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
  
})


export const persistor = persistStore(store);












