import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import editReducer from './editSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    edit: editReducer,
    filter: filterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export * from './itemsSlice';
export * from './editSlice';
export * from './filterSlice';
