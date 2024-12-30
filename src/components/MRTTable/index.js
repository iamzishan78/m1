import React, { memo, useEffect } from 'react';

import { useApolloClient } from '@apollo/client';
import { MaterialReactTable } from 'material-react-table';
import PropTypes from 'prop-types';

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

// Define prop types for MRTTable
MRTTable.propTypes = {
	tableKey: PropTypes.string, // Optional string for the table key
	name: PropTypes.string.isRequired, // Required string for the table name
	overrideMeta: PropTypes.object, // Optional object for overriding metadata
};

// Define default props for MRTTable
MRTTable.defaultProps = {
	tableKey: undefined, // Default to undefined if not provided
	overrideMeta: {}, // Default to an empty object if not provided
};

export default memo(MRTTable);
