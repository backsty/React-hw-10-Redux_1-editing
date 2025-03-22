import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Item, RootState } from '@/types';
import { ItemRow } from '@components/item-row';
import '@styles/components/item-list.css';

interface ItemListProps {
  onEdit: (item: Item) => void;
}

export const ItemList: React.FC<ItemListProps> = memo(({ onEdit }) => {
  const { items, status } = useSelector((state: RootState) => state.items);
  const editingItemId = useSelector((state: RootState) => state.edit.editingItemId);

  // Отображаем сообщение, если список пуст
  if (items.length === 0) {
    return (
      <div className="item-list-container empty">
        <p className="no-items-message">Список товаров пуст</p>
      </div>
    );
  }

  return (
    <div className="item-list-container">
      <h2>Список товаров</h2>
      {status === 'loading' && <div className="loading">Загрузка...</div>}

      <table className="item-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              isEditing={editingItemId === item.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

ItemList.displayName = 'ItemList';
