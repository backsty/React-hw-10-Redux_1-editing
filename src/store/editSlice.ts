import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditState, ItemFormState, FormMode } from '@/types';

const initialState: EditState = {
  mode: 'add',
  editingItemId: null,
  formData: { name: '', price: '' },
};

export const editSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    startEditing: (state, action: PayloadAction<{ id: string; formData: ItemFormState }>) => {
      state.mode = 'edit';
      state.editingItemId = action.payload.id;
      state.formData = action.payload.formData;
    },
    cancelEditing: (state) => {
      state.mode = 'add';
      state.editingItemId = null;
      state.formData = { name: '', price: '' };
    },
    updateFormData: (state, action: PayloadAction<ItemFormState>) => {
      state.formData = action.payload;
    },
    setFormMode: (state, action: PayloadAction<FormMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { startEditing, cancelEditing, updateFormData, setFormMode } = editSlice.actions;
export default editSlice.reducer;
