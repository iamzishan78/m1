import React from 'react';
import FilterModeMenuItems from '../Common/FilterModeMenuItems';
import { globalStateController } from 'hookstate/globalStateController';

const filterModeMenu =
	({ options, tableKey, name }) =>
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
			/>
		));
	};

export default filterModeMenu;
