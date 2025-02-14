import React, { useMemo, memo } from 'react';

// Importing React, useMemo for memoization, and memo for optimizing the component by preventing unnecessary re-renders.
import MRTTable from 'components/MRTTable';

import { tableController } from 'hookstate/tableController';
// Importing tableController from hookstate to manage and control the state of the table.
// Importing the MRTTable component to render the table.

function MRTFallback({ tableKey, error, resetErrorBoundary }) {
	// MRTFallback is a fallback component that renders when an error occurs within the ErrorBoundary.

	const isMaximumUpdateDepthError = error && error.message.includes('Maximum update depth exceeded');
	// Checking if the error is a 'Maximum update depth exceeded' error, a common React error.

	if (!isMaximumUpdateDepthError) {
		// If the error is not the 'Maximum update depth exceeded' error, display a generic error message.
		return (
			<div>
				<p>Something went wrong:</p>
				<p style={{ color: 'red' }}>{error.message}</p>
				<button onClick={resetErrorBoundary}>Try again</button>
				{/* Button to reset the error boundary, allowing the user to try again. */}
			</div>
		);
	}

	const tableState = tableController(tableKey).useCompleteState();
	// Retrieving the complete state of the table using the tableController and the provided tableKey.

	const tableStateValues = tableState;
	// Extracting the table state values without proxy for direct manipulation.

	const schema = tableStateValues.TableSchema;
	// Extracting the table schema from the state values.

	const visibility = tableStateValues.columnVisibility;
	// Extracting column visibility settings from the state values.

	// Loop through the schema to match the column visibility with the schema items.
	schema.forEach(item => {
		const key = item.id || item.accessorKey;
		// Each schema item is matched with the visibility settings based on its key.
		if (visibility[key] !== undefined) {
			item.hidden = visibility[key];
			// Update the schema to reflect the visibility of each column.
		}
	});

	const overrideMeta = useMemo(
		() => ({
			// useMemo is used to memoize the overrideMeta object, preventing unnecessary recalculations.
			...tableStateValues,
			columnVirtualization: false,
			// Disabling column virtualization to avoid the 'Maximum update depth exceeded' error.
			TableSchema: schema,
			// Updating the schema with the modified visibility settings.
		}),
		[tableStateValues, schema]
	);

	return (
		<div>
			<MRTTable name={tableKey} overrideMeta={overrideMeta} />
			{/* Rendering the MRTTable component with the modified state to handle errors gracefully. */}
		</div>
	);
}

export default memo(MRTFallback);
// Exporting the MRTFallback component wrapped in memo to optimize performance by preventing unnecessary re-renders.
