import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';

import { IconButton, Tooltip, ToggleButton } from '@mui/material';

import { mkConfig, generateCsv, download } from 'export-to-csv/output';
import _ from 'lodash';
import PropTypes from 'prop-types';

import GridView from 'components/MRTTable/Common/GridView';
import TabHeader from 'components/MRTTable/Common/TabHeader';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController, tableGlobalController } from 'stateManagement/tableController';

import { showErrorMessage } from 'actions';

import { excludeFilters } from './CommonToolBarActions';
import TableHeader from './TableHeader';

function ToolbarActions({ table, tableKey, children }) {
	const dispatch = useDispatch();

	const { user: getUser } = globalStateController.useState(['user']);
	const tableStateValues = tableController(tableKey).useCompleteState();
	const { isClientSide } = tableStateValues;

	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const filteredColumns = _.pickBy(tableStateValues.columnVisibility, _.identity);
	let filteredTableSchema = tableStateValues?.TableSchema.filter(obj => {
		const accessorKey = obj?.accessorKey || obj?.id;
		return (
			(filteredColumns[accessorKey] === true && !Object.prototype.hasOwnProperty.call(obj, 'enableColumnFilter')) ||
			obj?.isHiddenFieldExport
		);
	});

	if (
		tableStateValues?.isSelectAllAllowed &&
		isAllRowsSelected &&
		Object.keys(tableStateValues?.rowSelection)?.length === tableStateValues.data?.total
	) {
		tableController(tableKey).setIsAllRowsSelected(isAllRowsSelected);
	}

	useEffect(() => {
		tableController(tableKey).setMrtTableRef(table);
	}, [tableKey]);

	const handleClientSideExport = () => {
		try {
			// Generate filename based on current date and table key
			const timestamp = new Date().toISOString();
			const filename = `exportGrid_${timestamp}`;

			const csvConfig = mkConfig({
				fieldSeparator: ',',
				decimalSeparator: '.',
				useKeysAsHeaders: true,
				filename,
			});

			// Get rows based on selection state
			const rows = isSomeRowsSelected ? table.getSelectedRowModel().rows : table.getPrePaginationRowModel().rows;

			// Transform and validate data, only including visible column data
			const data = rows?.map(row => {
				return filteredTableSchema.reduce((acc, column) => {
					const value = row.getValue(column.id);
					// Use column header as key and handle non-primitive values
					acc[column.header || column.id] = value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
					return acc;
				}, {});
			});

			const csv = generateCsv(csvConfig)(data);
			download(csvConfig)(csv);
		} catch (error) {
			dispatch(showErrorMessage(error?.message || 'Error exporting grid'));
		}
	};

	const handleExport = () => {
		if (isClientSide) {
			handleClientSideExport();
			return;
		}

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
				modelName: tableStateValues.modelName,
				search,
				sort: Object.keys(sortOrder).length ? sortOrder : tableStateValues.defaultSort,
				filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters, ...excludedIds],
				total: tableStateValues?.isSubSetSelect
					? tableStateValues?.isSubSetSelect?.total
					: tableStateValues?.data?.total - excludedIds?.length,
				customValue: tableStateValues?.customValue,
			};

			deletedData = Object.keys(deletedKeys).reduce((acc, key) => {
				const { value } = deletedKeys[key];

				if (value) {
					acc[key] = value;
				}

				return acc;
			}, {});
		} else {
			deletedData = Object.keys(deletedKeys).reduce((acc, key) => {
				const { key: originalKey, func, value } = deletedKeys[key];

				if (value) {
					acc[key] = value;
					return acc;
				}

				if (selectedRows?.length > 0) {
					acc[key] = selectedRows.map(item => {
						let val;
						if (originalKey) {
							val = _.get(item, originalKey);
						}
						if (func) {
							val = func(val);
						}
						return val;
					});
				}

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
				<Typography variant="h5" style={{ fontWeight: 'bold', marginRight: '5px' }}>
					{tableStateValues.tableHeading}
				</Typography>
				<TabHeader labels={tableStateValues.tabLabels} />
				{tableStateValues.gridViewSettings && !isSomethingSelected && <GridView moduleName={tableKey} />}

				{tableStateValues.defaultHeader && !tableStateValues.gridViewSettings && (
					<TableHeader {...tableStateValues.defaultHeader} />
				)}
			</div>
			<div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
				<div
					style={{
						display: 'flex',
						height: '75%',
						gap: '0.5rem',
						marginTop: 'auto',
						marginBottom: 'auto',
					}}
				>
					{children}
				</div>

				{tableStateValues?.isAggregatedSearch && (
					<ToggleButton
						style={{
							padding: '0',
							height: 'fit-content',
							margin: 'auto 0',
							color: tableStateValues.advanceSearch?.aggregatedSearch ? '#fff' : '#263451',
							backgroundColor: tableStateValues.advanceSearch?.aggregatedSearch ? '#263451' : '#fff',
							border: `1px solid ${tableStateValues.advanceSearch?.aggregatedSearch ? '#fff' : '#263451'}`,
						}}
						selected={tableStateValues.advanceSearch?.aggregatedSearch}
						onChange={() =>
							tableController(tableKey).updateState({
								advanceSearch: { aggregatedSearch: !tableStateValues.advanceSearch?.aggregatedSearch },
							})
						}
					>
						<small
							style={{
								padding: '5px',
								fontWeight: 'normal',
							}}
						>
							{'Aggregated Search'}
						</small>
					</ToggleButton>
				)}

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

				{tableStateValues.data?.total > 0 && !tableStateValues.isExportDisabled && (
					<IconButton onClick={handleExport} data-testid="download-csv">
						<Tooltip title="Download CSV" aria-label="add">
							<CloudDownloadIcon />
						</Tooltip>
					</IconButton>
				)}

				{isSomethingSelected && !tableStateValues.isDeleteDisabled && (
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

ToolbarActions.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
	children: PropTypes.node,
};

export default ToolbarActions;
