import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Item, ItemFormState, RootState } from '@/types';
import { ItemForm, ItemList } from '@/components';
import { addItem, updateItem, startEditing, cancelEditing } from '@/store';
import './styles/App.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { mode, editingItemId } = useSelector((state: RootState) => state.edit);

  // Используем селектор для подсчета количества товаров
  const itemCount = useSelector((state: RootState) => state.items.items.length);

  const handleSaveItem = useCallback(
    (formData: ItemFormState) => {
      if (mode === 'add') {
        // Создаем новый товар с уникальным ID
        const newItem: Item = {
          id: uuidv4(),
          name: formData.name,
          price: parseFloat(formData.price),
        };
        dispatch(addItem(newItem));
      } else {
        // Обновляем существующий товар
        if (editingItemId) {
          const updatedItem: Item = {
            id: editingItemId,
            name: formData.name,
            price: parseFloat(formData.price),
          };
          dispatch(updateItem(updatedItem));
          // После обновления сбрасываем режим редактирования
          dispatch(cancelEditing());
        }
      }
    },
    [dispatch, mode, editingItemId],
  );

  const handleEditItem = useCallback(
    (item: Item) => {
      // startEditing уже установит режим 'edit' и все параметры редактирования
      dispatch(
        startEditing({
          id: item.id,
          formData: {
            name: item.name,
            price: item.price.toString(),
          },
        }),
      );
    },
    [dispatch],
  );

  const handleCancelEdit = useCallback(() => {
    // Сбрасываем полностью состояние редактирования
    dispatch(cancelEditing());
  }, [dispatch]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Управление товарами</h1>
        <div className="stats">
          <span>Всего товаров: {itemCount}</span>
        </div>
      </header>

      <main className="app-content">
        <section className="form-section">
          <ItemForm mode={mode} onSave={handleSaveItem} onCancel={handleCancelEdit} />
        </section>

        <section className="list-section">
          <ItemList onEdit={handleEditItem} />
        </section>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Управление товарами</p>
      </footer>
    </div>
  );
};

export default App;
