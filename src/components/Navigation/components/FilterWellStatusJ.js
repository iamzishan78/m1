import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { navController } from 'hookstate/navStateController';
import { NavigationContext } from '../NavigationContext';

const statusList = [
	'ACTIVE',
	'CANCELLED PERMIT',
	'COMPLETED - NOT ACTIVE',
	'DRILLED UNCOMPLETED (DUC)',
	'EXPIRED PERMIT',
	'P&A',
	'PERMIT',
	'PERMIT - EXISTING WELL',
	'PERMIT - NEW DRILL',
	'SHUTIN',
	'UNKNOWN',
];

export default function FilterWellStatusJ() {
	const [stateNav, setStateNav] = useContext(NavigationContext);

	const handleStatusChange = value => {
		navController.handleWellsFilters({ field: 'wellStatus', value });

		setStateNav(stateNav => ({ ...stateNav, statusName: value || [] }));
	};

	return (
		<Autocomplete
			ChipProps={{ color: 'secondary' }}
			defaultValue={stateNav.statusName}
			value={stateNav.statusName}
			onChange={(event, newValue) => {
				handleStatusChange(newValue);
			}}
			multiple
			options={statusList}
			renderInput={params => <TextField {...params} variant="outlined" label="Well Status" placeholder="" fullWidth />}
			disableListWrap
			id="virtualize-well-statuses"
			// style={{ maxWidth: 300, minWidth: 120 }}
		/>
	);
}
