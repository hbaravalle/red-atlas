import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import propertiesReducer from './propertiesSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    modal: modalReducer,
  },
});
