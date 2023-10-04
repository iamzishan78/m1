import React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import GridView from 'components/MRTTable/Common/GridView';

function ToolbarActions({ table, tableKey, children }) {
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const tableState = tableController(tableKey).useState([
		'TableSchema',
		'esIndex',
		'datasets',
		'globalFilter',
		'searchFields',
		'defaultSort',
		'data',
		'gridViewSettings',
		'sorting',
		'columnVisibility',
		'filters',
		'defaultFilters',
	]);
	const tableStateValues = tableState.stateValues;

	const handleExport = () => {
		tableGlobalController.updateState({
			dialog: {
				type: 'exportCompleteGrid',
				table,
				tableKey,
				header: 'Export Grid',
				isSomeRowsSelected,
			},
		});
	};

	const handleDelete = () => {
		const selectedIds = selectedRows?.length > 0 ? selectedRows.map(item => item._id) : null;
		const shapeIds = selectedRows?.length > 0 ? [...new Set(selectedRows.map(item => item?.shape?._id))] : null;

		tableGlobalController.updateState({
			dialog: {
				type: 'deleteGrid',
				Ids: selectedIds,
				tableKey,
				shapeIds
			},
		});

		table.resetRowSelection();
	};

	return (
		<div
			style={{
				display: 'flex',
				width: '100%',
				gap: '0.5rem',
				marginLeft: '-9px',
				justifyContent: `${tableStateValues.gridViewSettings ? 'space-between' : 'end'}`,
			}}
		>
			{tableStateValues.gridViewSettings && <GridView tableKey={tableKey} {...tableStateValues.gridViewSettings} />}
			<div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem', position: 'absolute', right: '170px' }}>
				{children || <div />}

				{!isAllRowsSelected && (
					<IconButton onClick={handleExport}>
						<Tooltip title="Download CSV" aria-label="add">
							<CloudDownloadIcon />
						</Tooltip>
					</IconButton>
				)}

				{isSomethingSelected && (
					<IconButton aria-label="delete" onClick={() => handleDelete()}>
						<Tooltip title="Delete">
							<DeleteIcon />
						</Tooltip>
					</IconButton>
				)}
			</div>
		</div>
	);
}

export default ToolbarActions;
