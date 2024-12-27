import React, { memo } from 'react';

// Importing React and memo for component optimization by memoizing the Table component.
import { ErrorBoundary } from 'react-error-boundary';

import { MaterialReactTable } from 'material-react-table';

import AllDialogs from 'components/MRTTable/Common/Dialog';
import useTableESSimple from 'components/MRTTable/Hooks/useTableESSimple';
// Custom hook to handle table setup and state for the ElasticSearch Simple table.
// Importing a component that handles dialogs for the table.

// Importing ErrorBoundary to catch and handle errors in the component tree.
import MRTFallback from 'components/MRTTable/MRTFallBack';

// Importing a fallback component to render when an error occurs.
// Importing the MaterialReactTable component to render the table.
import { tableController } from 'hookstate/tableController';

function Table({ tableKey }) {
	// Functional component Table accepts tableKey as props.
	const { tableProps, tablePropsState, classes } = useTableESSimple(tableKey);
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
				/>
				<AllDialogs tableKey={tableKey} controller={tableController} />
				{/* Rendering AllDialogs component. */}
			</div>
		</ErrorBoundary>
	);
}

export default memo(Table);
// Exporting the Table component wrapped in memo to prevent unnecessary re-renders.
