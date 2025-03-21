import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";

const persistConfig = {
 key: "root",
 storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
 reducer: {
  auth: persistedReducer,
 },
 middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
   serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
