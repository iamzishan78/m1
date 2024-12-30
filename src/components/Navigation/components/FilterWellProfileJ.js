import React, { useContext } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { navController } from 'hookstate/navStateController';

import { NavigationContext } from '../NavigationContext';

const profileList = ['DIRECTIONAL', 'HORIZONTAL', 'UNKNOWN', 'VERTICAL'];

export default function FilterWellProfileJ() {
	const [stateNav, setStateNav] = useContext(NavigationContext);

	const handleProfileChange = value => {
		navController.handleWellsFilters({ field: 'wellBoreProfile', value });

		setStateNav(stateNav => ({ ...stateNav, profileName: value || [] }));
	};

	return (
		<Autocomplete
			ChipProps={{ color: 'secondary' }}
			defaultValue={stateNav.profileName}
			value={stateNav.profileName}
			onChange={(event, newValue) => {
				handleProfileChange(newValue);
			}}
			multiple
			options={profileList}
			renderInput={params => <TextField {...params} variant="outlined" label="Well Profile" placeholder="" fullWidth />}
			disableListWrap
			id="virtualize-well-profiles"
			// style={{ maxWidth: 300, minWidth: 120 }}
		/>
	);
}
