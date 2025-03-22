import React, { memo, useCallback, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Item, RootState } from '@/types';
import { deleteItem } from '@/store';
import editIcon from '@/assets/img/edit-svgrepo-com.svg';
import cancelIcon from '@/assets/img/cancel.svg';
import '@styles/components/item-row.css';

interface ItemRowProps {
  item: Item;
  onEdit: (item: Item) => void;
  isEditing: boolean;
}

// Вспомогательная функция для подсветки совпадений в тексте
const highlightMatch = (text: string, filter: string): ReactElement => {
  if (!filter.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${filter})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === filter.toLowerCase() ? (
          <mark key={i} className="highlighted-text">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};

export const ItemRow: React.FC<ItemRowProps> = memo(({ item, onEdit, isEditing }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.items);
  const nameFilter = useSelector((state: RootState) => state.filter.nameFilter);

  // Просто вызываем родительский обработчик редактирования
  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  // Удаление остается в компоненте строки
  const handleDelete = useCallback(() => {
    dispatch(deleteItem(item.id));
  }, [dispatch, item.id]);

  return (
    <tr className={isEditing ? 'editing' : ''}>
      <td>{highlightMatch(item.name, nameFilter)}</td>
      <td>{item.price.toFixed(2)} ₽</td>
      <td className="actions">
        <button
          className="btn-edit"
          onClick={handleEdit}
          disabled={status === 'loading' || isEditing}
          title="Редактировать"
        >
          <img src={editIcon} className="icon edit-icon" alt="Редактировать" />
        </button>
        <button
          className="btn-delete"
          onClick={handleDelete}
          disabled={status === 'loading'}
          title="Удалить"
        >
          <img src={cancelIcon} className="icon delete-icon" alt="Удалить" />
        </button>
      </td>
    </tr>
  );
});

ItemRow.displayName = 'ItemRow';