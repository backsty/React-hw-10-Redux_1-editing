export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface ItemFormState {
  name: string;
  price: string;
}

export type FormMode = 'add' | 'edit';

/**
 * Интерфейс для состояния редактирования
 */
export interface EditState {
  mode: FormMode;
  editingItemId: string | null;
  formData: ItemFormState;
}

/**
 * Интерфейс для состояния списка элементов в Redux
 */
export interface ItemsState {
  items: Item[];
  status: 'idle' | 'loading' | 'failed';
}

/**
 * Интерфейс для корневого состояния приложения в Redux
 */
export interface RootState {
  items: ItemsState;
  edit: EditState;
}
