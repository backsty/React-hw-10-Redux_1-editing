import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { RootState, SortField } from '@/types';
import { setNameFilter, setPriceRange, toggleSort, clearFilters } from '@/store';
import '@styles/components/filter.css';

export const AdvancedFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { nameFilter, priceRange, sortField, sortDirection } = useSelector(
    (state: RootState) => state.filter,
  );
  const items = useSelector((state: RootState) => state.items.items);

  // Локальное состояние для контролируемых инпутов
  const [inputValue, setInputValue] = useState(nameFilter);
  const [minPrice, setMinPrice] = useState(
    priceRange.min !== null ? priceRange.min.toString() : '',
  );
  const [maxPrice, setMaxPrice] = useState(
    priceRange.max !== null ? priceRange.max.toString() : '',
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Отложенная отправка фильтра имени
  const debouncedSetNameFilter = useCallback(
    debounce((value: string) => {
      dispatch(setNameFilter(value));
    }, 300),
    [dispatch],
  );

  // Отложенная отправка диапазона цен
  const debouncedSetPriceRange = useCallback(
    debounce((min: number | null, max: number | null) => {
      dispatch(setPriceRange({ min, max }));
    }, 300),
    [dispatch],
  );

  // Синхронизация локального состояния с Redux
  useEffect(() => {
    setInputValue(nameFilter);
  }, [nameFilter]);

  useEffect(() => {
    setMinPrice(priceRange.min !== null ? priceRange.min.toString() : '');
    setMaxPrice(priceRange.max !== null ? priceRange.max.toString() : '');
  }, [priceRange.min, priceRange.max]);

  // Расчет мин/макс цен в списке товаров
  const priceStats = React.useMemo(() => {
    if (items.length === 0) return { min: 0, max: 0 };

    return items.reduce(
      (acc, item) => ({
        min: Math.min(acc.min, item.price),
        max: Math.max(acc.max, item.price),
      }),
      { min: Number.MAX_VALUE, max: 0 },
    );
  }, [items]);

  // Обработчики изменения
  const handleNameFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSetNameFilter(value);
    },
    [debouncedSetNameFilter],
  );

  const handleMinPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMinPrice(value);

      const numValue = value === '' ? null : parseFloat(value);
      if (numValue === null || !isNaN(numValue)) {
        debouncedSetPriceRange(numValue, priceRange.max);
      }
    },
    [debouncedSetPriceRange, priceRange.max],
  );

  const handleMaxPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMaxPrice(value);

      const numValue = value === '' ? null : parseFloat(value);
      if (numValue === null || !isNaN(numValue)) {
        debouncedSetPriceRange(priceRange.min, numValue);
      }
    },
    [debouncedSetPriceRange, priceRange.min],
  );

  const handleSortToggle = useCallback(
    (field: SortField) => {
      dispatch(toggleSort(field));
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Определяем, активен ли какой-либо фильтр
  const isAnyFilterActive =
    nameFilter !== '' || priceRange.min !== null || priceRange.max !== null || sortField !== null;

  return (
    <div className="advanced-filters-panel">
      <div className="search-field-container">
        <input
          type="text"
          className="search-input"
          placeholder="Фильтр по названию..."
          value={inputValue}
          onChange={handleNameFilterChange}
        />
        {inputValue && (
          <button
            className="search-clear-button"
            onClick={() => dispatch(setNameFilter(''))}
            title="Очистить фильтр"
          >
            ×
          </button>
        )}
      </div>

      <button className="toggle-advanced-filters" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Скрыть расширенный фильтр' : 'Показать расширенный фильтр'}
        <span
          className={`toggle-advanced-filters__icon ${isExpanded ? 'toggle-advanced-filters__icon--expanded' : ''}`}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <>
          <div className="filter-section">
            <div>
              <span className="filter-section__label">Сортировка:</span>
              <div className="sort-buttons-group">
                <button
                  className={`sort-button ${sortField === 'name' ? 'sort-button--active' : ''}`}
                  onClick={() => handleSortToggle('name')}
                >
                  По названию
                  {sortField === 'name' && (
                    <span
                      className={`sort-button__icon ${sortDirection === 'desc' ? 'sort-button__icon--desc' : ''}`}
                    >
                      ▲
                    </span>
                  )}
                </button>

                <button
                  className={`sort-button ${sortField === 'price' ? 'sort-button--active' : ''}`}
                  onClick={() => handleSortToggle('price')}
                >
                  По цене
                  {sortField === 'price' && (
                    <span
                      className={`sort-button__icon ${sortDirection === 'desc' ? 'sort-button__icon--desc' : ''}`}
                    >
                      ▲
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section__field-wrapper">
              <label className="filter-section__label">Цена от:</label>
              <input
                type="number"
                className="filter-section__input"
                placeholder={`Мин: ${priceStats.min}`}
                value={minPrice}
                onChange={handleMinPriceChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="filter-section__field-wrapper">
              <label className="filter-section__label">до:</label>
              <input
                type="number"
                className="filter-section__input"
                placeholder={`Макс: ${priceStats.max}`}
                value={maxPrice}
                onChange={handleMaxPriceChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {isAnyFilterActive && (
            <div className="filter-actions-bar">
              <button
                className="filter-actions-bar__button filter-actions-bar__reset"
                onClick={handleClearFilters}
              >
                Сбросить все фильтры
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
