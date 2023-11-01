import React, { memo } from 'react';
import Button from '@material-ui/core/Button';
import { useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import { makeStyles } from '@material-ui/core/styles';
import ButtonDropDown from 'components/Shared/M1nTable/components/ButtonGroup';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { BulkUpdate, ExportData, ViewContactData } from 'components/MRTTable/Common/CommonToolBarActions';
import { getAllData } from 'components/MRTTable/utils/GetAllData';
import ContactTableDialogs from './RightDialogs';

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

function ContactToolbar({ table, tableKey }) {
	const classes = useStyles();
	const client = useApolloClient();
	const history = useHistory();
	const Controller = tableController(tableKey);
	const tableState = Controller.useState([
		'esIndex',
		'globalFilter',
		'searchFields',
		'data',
		'filters',
		'defaultSort',
		'sorting',
		'isSelectall',
		'showAddContactButton',
	]);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	Controller.setSelectAll(isAllRowsSelected);

	const routeChange = route => {
		history.push(route);
	};

	const addContact = e => {
		e.stopPropagation();
		tableGlobalController.updateState({
			contactDialog: {
				type: 'addContact',
			},
		});
		table.resetRowSelection();
	};

	const openSideDialog = async (type, _selectedRows) => {
		let showRows = _selectedRows;
		if (isAllRowsSelected) {
			const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
			const search = { fields: tableStateValues?.searchFields, query };

			tableGlobalController.updateState({
				contactDialog: {
					type,
					selectedRows: [],
				},
			});
			showRows = await getAllData(
				search,
				tableStateValues?.sorting,
				tableStateValues?.defaultSort,
				tableStateValues.esIndex,
				tableStateValues.filters,
				tableStateValues?.data.total,
				client
			);
		}
		tableGlobalController.updateState({
			contactDialog: {
				type,
				selectedRows: showRows,
			},
		});
		table.resetRowSelection();
	};

	const ExportProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		return {
			_selectedRows: selectedRows,
			search,
			filters: tableStateValues.filters,
			total: tableStateValues?.data.total,
			isSelectAll: isAllRowsSelected,
			esIndex: tableStateValues.esIndex,
			table,
		};
	};

	const options = [
		{
			text: '+ ADD CONTACT',
			isShow: false,
			action: addContact,
		},
		{
			text: 'Import Contacts',
			isShow: true,
			action: () => routeChange('/bulkupload'),
		},
	];

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

	const exportPropsPass = ExportProps();
	const sidePropsPass = SideDialogProps();

	return (
		<>
			<>
				{(!isSomethingSelected && tableStateValues?.showAddContactButton) && <ButtonDropDown options={options} />}

				<ViewContactData isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />

				<BulkUpdate isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />

				<Button
					color="secondary"
					startIcon={<MergeTypeIcon />}
					className={
						isSomethingSelected && selectedRows.length > 1 ? classes.selectTopBarButtons : classes.disabledTopBarButtons
					}
					disabled={!(isSomethingSelected && selectedRows.length > 1)}
					onClick={() => openSideDialog('merge', selectedRows)}
				>
					Merge
				</Button>
				<Button
					color="secondary"
					startIcon={<EmailRoundedIcon />}
					className={isSomethingSelected ? classes.selectTopBarButtons : classes.disabledTopBarButtons}
					disabled={!isSomethingSelected}
					onClick={() => openSideDialog('sendMailers', selectedRows)}
				>
					Mailers
				</Button>

				{isSomethingSelected && <ExportData classes={classes} {...exportPropsPass} />}
			</>
			<ContactTableDialogs />
		</>
	);
}

export default memo(ContactToolbar);
