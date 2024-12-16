import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import propertiesReducer from './propertiesSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    modal: modalReducer,
  },
});
