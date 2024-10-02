import React, { memo } from 'react';
import { useApolloClient } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { tableController,  } from 'hookstate/tableController';
import { BulkUpdate } from 'components/MRTTable/Common/CommonToolBarActions';

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

function UnitToolbar({ table, tableKey }) {
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
		'showAddContactButton',
		'isAllRowsSelected',
		'rowSelection',
		'tableStateValues',
		'defaultFilters',
		'customProps',
	]);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected = table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

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
			objectType: "unit",
			refetchQueries: ["getESSimpleSearch"]
		};
	};

	const sidePropsPass = SideDialogProps();

	return (
		<>
			{isSomethingSelected && ( // show bulk update button when row of unit grid is selected
				<BulkUpdate isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />
			)}
		</>
	);
}

export default memo(UnitToolbar);
