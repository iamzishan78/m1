import React, { useState, useContext, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';

import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

import { navController } from 'hookstate/navStateController';

import { NavigationContext } from '../NavigationContext';

export default function OperatorFilterJ() {
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const [operatorList, setOperatorsList] = useState([]);
	const [getFilters, { data: esOperatorsData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });
	const esIndex = 'platformData:operator';
	useEffect(() => {
		getFilters({
			variables: {
				esIndex,
				filterKey: 'operator.keyword',
				search: '',
				size: 50,
			},
		});
	}, []);

	useEffect(() => {
		if (esOperatorsData) {
			const operatorList = esOperatorsData.getESFilterList?.hits?.map(item => item.key);
			setOperatorsList(operatorList);
		}
	}, [esOperatorsData]);

	const handleOperatorChange = value => {
		navController.handleWellsFilters({ field: 'operator', value });

		setStateNav(stateNav => ({ ...stateNav, operatorName: value || [] }));
	};

	const handleOperatorChangeByInput = React.useMemo(
		() =>
			debounce(request => {
				getFilters({
					variables: {
						esIndex,
						filterKey: 'operator.keyword',
						search: `${request}*`,
						size: 50,
					},
				});
			}, 500),
		[]
	);

	return (
		<Autocomplete
			ChipProps={{ color: 'secondary' }}
			defaultValue={stateNav.operatorName}
			value={stateNav.operatorName}
			onChange={(event, newValue) => {
				handleOperatorChange(newValue);
			}}
			multiple
			onInputChange={(event, newInputValue) => {
				handleOperatorChangeByInput(newInputValue);
			}}
			options={operatorList || []}
			renderInput={params => <TextField {...params} variant="outlined" label="Operator" placeholder="" fullWidth />}
			disableListWrap
			id="virtualize-operators"
		/>
	);
}
