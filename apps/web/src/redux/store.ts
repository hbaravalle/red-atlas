import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { propertiesApi } from './propertiesApi';
import propertiesReducer from './propertiesSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    [propertiesApi.reducerPath]: propertiesApi.reducer,
  },
  // Adds caching, cache expiry and refetching for RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(propertiesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks, so components do not repeat the state and dispatch types
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
