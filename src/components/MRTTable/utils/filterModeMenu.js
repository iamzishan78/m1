import React from 'react';

import { tableController } from 'hookstate/tableController';

import FilterModeMenuItems from '../Common/FilterModeMenuItems';
import { viewStateController } from '../Common/GridView/ViewController';


export const columnFilterModesFnRefs = {};

const filterModeMenu =
	({ options, tableKey, name, schemaColumn, controller, layerIdentifier }) =>
	({ onSelectFilterMode }) => {
		const selectedMapView = viewStateController('MapView').getValue('selectedView');
		const mapViewFilter = selectedMapView?.filters?.find(
			filter => filter?.fieldName?.replace('.keyword', '') === name && filter?.dataSourceName === layerIdentifier
		);
		const isClientSide = tableController(tableKey).getValue('isClientSide');

		const filterType = isClientSide
			? schemaColumn.type === 'number'
				? 'equals'
				: 'singleselect'
			: mapViewFilter?.filterType;

		if (!columnFilterModesFnRefs?.[tableKey]) {
			columnFilterModesFnRefs[tableKey] = {};
		}

		// Checks if filter mode is applied already or not
		let intiated = null;
		if (filterType && !columnFilterModesFnRefs?.[tableKey]?.[name]?.intiated) {
			intiated = true;
			const isSingleMulti = ['singleselect', 'multiselect'].includes(filterType);
			columnFilterModesFnRefs[tableKey] = {
				...columnFilterModesFnRefs[tableKey],
				[name]: {
					onSelectFilterMode,
					intiated,
				},
			};
			if (!isSingleMulti || isClientSide) {
				onSelectFilterMode(filterType);
			}
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
