import React from 'react';
import FilterModeMenuItems from '../Common/FilterModeMenuItems';

const filterModeMenu =
  ({ options, tableKey, name }) =>
    ({ onSelectFilterMode }) =>
      options.map(option => (
        <FilterModeMenuItems
          option={option}
          key={name}
          tableKey={tableKey}
          name={name}
          onSelectFilterMode={onSelectFilterMode}
        />
      ));

export default filterModeMenu;
