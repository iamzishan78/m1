import React from 'react';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

import FilterModeMenuItems from '../Common/FilterModeMenuItems';

export const columnFilterModesFnRefs = {};

const filterModeMenu =
	({ options, tableKey, name, controller, layerIdentifier }) =>
	({ onSelectFilterMode }) => {
		const selectedMapView = globalStateController.getValue('mapView')?.selectedMapView;
		const mapViewFilter = selectedMapView?.filters?.find(
			filter => filter?.fieldName?.replace('.keyword', '') === name && filter?.dataSourceName === layerIdentifier
		);
		const isClientSide = tableController(tableKey).getValue('isClientSide');

		const filterType = isClientSide ? 'singleselect' : mapViewFilter?.filterType;

		if (!columnFilterModesFnRefs?.[tableKey]) {
			columnFilterModesFnRefs[tableKey] = {};
		}

		// Checks if filter mode is applied already or not
		if (filterType && !columnFilterModesFnRefs?.[tableKey]?.[name]?.intiated) {
			columnFilterModesFnRefs[tableKey] = {
				...columnFilterModesFnRefs[tableKey],
				[name]: {
					onSelectFilterMode,
					intiated: true,
				},
			};
			onSelectFilterMode(filterType);
		}

		return options.map(option => (
			<FilterModeMenuItems
				option={option}
				key={name}
				tableKey={tableKey}
				name={name}
				onSelectFilterMode={onSelectFilterMode}
				controller={controller}
			/>
		));
	};

export default filterModeMenu;
