import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ItemsState, Item } from '@/types';

const initialState: ItemsState = {
  items: [],
  status: 'idle',
};

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setItemsStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { addItem, updateItem, deleteItem, setItemsStatus } = itemsSlice.actions;
export default itemsSlice.reducer;
