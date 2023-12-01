import React, { memo, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import useTableESSimple from 'components/MRTTable/Hooks/useTableESSimple';
import AllDialogs from 'components/MRTTable/Common/Dialog';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { SCHEMA } from './Schema';
import { useApolloClient } from '@apollo/client';

function Table({ tableKey }) {
	const { tableProps, tablePropsState, classes } = useTableESSimple(tableKey);
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

function MRTTable({ tableKey, name, overrideMeta = {} }) {
	const client = useApolloClient();
	const meta = SCHEMA[name];
	const extendedMeta = { ...meta, ...overrideMeta }
	tableKey = tableKey || name; // table key should be different if two tables with same name exist in same screen.
	const Controller = tableController(tableKey);
	const { reInitialized } = tableGlobalController.useState(['reInitialized']);

	const { stateValues } = Controller.useState(['initialized']);

	useEffect(() => {
		(async () => {
			await Controller.initialize(tableKey, extendedMeta, client);
		})()

		return () => {
			Controller.reset()
		};
	}, [reInitialized]);

	if (!stateValues.initialized)
		return (
			<MaterialReactTable
				columns={extendedMeta.TableSchema.filter(column => !column.hidden).map(
					column => ({
						id: column.id,
						accessorKey: column.accessorKey,
						header: column.header,
						size: column.size,
					})
				)}
				data={[]}
				state={{
					isLoading: true,
					showProgressBars: true,
				}}
			/>
		);

	return <Table tableKey={tableKey} />;
}

export default memo(MRTTable);
