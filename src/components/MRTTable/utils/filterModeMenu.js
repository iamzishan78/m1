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

		if (mapViewFilter?.filterType) onSelectFilterMode(mapViewFilter?.filterType);
		// const mapViewFilter = selectedMapView?.filters?.find()

		if (!filterModes?.[tableKey]) {
			filterModes[tableKey] = {};
		}

		filterModes[tableKey] = {
			...filterModes[tableKey],
			[name]: onSelectFilterMode,
		};

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
