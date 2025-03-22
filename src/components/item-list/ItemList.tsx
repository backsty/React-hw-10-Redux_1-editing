import React, { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Item, RootState, SortField } from '@/types';
import { ItemRow } from '@components/item-row';
import { AdvancedFilter } from '@components/filter';
import { toggleSort } from '@/store';
import '@styles/components/item-list.css';

interface ItemListProps {
  onEdit: (item: Item) => void;
}

export const ItemList: React.FC<ItemListProps> = memo(({ onEdit }) => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state: RootState) => state.items);
  const editingItemId = useSelector((state: RootState) => state.edit.editingItemId);
  const { nameFilter, sortField, sortDirection, priceRange } = useSelector(
    (state: RootState) => state.filter,
  );

  // Обработчик клика по заголовку для сортировки
  const handleSortClick = (field: SortField) => {
    dispatch(toggleSort(field));
  };

  // Применяем фильтры и сортировку
  const processedItems = useMemo(() => {
    // Сначала фильтруем по имени
    let result = items;

    // Фильтр по названию
    if (nameFilter.trim()) {
      const normalizedFilter = nameFilter.toLowerCase().trim();
      result = result.filter((item) => item.name.toLowerCase().includes(normalizedFilter));
    }

    // Фильтр по диапазону цен
    if (priceRange.min !== null || priceRange.max !== null) {
      result = result.filter((item) => {
        let matches = true;
        if (priceRange.min !== null) {
          matches = matches && item.price >= priceRange.min;
        }
        if (priceRange.max !== null) {
          matches = matches && item.price <= priceRange.max;
        }
        return matches;
      });
    }

    // Затем сортируем, если указано поле сортировки
    if (sortField) {
      result = [...result].sort((a, b) => {
        let comparison = 0;

        if (sortField === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'price') {
          comparison = a.price - b.price;
        }

        // Инвертируем результат для сортировки по убыванию
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [items, nameFilter, sortField, sortDirection, priceRange]);

  // Получаем кол-во отфильтрованных элементов
  const filterInfo = useMemo(() => {
    const isFiltered = nameFilter.trim() || priceRange.min !== null || priceRange.max !== null;

    if (!isFiltered || processedItems.length === items.length) {
      return null;
    }

    return `Показано ${processedItems.length} из ${items.length}`;
  }, [processedItems.length, items.length, nameFilter, priceRange]);

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

      <AdvancedFilter />

      {filterInfo && (
        <div className="filter-results-info">
          <span className="filter-active-indicator">{filterInfo}</span>
        </div>
      )}

      {status === 'loading' && <div className="loading">Загрузка...</div>}

      {processedItems.length === 0 ? (
        <p className="no-items-message">По вашему запросу ничего не найдено</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th className="sortable-column" onClick={() => handleSortClick('name')}>
                Название
                {sortField === 'name' ? (
                  <span
                    className={`sortable-column__indicator sortable-column__indicator--${sortDirection}`}
                  ></span>
                ) : (
                  <span className="sortable-column__indicator sortable-column__indicator--inactive"></span>
                )}
              </th>
              <th className="sortable-column" onClick={() => handleSortClick('price')}>
                Цена
                {sortField === 'price' ? (
                  <span
                    className={`sortable-column__indicator sortable-column__indicator--${sortDirection}`}
                  ></span>
                ) : (
                  <span className="sortable-column__indicator sortable-column__indicator--inactive"></span>
                )}
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {processedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                isEditing={editingItemId === item.id}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});

ItemList.displayName = 'ItemList';
