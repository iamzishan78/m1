import React from 'react';

import { globalStateController } from 'hookstate/globalStateController';

import FilterModeMenuItems from '../Common/FilterModeMenuItems';

const filterModeMenu =
	({ options, tableKey, name, controller }) =>
	({ onSelectFilterMode }) => {
		const filterModes = globalStateController.getValue('columnFilterModesFnRefs') || {};

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
