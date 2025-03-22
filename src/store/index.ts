import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import editReducer from './editSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    edit: editReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export * from './itemsSlice';
export * from './editSlice';
