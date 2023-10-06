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
		'disableDelete',
		'deletKeys',
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
		const deletedIds = tableStateValues?.deletKeys || {
			mainRecord: '_id',
		};
		const selectedIds = Object.keys(deletedIds).reduce((acc, key) => {
			const originalKey = deletedIds[key];
			if (originalKey.includes('.')) {
				const keys = originalKey.split('.');
				acc[key] = selectedRows?.length > 0 ? selectedRows.map(item => item[keys[0]]?.[keys[1]]) : null;
			} else {
				acc[key] = selectedRows?.length > 0 ? selectedRows.map(item => item[originalKey]) : null;
			}
			return acc;
		}, {});
		tableGlobalController.updateState({
			dialog: {
				type: 'deleteGrid',
				Ids: selectedIds,
				tableKey,
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

				{(isSomethingSelected && !(!!tableStateValues.disableDelete)) && (
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
