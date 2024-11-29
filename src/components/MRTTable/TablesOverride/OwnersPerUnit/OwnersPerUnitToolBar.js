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
import { BulkUpdate, ExportData, ViewContactData, openSideDialog } from 'components/MRTTable/Common/CommonToolBarActions';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import { globalStateController } from 'hookstate/globalStateController';
import MetaField from "components/Table/helpers/MetaField";

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
	const [, setStateNav] = React.useContext(NavigationContext);
	const tableState = Controller.useState([
		'esIndex',
		'globalFilter',
		'searchFields',
		'data',
		'filters',
		'defaultSort',
		'sorting',
		'isAllRowsSelected',
		'rowSelection',
		'defaultFilters',
	]);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected = table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');

	const addOwnerToUnit = e => {
		const { customLayer } = Controller.getValue('customProps');
		e.stopPropagation();
		tableGlobalController.updateState({
			dialog: {
				type: 'addOwnerToUnit',
				shapeId: customLayer?._id,
				uAcres: customLayer?.shapeJson?.properties?.uAcres,
				uUnitPricing: customLayer?.shapeJson?.properties?.uUnitPricing,
				uMaxUnitPricing: customLayer?.shapeJson?.properties?.uMaxUnitPricing,
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
				const { customLayer } = Controller.getValue('customProps');
				navController.updateState({
					bulkUploadParcel: null,
					bulkUploadFromMap: true,
					bulkUploadShape: {
						id: customLayer?._id,
						shapeLabel: customLayer?.name,
						shapeType: 'Unit',
					},
				});

				setStateNav((state) => ({
					...state,
					bulkUploadParcel: null,
					bulkUploadFromMap: true,
					bulkUploadShape: {
						id: customLayer?._id,
						shapeLabel: customLayer?.name,
						shapeType: 'Unit',
					},
				}));

				history.push('/bulkupload');
			},
		},
	];

	const ExportProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		let sort = tableStateValues.defaultSort
		if (tableStateValues?.sorting?.length) {
			sort = { field: tableStateValues?.sorting?.[0].id, order: tableStateValues.sorting?.[0].desc ? 'desc' : 'asc', }
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
			contactIdKey: '_id',
			shapeType: 'Unit',
		};
	};

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
			objectType: 'contact' ,
			refetchQueries: ["getESContacts"]
		};
	};

	const sidePropsPass = SideDialogProps();
	const exportPropsPass = ExportProps();

	return (
		<>
			{!isSomethingSelected && (
				<ButtonDropDown
					options={options}
					buttonStyles={{ padding: '12px 6px' }}
					sideButtonStyles={{ minWidth: '25px', padding: 0 }}
				/>
			)}

			{isSomethingSelected && (
				<Button
					color="secondary"
					startIcon={<AutorenewIcon color="white" />}
					className={classes.multiSelectionTopBarButtons}
					disabled={false}
					onClick={() => openSideDialog(
						{
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
						}
					)}
					data-testid="recalculate"
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
			{globalStateValues.showFieldModal && <MetaField columns={[]} category="Unit Interest Owners" tableKey={tableKey} />}

		</>
	);
}

export default memo(OwnersPerUnitToolBar);
