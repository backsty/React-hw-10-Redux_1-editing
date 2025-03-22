import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, SortDirection, SortField } from '@/types';

const initialState: FilterState = {
  nameFilter: '',
  sortField: null,
  sortDirection: 'asc',
  priceRange: {
    min: null,
    max: null,
  },
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField | null>) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload;
    },
    toggleSort: (state, action: PayloadAction<SortField>) => {
      // Усли выбрано то же поле, меняем направление
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // Усли выбрано новое поле, устанавливаем его и сбрасываем направление на 'asc'
        state.sortField = action.payload;
        state.sortDirection = 'asc';
      }
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.priceRange = action.payload;
    },
    clearFilters: (state) => {
      (state.nameFilter = ''),
        (state.sortField = null),
        (state.sortDirection = 'asc'),
        (state.priceRange = {
          min: null,
          max: null,
        });
    },
  },
});

export const {
  setNameFilter,
  setSortField,
  setSortDirection,
  toggleSort,
  setPriceRange,
  clearFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
