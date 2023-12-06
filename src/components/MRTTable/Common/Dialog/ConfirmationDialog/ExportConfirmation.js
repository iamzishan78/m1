import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import { tableController } from 'hookstate/tableController';
import { execCommonAsyncExportJobAction } from 'store/actions/commonActions';
import { globalStateController } from 'hookstate/globalStateController';
import { Modals } from '../../../../../styles/Modal';
import { excludeFilters } from 'components/MRTTable/Common/CommonToolBarActions';

export default function ExportConfirmationDialog({ table, tableKey, header, onClose, children }) {
	const dispatch = useDispatch();
	const client = useApolloClient();
	const modalClass = Modals();
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const tableState = tableController(tableKey).useState([
		'TableSchema',
		'esIndex',
		'datasets',
		'globalFilter',
		'searchFields',
		'defaultSort',
		'data',
		'gridViewSettings',
		'sorting',
		'columnVisibility',
		'filters',
		'defaultFilters',
		'isAllRowsSelected'
	]);
	const tableStateValues = tableState.stateValues;

	const handleExport = () => {
		const rows = table.getSelectedRowModel().flatRows.map(row => row.original);
		let isSelectAll = true;
		let excludedIds = []
		if (rows.length !== 0 && !(!!tableStateValues?.isAllRowsSelected)) {
			isSelectAll = false;
		} else if (!!tableStateValues?.isAllRowsSelected) {
			excludedIds = excludeFilters(tableKey)
		}
		const filteredColumns = _.pickBy(tableStateValues.columnVisibility, _.identity);

		let filteredTableSchema = tableStateValues?.TableSchema.filter(obj => {
			const accessorKey = obj?.accessorKey || obj?.id;
			return filteredColumns[accessorKey] === true && !obj.hasOwnProperty('enableColumnFilter');
		});

		filteredTableSchema = filteredTableSchema?.map(({ name, header, accessorKey, id, isExport }) => ({
			name,
			label: header,
			esKey: isExport || accessorKey || id,
		}));

		let sortOrder = {};
		if (tableStateValues.sorting.length > 0) {
			sortOrder = { field: tableStateValues.sorting[0]?.id, order: tableStateValues.sorting[0]?.desc ? 'desc' : 'asc' };
		}

		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		const selectedIds = rows && rows.length > 0 ? rows.map(item => item._id) : null;

		dispatch(
			execCommonAsyncExportJobAction.STARTED({
				jobType: 'EXPORTCSV',
				client,
				setStateApp: window.setStateApp,
				userId: getUser?._id,
				requestPayload: {
					total: tableStateValues?.data.total,
					search,
					filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters, ...excludedIds],
					esIndex: tableStateValues.esIndex,
					columns: filteredTableSchema,
					sortOrder,
					defaultSort: tableStateValues?.defaultSort,
					datasets: tableStateValues.datasets || { exportGrid: true },
					isSelectAll,
					selectedIds,
					counts: {
						exportGrid: tableStateValues?.data.total,
					},
				},
			})
		);

		table.resetRowSelection();
		onClose();
	};

	return (
		<Dialog style={{ zIndex: 9999999999 }} open maxWidth="xs">
			<DialogTitle className={modalClass.title} id="customized-dialog-title">
				{header}
				<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={onClose} />
			</DialogTitle>
			<DialogContent>
				<h3 className={modalClass.inputLabel}>{children}</h3>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						onClose();
					}}
					color="primary"
				>
					Cancel
				</Button>
				<Button id="deleteButton" onClick={handleExport} color="secondary">
					Export
				</Button>
			</DialogActions>
		</Dialog>
	);
}
