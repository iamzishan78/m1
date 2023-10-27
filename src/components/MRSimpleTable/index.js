import React, { memo, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import useMRSimpleTable from 'components/MRSimpleTable/Hooks/useMRSimpleTable';
import AllDialogs from 'components/MRSimpleTable/Common/Dialog';
import { simpleTableController } from 'hookstate/simpleTableController';
import { SCHEMA } from './Schema';

function MRSimpleTable({ tableKey, name, overrideMeta = {} }) {
	const meta = SCHEMA[name];
	const extendedMeta = { ...meta, ...overrideMeta };
	tableKey = tableKey || name; // table key should be different if two tables with same name exist in same screen.
	console.log('🚀 ~ file: index.js:12 ~ MRSimpleTable ~ tableKey:', tableKey);
	const Controller = simpleTableController(tableKey);
	Controller.initialize(tableKey, extendedMeta);
	const { tableProps, tablePropsState, initialized, classes } =
		useMRSimpleTable(tableKey);

	useEffect(() => {
		return () => {
			Controller.reset();
		};
	}, []);

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

export default memo(MRSimpleTable);
