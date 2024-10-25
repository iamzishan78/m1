import React, { memo, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';

import { tableController, tableGlobalController } from 'hookstate/tableController';
import { SCHEMA } from './Schema';
import { useApolloClient } from '@apollo/client';
import { globalStateController } from 'hookstate/globalStateController';
import { copy } from '../Shared/functions/index';
import Table from './Table';

function MRTTable({ tableKey, name, overrideMeta = {}, hideSharedCommentCheck = true }) {
	const client = useApolloClient();
	const meta = SCHEMA[name];
	const extendedMeta = { ...copy(meta), ...overrideMeta, ...globalStateController.getValue('cypress')?.mrtOverrideMeta };
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
				enableDensityToggle={false}
				enableFullScreenToggle={false}
			/>
		);

	return <Table tableKey={tableKey} hideSharedCommentCheck={hideSharedCommentCheck} />;
}

export default memo(MRTTable);
