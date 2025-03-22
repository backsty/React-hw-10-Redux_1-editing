import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/types';
import { setNameFilter, clearFilters } from '@/store';
import '@styles/components/filter.css';

export const Filter: React.FC = () => {
  const dispatch = useDispatch();
  const nameFilter = useSelector((state: RootState) => state.filter.nameFilter);
  const [inputValue, setInputValue] = useState(nameFilter);

  const debouncedSetFilter = useCallback(
    debounce((value: string) => {
      dispatch(setNameFilter(value));
    }, 300),
    [dispatch],
  );

  useEffect(() => {
    setInputValue(nameFilter);
  }, [nameFilter]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSetFilter(value);
    },
    [debouncedSetFilter],
  );

  const handleClearFilter = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return (
    <div className="filter-panel">
      <div className="search-field-container">
        <input
          type="text"
          className="search-input"
          placeholder="Фильтр по названию..."
          value={inputValue}
          onChange={handleFilterChange}
        />
        {inputValue && (
          <button
            className="search-clear-button"
            onClick={handleClearFilter}
            title="Очистить фильтр"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
