import React from 'react';

import { globalStateController } from 'hookstate/globalStateController';

import FilterModeMenuItems from '../Common/FilterModeMenuItems';

const filterModeMenu =
	({ options, tableKey, name, controller, layerIdentifier }) =>
	({ onSelectFilterMode }) => {
		const filterModes = globalStateController.getValue('columnFilterModesFnRefs') || {};
		const selectedMapView = globalStateController.getValue('mapView')?.selectedMapView;
		const mapViewFilter = selectedMapView?.filters?.find(
			filter => filter?.fieldName?.replace('.keyword', '') === name && filter?.dataSourceName === layerIdentifier
		);

		if (!filterModes?.[tableKey]) {
			filterModes[tableKey] = {};
		}

		// Checks if filter mode is applied already or not
		if (mapViewFilter?.filterType && filterModes?.[tableKey]?.[name]?.intiated === false) {
			filterModes[tableKey] = {
				...filterModes[tableKey],
				[name]: {
					onSelectFilterMode,
					intiated: true,
				},
			};
			onSelectFilterMode(mapViewFilter?.filterType);
		}

		// Sets initiated to false because no filter mode is applied yet
		if (filterModes?.[tableKey]?.[name]?.intiated !== true) {
			filterModes[tableKey] = {
				...filterModes[tableKey],
				[name]: {
					onSelectFilterMode,
					intiated: false,
				},
			};
		}

		globalStateController.updateState({
			columnFilterModesFnRefs: filterModes,
		});
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
