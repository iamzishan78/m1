import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import MergeTypeIcon from '@material-ui/icons/MergeType';

import { useApolloClient } from '@apollo/client';
import PropTypes from 'prop-types';

import {
	BulkUpdate,
	ExportData,
	ViewContactData,
	openSideDialog,
} from 'components/MRTTable/Common/CommonToolBarActions';
import ButtonDropDown from 'components/MRTTable/Common/Components/ButtonDropDown';

import { tableController, tableGlobalController } from 'controllers/tableController';

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
		'showAddContactButton',
		'isAllRowsSelected',
		'rowSelection',
		'tableStateValues',
		'defaultFilters',
		'customProps',
	]);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const routeChange = route => {
		history.push(route);
	};

	const addContact = e => {
		e.stopPropagation();
		tableGlobalController.updateState({
			dialog: {
				type: 'addContact',
			},
		});
		table.resetRowSelection();
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
			filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters], //both filter array send to backend
			sort,
			total: tableStateValues?.data.total,
			isAllRowsSelected: tableStateValues.isAllRowsSelected,
			esIndex: tableStateValues.esIndex,
			table,
			tableKey,
			type: 'exportContacts',
			contactIdKey: '_id',
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
			search,
			isAllRowsSelected: tableStateValues.isAllRowsSelected,
			sorting: tableStateValues?.sorting,
			defaultSort: tableStateValues?.defaultSort,
			esIndex: tableStateValues.esIndex,
			filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters],
			total: tableStateValues?.data.total,
			client,
			table,
			tableKey,
			selectedCampaign: tableStateValues.customProps?.campaign,
			objectType: 'contact',
			refetchQueries: ['getESContacts'],
		};
	};

	const exportPropsPass = ExportProps();
	const sidePropsPass = SideDialogProps();

	return (
		<>
			<>
				{!isSomethingSelected && tableStateValues?.showAddContactButton && (
					<ButtonDropDown options={options} data_test_id="add-contact-icon-button" />
				)}

				{isSomethingSelected && (
					<>
						<ViewContactData isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />

						<BulkUpdate isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />

						<Button
							color="secondary"
							startIcon={<MergeTypeIcon />}
							className={
								isSomethingSelected && selectedRows.length > 1
									? classes.selectTopBarButtons
									: classes.disabledTopBarButtons
							}
							disabled={!(isSomethingSelected && selectedRows.length > 1)}
							onClick={() =>
								openSideDialog({
									type: 'merge',
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
						>
							Merge
						</Button>
						<Button
							color="secondary"
							startIcon={<EmailRoundedIcon />}
							className={isSomethingSelected ? classes.selectTopBarButtons : classes.disabledTopBarButtons}
							disabled={!isSomethingSelected}
							onClick={() =>
								openSideDialog({
									type: 'sendMailers',
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
									props: {
										...(tableStateValues.customProps?.campaign && { campaign: tableStateValues.customProps?.campaign }),
									},
								})
							}
						>
							Mailers
						</Button>

						<ExportData classes={classes} {...exportPropsPass} />
					</>
				)}
			</>
			<ContactTableDialogs tableKey={tableKey} />
		</>
	);
}

ContactToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default ContactToolbar;
