import React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import { simpleTableController } from 'hookstate/simpleTableController';
import { tableGlobalController } from 'hookstate/tableController';
import { globalStateController } from 'hookstate/globalStateController';
import _ from 'lodash';
import TabHeader from 'components/Common/MRTable/TabHeader';

function ToolbarActions({ table, tableKey, children }) {
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const Controller = simpleTableController(tableKey);
	Controller.setIsAllRowsSelected(isAllRowsSelected);

	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const tableState = simpleTableController(tableKey).useState([
		'deletedKeys',
		'isDeleteAllowed',
		'isExportAllowed',
		'tabLabels',
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
			acc[key] =
				selectedRows?.length > 0
					? selectedRows.map(item => {
							let val = _.get(item, originalKey);
							if (func) val = func(val);
							return val;
						})
					: null;
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
				marginLeft: '1rem',
				justifyContent: 'space-between',
				marginTop: 'auto',
				marginBottom: 'auto',
			}}
		>
			<div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
				<TabHeader labels={tableStateValues.tabLabels} />
			</div>

			<div
				style={{
					display: 'flex',
					gap: '0.5rem',
					marginLeft: '0.5rem',
				}}
			>
				{children || <div />}

				{tableStateValues.isExportAllowed && !isAllRowsSelected && (
					<IconButton onClick={handleExport}>
						<Tooltip title="Download CSV" aria-label="add">
							<CloudDownloadIcon />
						</Tooltip>
					</IconButton>
				)}

				{tableStateValues.isDeleteAllowed && isSomethingSelected && (
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
