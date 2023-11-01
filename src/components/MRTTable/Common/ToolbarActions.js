import React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import GridView from 'components/MRTTable/Common/GridView';
import { globalStateController } from 'hookstate/globalStateController';
import _ from 'lodash';

function ToolbarActions({ table, tableKey, children }) {
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

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
		'isDeleteDisabled',
		'deletedKeys',
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
		const deletedKeys = tableStateValues?.deletedKeys || {
			mainRecord: { key: '_id' },
		};
		const deletedData = Object.keys(deletedKeys).reduce((acc, key) => {
			const { key: originalKey, func } = deletedKeys[key];
			acc[key] = selectedRows?.length > 0 ? selectedRows.map(item => {
				let val = _.get(item, originalKey)
				if (func) val = func(val)
				return val
			}
			) : null;
			return acc;
		}, {});
		tableGlobalController.updateState({
			dialog: {
				type: 'deleteGrid',
				deletedData,
				tableKey,
				userId: getUser?._id,
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
				marginLeft: tableStateValues?.gridViewSettings?.cssOverride?.marginLeft || '0px',
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

				{(isSomethingSelected && !(!!tableStateValues.isDeleteDisabled)) && (
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
