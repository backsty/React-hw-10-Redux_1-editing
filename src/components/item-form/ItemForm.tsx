import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormMode, ItemFormState, RootState } from '@/types';
import { updateFormData } from '@/store';
import '@styles/components/item-form.css';

interface ItemFormProps {
  mode: FormMode;
  onSave: (formData: ItemFormState) => void;
  onCancel?: () => void;
  initialData?: ItemFormState;
}

export const ItemForm: React.FC<ItemFormProps> = memo(
  ({ mode, onSave, onCancel, initialData = { name: '', price: '' } }) => {
    const [formData, setFormData] = useState<ItemFormState>(initialData);
    const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

    const dispatch = useDispatch();
    const editState = useSelector((state: RootState) => state.edit);
    const itemsStatus = useSelector((state: RootState) => state.items.status);

    // Используем ref для отслеживания изменений
    const previousMode = useRef(mode);
    const previousEditingId = useRef(editState.editingItemId);

    // Синхронизируем локальное состояние с Redux только когда меняется режим или ID
    useEffect(() => {
      const modeChanged = previousMode.current !== mode;
      const editingIdChanged = previousEditingId.current !== editState.editingItemId;

      if (modeChanged || editingIdChanged) {
        if (mode === 'edit' && editState.editingItemId) {
          setFormData(editState.formData);
        } else if (mode === 'add') {
          setFormData(initialData);
        }

        // Обновляем предыдущие значения
        previousMode.current = mode;
        previousEditingId.current = editState.editingItemId;
      }
    }, [mode, editState.editingItemId, editState.formData, initialData]);

    // Проверка, заполнены ли все поля
    const validate = useCallback((): boolean => {
      const newErrors: { name?: string; price?: string } = {};

      if (!formData.name.trim()) {
        newErrors.name = 'Название товара обязательно';
      }

      if (!formData.price) {
        newErrors.price = 'Цена обязательна';
      } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        newErrors.price = 'Цена должна быть положительным числом';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Используем useRef для предотвращения неконтролируемого обновления
    const isUpdatingRedux = useRef(false);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFormData = {
          ...formData,
          [name]: value,
        };

        setFormData(updatedFormData);

        // Обновляем Redux только если находимся в режиме редактирования
        // и текущий ввод не был вызван синхронизацией из Redux
        if (mode === 'edit' && editState.editingItemId && !isUpdatingRedux.current) {
          isUpdatingRedux.current = true;
          dispatch(updateFormData(updatedFormData));
          // Сбрасываем флаг асинхронно
          setTimeout(() => {
            isUpdatingRedux.current = false;
          }, 0);
        }

        // Очищаем ошибку при вводе
        if (errors[name as keyof typeof errors]) {
          setErrors((prev) => ({
            ...prev,
            [name]: undefined,
          }));
        }
      },
      [formData, errors, mode, editState.editingItemId, dispatch],
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
          onSave(formData);

          // Очищаем форму после сохранения, если это режим добавления
          if (mode === 'add') {
            setFormData({ name: '', price: '' });
            setErrors({});
          }
        }
      },
      [validate, formData, onSave, mode],
    );

    const handleCancel = useCallback(() => {
      if (onCancel) {
        onCancel();
      }

      // Локально сбрасываем данные формы
      setFormData({ name: '', price: '' });
      setErrors({});
    }, [onCancel]);

    // Определяем, неактивна ли форма (для случаев загрузки)
    const isFormDisabled = itemsStatus === 'loading';

    return (
      <div className="item-form-container">
        <h2>{mode === 'add' ? 'Добавить товар' : 'Редактировать товар'}</h2>
        <form className="item-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Название</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              disabled={isFormDisabled}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Цена</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? 'error' : ''}
              disabled={isFormDisabled}
            />
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={isFormDisabled}>
              Сохранить
            </button>

            {mode === 'edit' && (
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isFormDisabled}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
    );
  },
);

ItemForm.displayName = 'ItemForm';
