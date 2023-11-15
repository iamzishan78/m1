import React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import GridView from 'components/MRTTable/Common/GridView';
import TabHeader from 'components/MRSimpleTable/Common/TabHeader';
import { openSideDialog } from './CommonToolBarActions';
import { useApolloClient } from '@apollo/client';

function ToolbarActions({ table, tableKey, children }) {
	const client = useApolloClient();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const tableState = tableController(tableKey).useCompleteState();
	const tableStateValues = tableState?.get({ noproxy: true });
	if (tableStateValues?.isSelectAllAllowed)
		tableController(tableKey).setIsAllRowsSelected(isAllRowsSelected);


	const SideDialogProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		return {
			selectedRows,
			search,
			isAllRowsSelected: tableStateValues.isAllRowsSelected,
			sorting: tableStateValues?.sorting,
			defaultSort: tableStateValues?.defaultSort,
			esIndex: tableStateValues.esIndex,
			filters: tableStateValues.filters,
			total: tableStateValues?.data?.total,
			client,
			table,
			tableKey
		};
	};

	const sidePropsPass = SideDialogProps();

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
				{children || <div />}

				{!isAllRowsSelected && (
					<IconButton onClick={handleExport}>
						<Tooltip title="Download CSV" aria-label="add">
							<CloudDownloadIcon />
						</Tooltip>
					</IconButton>
				)}

				{isSomethingSelected && !!!tableStateValues.isDeleteDisabled && (
					<IconButton aria-label="delete"
						onClick={() => openSideDialog(
							{
								type: 'deleteGrid',
								selectedRows,
								isAllRowsSelected: sidePropsPass.isAllRowsSelected,
								search: sidePropsPass.search,
								sorting: sidePropsPass.sorting,
								defaultSort: sidePropsPass.defaultSort,
								esIndex: sidePropsPass.esIndex,
								filters: sidePropsPass.filters,
								total: sidePropsPass.total,
								client,
								table,
								tableKey,
							}
						)}
					>
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
