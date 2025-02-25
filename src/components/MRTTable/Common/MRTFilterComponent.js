import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { tableController } from 'controllers/tableController';

const MRTFilterComponent = ({ tableKey, filterColumn }) => {
	const { stateValues } = tableController(tableKey).useState(['TableSchema', 'mrtTableRef', 'filters']);
	const columnSchema = stateValues.TableSchema?.find(s => s.name === filterColumn.name);

	const [value, setValue] = useState('');

	useEffect(() => {
		const filter = stateValues.filters.find(f => f.field === columnSchema?.id || f.field === columnSchema?.name);

		if (!filter) {
			setValue('');
			return;
		}

		setValue(filter.value);
	}, [columnSchema?.id, columnSchema?.name, stateValues.filters]);

	const Comp = columnSchema?.SingleSelect;

	if (!Comp) {
		return null;
	}

	const column = stateValues.mrtTableRef?.getColumn?.(columnSchema?.id);

	if (!column) {
		return null;
	}

	return (
		<Comp
			column={column}
			_value={value}
			isCustom
			textFieldProps={{
				size: 'small',
				variant: 'outlined',
				label: columnSchema.header,
			}}
		/>
	);
};

MRTFilterComponent.propTypes = {
	tableKey: PropTypes.string.isRequired,
	filterColumn: PropTypes.object.isRequired,
};

export default MRTFilterComponent;
