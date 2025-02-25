import React, { memo, useEffect, useState } from 'react';

import { useApolloClient } from '@apollo/client';
import { MaterialReactTable } from 'material-react-table';
import PropTypes from 'prop-types';

import { copy } from 'components/Shared/functions';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController, tableGlobalController } from 'stateManagement/tableController';

import { SCHEMA } from './Schema';
import Table from './Table';

function MRTTable({ tableKey, name, overrideMeta = {} }) {
	const client = useApolloClient();
	const [extendedMeta, setExtendedMeta] = useState(null); // State for extended meta
	const Controller = tableController(tableKey || name); // Default table key is the name
	const { reInitialized } = tableGlobalController.useState(['reInitialized']);
	const { stateValues } = Controller.useState(['initialized']);

	useEffect(() => {
		// Dynamically load the schema
		const loadSchema = async () => {
			try {
				const schemaModule = await SCHEMA[name](); // Dynamically import the schema
				const schema = schemaModule.default; // Access the default export from the dynamic import
				const metaCopy = {
					...copy(schema),
					...overrideMeta,
					...globalStateController.getValue('cypress')?.mrtOverrideMeta,
				};
				setExtendedMeta(metaCopy);
				await Controller.initialize(tableKey || name, metaCopy, client);
			} catch (error) {
				console.error(`Failed to load schema for ${name}:`, error);
			}
		};
		loadSchema();

		return () => {
			Controller.reset();
		};
	}, [reInitialized]);

	if (!extendedMeta || !stateValues.initialized) {
		return (
			<MaterialReactTable
				columns={
					extendedMeta?.TableSchema?.filter(column => !column.hidden).map(column => ({
						id: column.id,
						accessorKey: column.accessorKey,
						header: column.header,
						size: column.size,
					})) || [
						{
							id: ' ',
							accessorKey: ' ',
							header: '',
							size: 450,
						},
					]
				}
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

	return <Table tableKey={tableKey || name} />;
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
