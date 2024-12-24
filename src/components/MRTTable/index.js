import { useApolloClient } from '@apollo/client';
import { MaterialReactTable } from 'material-react-table';
import React, { memo, useEffect } from 'react';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { SCHEMA } from './Schema';
import Table from './Table';
import { copy } from '../Shared/functions/index';

function MRTTable({ tableKey, name, overrideMeta = {} }) {
	const client = useApolloClient();
	const meta = SCHEMA[name];
	const extendedMeta = {
		...copy(meta),
		...overrideMeta,
		...globalStateController.getValue('cypress')?.mrtOverrideMeta,
	};
	tableKey = tableKey || name; // table key should be different if two tables with same name exist in same screen.
	const Controller = tableController(tableKey);
	const { reInitialized } = tableGlobalController.useState(['reInitialized']);

	const { stateValues } = Controller.useState(['initialized']);

	useEffect(() => {
		(async () => {
			await Controller.initialize(tableKey, extendedMeta, client);
		})();

		return () => {
			Controller.reset();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reInitialized]);

	if (!stateValues.initialized) {
		return (
			<MaterialReactTable
				columns={extendedMeta.TableSchema.filter(column => !column.hidden).map(column => ({
					id: column.id,
					accessorKey: column.accessorKey,
					header: column.header,
					size: column.size,
				}))}
				data={[]}
				state={{
					isLoading: true,
					showProgressBars: true,
				}}
				enableDensityToggle={false}
				enableFullScreenToggle={false}
			/>
		);
	}

	return <Table tableKey={tableKey} />;
}

export default memo(MRTTable);
