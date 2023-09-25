import React, { memo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import useTableESSimple from 'components/MRTTable/Hooks/useTableESSimple';
import AllDialogs from 'components/MRTTable/Common/Dialog';
import { tableController } from 'hookstate/tableController';
import { SCHEMA } from './Schema';

function MRTTable({ tableKey, name, overrideMeta = {} }) {
	const meta = SCHEMA[name];
	const extendedMeta = { ...meta, ...overrideMeta }
	tableKey = tableKey || name; // table key should be different if two tables with same name exist in same screen.
	const Controller = tableController(tableKey);
	Controller.initialize(tableKey, extendedMeta);
	const { tableProps, tablePropsState, initialized, classes } = useTableESSimple(tableKey);

	if (!initialized) return null;

	return (
		<div className={classes.table}>
			<MaterialReactTable
				{...tableProps}
				state={{
					...tablePropsState,
				}}
			/>
			<AllDialogs />
		</div>
	);
}

export default memo(MRTTable);
