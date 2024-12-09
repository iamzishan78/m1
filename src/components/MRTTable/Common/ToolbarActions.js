import React, { useEffect } from 'react';
import { ToggleButton } from '@mui/material';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import GridView from 'components/MRTTable/Common/GridView';
import TabHeader from 'components/MRSimpleTable/Common/TabHeader';
import { globalStateController } from 'hookstate/globalStateController';
import { excludeFilters } from './CommonToolBarActions';
import _ from 'lodash';

function ToolbarActions({ table, tableKey, children }) {
	const tableState = tableController(tableKey).useCompleteState();
	const tableStateValues = tableState?.get({ noproxy: true });
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	if (
		tableStateValues?.isSelectAllAllowed &&
		isAllRowsSelected &&
		Object.keys(tableStateValues?.rowSelection)?.length === tableStateValues.data?.total
	)
		tableController(tableKey).setIsAllRowsSelected(isAllRowsSelected);

	useEffect(() => {
		tableController(tableKey).setMrtTableRef(table);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		let excludedIds = [];
		let deletedData = {};
		let ESVariables = {};
		const deletedKeys = tableStateValues?.deletedKeys || {
			mainRecord: { key: '_id' },
		};

		// If all rows are selected, we need to get all the data from the ES
		// If bypassSelectAll is true, we need to bypass the select all
		const { bypassSelectAll } = deletedKeys;
		if ((!!tableStateValues?.isAllRowsSelected || tableStateValues?.isSubSetSelect) && !bypassSelectAll) {
			let sortOrder = {};
			if (tableStateValues.sorting.length > 0) {
				sortOrder = {
					field: tableStateValues.sorting[0]?.id,
					order: tableStateValues.sorting[0]?.desc ? 'desc' : 'asc',
				};
			}
			const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
			const search = { fields: tableStateValues?.searchFields, query };

			excludedIds = excludeFilters(tableKey, tableStateValues?.isSubSetSelect?.total);
			ESVariables = {
				index: tableStateValues.esIndex,
				search,
				sort: Object.keys(sortOrder).length ? sortOrder : tableStateValues.defaultSort,
				filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters, ...excludedIds],
				total: tableStateValues?.isSubSetSelect
					? tableStateValues?.isSubSetSelect?.total
					: tableStateValues?.data?.total - excludedIds?.length,
				customValue: tableStateValues?.customValue,
			};
		} else {
			deletedData = Object.keys(deletedKeys).reduce((acc, key) => {
				const { key: originalKey, func, value } = deletedKeys[key];
				acc[key] =
					selectedRows?.length > 0
						? selectedRows.map(item => {
								let val;
								if (originalKey) val = _.get(item, originalKey);
								if (func) val = func(val);
								if (value) val = value;
								return val;
							})
						: null;
				return acc;
			}, {});
			deletedData.bypassSelectAll = deletedKeys?.bypassSelectAll;
		}

		tableGlobalController.updateState({
			dialog: {
				type: 'deleteGrid',
				deletedData,
				tableKey,
				userId: getUser?._id,
				ESVariables,
				isSelectAll: !!tableStateValues?.isAllRowsSelected || (tableStateValues?.isSubSetSelect ? true : false),
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
				marginLeft: tableStateValues?.gridViewSettings?.cssOverride?.marginLeft || '1rem',
				justifyContent: 'space-between',
				marginTop: 'auto',
				marginBottom: 'auto',
			}}
		>
			<div
				style={{
					marginTop: 'auto',
					marginBottom: 'auto',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<TabHeader labels={tableStateValues.tabLabels} />
				{tableStateValues.gridViewSettings && !isSomethingSelected && (
					<GridView tableKey={tableKey} {...tableStateValues.gridViewSettings} />
				)}
			</div>
			<div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
				<div
					style={{
						display: 'flex',
						height: '32px',
						gap: '0.5rem',
						minHeight: '32px',
						maxHeight: '80px',
						marginTop: '8px',
					}}
				>
					{children}
				</div>

				<ToggleButton
					style={{
						padding: '0',
						height: 'fit-content',
						margin: 'auto 0',
						color: tableStateValues.showTypes ? '#fff' : '#263451',
						backgroundColor: tableStateValues.showTypes ? '#263451' : '#fff',
						border: `1px solid ${tableStateValues.showTypes ? '#fff' : '#263451'}`,
					}}
					selected={tableStateValues.showTypes}
					onChange={() => tableController(tableKey).updateState({ showTypes: !tableStateValues.showTypes })}
				>
					<small
						style={{
							padding: '5px',
							fontWeight: 'normal',
						}}
					>
						{'TYPES'}
					</small>
				</ToggleButton>

				{!tableStateValues.isGeneric && tableStateValues.data?.total > 0 && (
					<IconButton onClick={handleExport} data-testid="download-csv">
						<Tooltip title="Download CSV" aria-label="add">
							<CloudDownloadIcon />
						</Tooltip>
					</IconButton>
				)}

				{isSomethingSelected && !!!tableStateValues.isDeleteDisabled && (
					<IconButton aria-label="delete" data-testid="delete-icon-button" onClick={() => handleDelete()}>
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
