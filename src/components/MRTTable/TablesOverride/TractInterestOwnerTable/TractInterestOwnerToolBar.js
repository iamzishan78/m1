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
import {
	BulkUpdate,
	ViewContactData,
	openSideDialog,
	ExportData,
} from 'components/MRTTable/Common/CommonToolBarActions';
import { NavigationContext } from 'components/Navigation/NavigationContext';

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
	const [, setStateNav] = React.useContext(NavigationContext);
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
		'isAllRowsSelected',
		'rowSelection',
	]);
	const tableStateValues = tableState.stateValues;

	const addOwnerToTract = e => {
		const { customLayer } = Controller.getValue('customProps');
		e.stopPropagation();
		tableGlobalController.updateState({
			dialog: {
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
					bulkUploadShape: null,
					bulkUploadFromMap: true,
					bulkUploadParcel: popupController.getValue('selectedParcel'),
				});

				setStateNav(state => ({
					...state,
					bulkUploadShape: null,
					bulkUploadFromMap: true,
					bulkUploadParcel: popupController.getValue('selectedParcel'),
				}));
				history.push('/bulkupload');
			},
		},
	];

	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const SideDialogProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		return {
			selectedRows,
			isAllRowsSelected: tableStateValues.isAllRowsSelected,
			search,
			sorting: tableStateValues?.sorting,
			defaultSort: tableStateValues?.defaultSort,
			esIndex: tableStateValues.esIndex,
			filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters],
			total: tableStateValues?.data.total,
			client,
			table,
			tableKey,
			objectType: 'contact',
			refetchQueries: ['getESContacts'],
		};
	};

	const ExportProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		let sort = tableStateValues.defaultSort;
		if (tableStateValues?.sorting?.length) {
			sort = { field: tableStateValues?.sorting?.[0].id, order: tableStateValues.sorting?.[0].desc ? 'desc' : 'asc' };
		}

		return {
			_selectedRows: selectedRows,
			search,
			filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters],
			sort,
			total: tableStateValues?.data.total,
			isAllRowsSelected: tableStateValues.isAllRowsSelected,
			esIndex: tableStateValues.esIndex,
			table,
			tableKey,
			type: 'exportContacts',
			contactIdKey: 'contactId',
			shapeType: 'Tract',
		};
	};

	const sidePropsPass = SideDialogProps();
	const exportPropsPass = ExportProps();

	return (
		<>
			{isSomethingSelected && (
				<Button
					color="secondary"
					startIcon={<AutorenewIcon color="white" />}
					className={classes.selectTopBarButtons}
					disabled={false}
					onClick={() =>
						openSideDialog({
							type: 'recalculate',
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
						})
					}
					data-testid="recalculate"
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

			{isSomethingSelected && <ExportData classes={classes} {...exportPropsPass} />}

			{isSomethingSelected && (
				<ViewContactData isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />
			)}
		</>
	);
}

export default memo(TractInterestOwnerToolBar);
