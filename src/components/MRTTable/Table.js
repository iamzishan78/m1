import React, { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MaterialReactTable } from 'material-react-table';
import PropTypes from 'prop-types';

import AllDialogs from 'components/MRTTable/Common/Dialog';
import useMRTTable from 'components/MRTTable/Hooks/useMRTTable';
import MRTFallback from 'components/MRTTable/MRTFallBack';

import { tableController } from 'controllers/tableController';

function Table({ tableKey, muiTableBodyRowProps }) {
	// Functional component Table accepts tableKey as props.
	const { tableProps, tablePropsState, classes } = useMRTTable(tableKey);
	// Destructuring the table properties, state, and CSS classes from the custom hook.

	return (
		<ErrorBoundary
			// Wrapping the component in an ErrorBoundary to catch errors within the tree.
			FallbackComponent={({ error }) => <MRTFallback tableKey={tableKey} error={error} />}
			// If an error occurs, the MRTFallback component will be rendered, displaying the error.
		>
			<div className={classes.table}>
				{/* Applying CSS classes to the container div for styling the table. */}
				<MaterialReactTable
					{...tableProps}
					// Spreading the tableProps to pass all necessary props to MaterialReactTable.
					state={{
						...tablePropsState,
						// Spreading the state properties specific to the table into the state prop.
					}}
					muiTableBodyRowProps={muiTableBodyRowProps || tableProps.muiTableBodyRowProps}
				/>
				<AllDialogs tableKey={tableKey} controller={tableController} />
				{/* Rendering AllDialogs component. */}
			</div>
		</ErrorBoundary>
	);
}

// Define prop types for the Table component
Table.propTypes = {
	tableKey: PropTypes.string.isRequired, // tableKey is a required string
	muiTableBodyRowProps: PropTypes.object, // muiTableBodyRowProps is an optional object
};

export default memo(Table);
// Exporting the Table component wrapped in memo to prevent unnecessary re-renders.
