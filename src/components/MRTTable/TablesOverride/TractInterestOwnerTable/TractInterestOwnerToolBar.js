import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ButtonDropDown from 'components/Shared/M1nTable/components/ButtonGroup';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { navController } from 'hookstate/navStateController';
import TractInterestTableDialogs from 'components/MRTTable/TablesOverride/TractInterestOwnerTable/RightDialogs';
import { popupController } from 'hookstate/popupStateController';
import { BulkUpdate, ViewContactData } from 'components/MRTTable/Common/CommonToolBarActions';

const useStyles = makeStyles(() => ({
	disabledTopBarButtons: {
		fontWeight: '600',
		color: '#fff',
		border: '1px solid #B3B3B3',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
	},
	selectTopBarButtons: {
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff !important',
		fontWeight: '600',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff !important',
		},
	},
}));

function TractInterestOwnerToolBar({ table, tableKey }) {
	const history = useHistory();
	const classes = useStyles();
	const client = useApolloClient();
	const Controller = tableController(tableKey);
	const tableState = Controller.useState([
		'esIndex',
		'globalFilter',
		'searchFields',
		'data',
		'filters',
		'defaultSort',
		'sorting',
		'defaultFilters',
		'isSelectall',
	]);
	const tableStateValues = tableState.stateValues;
	const { customLayer } = Controller.getValue('customProps');

	const addOwnerToTract = e => {
		e.stopPropagation();
		tableGlobalController.updateState({
			tractInterestDialog: {
				type: 'addTractInterest',
				customLayerId: customLayer?._id,
				customLayer,
				selectedRow: null,
			},
		});
		table.resetRowSelection();
	};

	const options = [
		{
			text: '+ ADD INTEREST OWNER',
			isShow: false,
			action: addOwnerToTract,
		},
		{
			text: 'Import Interest Owners',
			isShow: true,
			action: () => {
				navController.updateState({
					bulkUploadFromMap: true,
					bulkUploadParcel: popupController.getValue('selectedParcel'),
				});
				history.push('/bulkupload');
			},
		},
	];

	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const SideDialogProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		return {
			selectedRows,
			isAllRowsSelected,
			isSelectall: tableStateValues?.isSelectall,
			search,
			sorting: tableStateValues?.sorting,
			defaultSort: tableStateValues?.defaultSort,
			esIndex: tableStateValues.esIndex,
			filters: tableStateValues.filters,
			total: tableStateValues?.data.total,
			client,
			table,
			tableKey
		};
	};

	const handleExport = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		tableGlobalController.updateState({
			tractInterestDialog: {
				type: 'exportOwnersAndContact',
				search,
				filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters],
				total: tableStateValues?.data.total,
				isSelectAll: isAllRowsSelected,
				selectedRows,
				esIndex: tableStateValues.esIndex,
			},
		});
		table.resetRowSelection();
	};

	const sidePropsPass = SideDialogProps();

	const handleRecalculate = () => {
		tableGlobalController.updateState({
			tractInterestDialog: {
				type: 'recalculate',
				selectedRows,
			},
		});
		table.resetRowSelection();
	};

	return (
		<>
			{isSomethingSelected && (
				<Button
					color="secondary"
					startIcon={<AutorenewIcon color="white" />}
					className={classes.selectTopBarButtons}
					disabled={false}
					onClick={() => handleRecalculate()}
				>
					Recalculate
				</Button>
			)}

			{!isSomethingSelected && (
				<ButtonDropDown
					options={options}
					buttonStyles={{ padding: '12px 6px' }}
					sideButtonStyles={{ minWidth: '25px', padding: 0 }}
				/>
			)}
			{!isSomethingSelected && <TractInterestTableDialogs />}
			{isSomethingSelected && (
				<BulkUpdate isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />
			)}

			{isSomethingSelected && (
				<Button
					color="secondary"
					startIcon={<CloudDownloadIcon color="white" />}
					className={classes.selectTopBarButtons}
					onClick={() => handleExport()}
				>
					Export
				</Button>
			)}

			{isSomethingSelected && (
				<ViewContactData isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />
			)}
		</>
	);
}

export default memo(TractInterestOwnerToolBar);
