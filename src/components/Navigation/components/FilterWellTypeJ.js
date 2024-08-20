import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { navController } from 'hookstate/navStateController';
import { NavigationContext } from '../NavigationContext';

const wellTypesList = [
  'COALBED METHANE',
  'DISPOSAL',
  'DRY HOLE',
  'GAS',
  'INJECTION',
  'OIL',
  'STORAGE',
  'UNKNOWN',
  'WATER',
];

export default function FilterWellTypeJ() {
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const handleTypeChange = value => {
    navController.handleWellsFilters({ field: 'wellType', value });

    setStateNav(stateNav => ({ ...stateNav, typeName: value || [] }));
  };

  return (
    <Autocomplete
      ChipProps={{ color: 'secondary' }}
      defaultValue={stateNav.typeName}
      value={stateNav.typeName}
      onChange={(event, newValue) => {
        handleTypeChange(newValue);
      }}
      multiple
      options={wellTypesList}
      renderInput={params => <TextField {...params} variant="outlined" label="Well Type" placeholder="" fullWidth />}
      disableListWrap
      id="virtualize-well-types"
    // style={{ maxWidth: 300, minWidth: 120 }}
    />
  );
}
