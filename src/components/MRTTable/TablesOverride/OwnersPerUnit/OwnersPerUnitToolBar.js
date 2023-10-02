import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useApolloClient } from '@apollo/client';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Button from '@material-ui/core/Button';
import ButtonDropDown from 'components/Shared/M1nTable/components/ButtonGroup';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { navController } from 'hookstate/navStateController';
import OwnerPerUnitTableDialogs from 'components/MRTTable/TablesOverride/OwnersPerUnit/RightDialogs';
import { BulkUpdate, ExportData, ViewContactData } from 'components/MRTTable/Common/CommonToolBarActions';

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

	multiSelectionTopBarButtons: {
		margin: '0px 5px',
		fontWeight: '600',
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff',
		border: '1px solid #B3B3B3',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
	},
}));

function OwnersPerUnitToolBar({ table, tableKey }) {
	const classes = useStyles();
	const history = useHistory();
	const client = useApolloClient();
	const Controller = tableController(tableKey);
	const { customLayer } = Controller.getValue('customProps');
	const tableState = Controller.useState([
		'esIndex',
		'globalFilter',
		'searchFields',
		'data',
		'filters',
		'defaultSort',
		'sorting',
		'isSelectall',
	]);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const addOwnerToUnit = e => {
		e.stopPropagation();
		tableGlobalController.updateState({
			ownerPerUnitDialog: {
				type: 'addOwnerToUnit',
				shapeId: customLayer._id,
				uAcres: customLayer?.shapeJson?.properties?.uAcres,
				uUnitPricing: customLayer?.shapeJson?.properties?.uUnitPricing,
				shapeType: 'Unit',
				selectedRow: null,
			},
		});
		table.resetRowSelection();
	};

	const options = [
		{
			text: '+ ADD OWNER TO UNIT',
			isShow: false,
			action: addOwnerToUnit,
		},
		{
			text: 'Import Interest Owners',
			isShow: true,
			action: () => {
				navController.updateState({
					bulkUploadFromMap: true,
					bulkUploadShape: {
						id: customLayer._id,
						shapeLabel: customLayer.name,
						shapeType: 'Unit',
					},
				});
				history.push('/bulkupload');
			},
		},
	];

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
		};
	};

	const sidePropsPass = SideDialogProps();
	const exportPropsPass = ExportProps();

	const handleRecalculate = () => {
		tableGlobalController.updateState({
			ownerPerUnitDialog: {
				type: 'recalculate',
				selectedRows,
			},
		});
		table.resetRowSelection();
	};

	return (
		<>
			{!isSomethingSelected && <ButtonDropDown options={options} />}

			{isSomethingSelected && (
				<Button
					color="secondary"
					startIcon={<AutorenewIcon color="white" />}
					className={classes.multiSelectionTopBarButtons}
					disabled={false}
					onClick={() => handleRecalculate()}
				>
					Recalculate
				</Button>
			)}

			{isSomethingSelected && (
				<BulkUpdate isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />
			)}

			{isSomethingSelected && <ExportData classes={classes} {...exportPropsPass} />}

			{isSomethingSelected && (
				<ViewContactData isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />
			)}

			<OwnerPerUnitTableDialogs />
		</>
	);
}

export default memo(OwnersPerUnitToolBar);
