import React from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { useApolloClient } from '@apollo/client';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { excludeFilters } from 'components/MRTTable/Common/CommonToolBarActions';

import { globalStateController } from 'stateManagement/globalStateController';

import { execCommonAsyncExportJobAction } from 'store/actions/commonActions';

import { Modals } from '../../../../../styles/Modal';

function ExportConfirmationDialog({ table, tableKey, header, onClose, children, controller }) {
	const dispatch = useDispatch();
	const client = useApolloClient();
	const modalClass = Modals();
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const Controller = controller(tableKey);

	const tableState = Controller.useCompleteState();
	const tableStateValues = tableState?.get({ noproxy: true });

	const handleExport = () => {
		const rows = table.getSelectedRowModel().flatRows.map(row => row.original);
		let isSelectAll = true;
		let excludedIds = [];
		let total = tableStateValues?.data.total;
		let customProps = tableStateValues.customProps;
		if (rows.length !== 0 && !tableStateValues?.isAllRowsSelected && !tableStateValues?.isSubSetSelect) {
			isSelectAll = false;
		} else if (!!tableStateValues?.isAllRowsSelected || tableStateValues?.isSubSetSelect) {
			excludedIds = excludeFilters(tableKey, tableStateValues?.isSubSetSelect?.total);
			total = tableStateValues?.isSubSetSelect?.total ? tableStateValues?.isSubSetSelect?.total : total;
			total = total - excludedIds.length;
		}
		const filteredColumns = _.pickBy(tableStateValues.columnVisibility, _.identity);

		let filteredTableSchema = tableStateValues?.TableSchema.filter(obj => {
			const accessorKey = obj?.accessorKey || obj?.id;
			return (
				(filteredColumns[accessorKey] === true && !Object.prototype.hasOwnProperty.call(obj, 'enableColumnFilter')) ||
				obj?.isHiddenFieldExport
			);
		});

		filteredTableSchema = filteredTableSchema?.map(
			({ name, header, accessorKey, id, isExport, type, handleArrayExport = {} }) => {
				const { esType, referenceKey, referenceValueKey, actualKey } = handleArrayExport;
				return {
					name,
					label: header,
					esKey: isExport || accessorKey || id,
					type,
					accessorKey: accessorKey || id,
					esType,
					referenceKey,
					referenceValue: customProps[referenceValueKey],
					actualKey,
				};
			}
		);

		let sortOrder = {};
		if (tableStateValues.sorting.length > 0) {
			const column = filteredTableSchema.find(col => col.accessorKey === tableStateValues.sorting[0]?.id);
			let fieldName = column?.name || tableStateValues.sorting[0]?.id;
			sortOrder = { field: fieldName, order: tableStateValues.sorting[0]?.desc ? 'desc' : 'asc' };
		}

		filteredTableSchema = filteredTableSchema?.map(
			({ name, label, esKey, type, esType, referenceKey, referenceValue, actualKey }) => ({
				name,
				label,
				esKey,
				type,
				esType,
				referenceKey,
				referenceValue,
				actualKey,
			})
		);

		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		const selectedIds = rows && rows.length > 0 ? rows.map(item => item._id) : null;

		const grouping = filteredTableSchema
			.filter(col => tableStateValues?.grouping.includes(col.esKey))
			.map(col => ({ esKey: col.esKey, label: col.label }));

		const isSummaryGrid = tableStateValues.isSummaryGrid ?? false;

		dispatch(
			execCommonAsyncExportJobAction.STARTED({
				jobType: 'EXPORTCSV',
				client,
				setStateApp: window.setStateApp,
				userId: getUser?._id,
				requestPayload: {
					total,
					search,
					filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters, ...excludedIds],
					esIndex: tableStateValues.esIndex,
					modelName: tableStateValues.modelName,
					extraExportValues: tableStateValues?.customProps?.exportValues,
					columns: filteredTableSchema,
					sortOrder,
					defaultSort: tableStateValues?.defaultSort,
					datasets: tableStateValues.datasets || { exportGrid: true },
					isSelectAll,
					selectedIds,
					counts: {
						exportGrid: tableStateValues?.data.total,
					},
					isSummaryGrid,
					grouping: grouping.length > 0 ? grouping : null,
				},
			})
		);

		table.resetRowSelection();
		Controller.updateState({
			isSubSetSelect: null,
		});
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
				<Button id="deleteButton" data-testid="export-confirm" onClick={handleExport} color="secondary">
					Export
				</Button>
			</DialogActions>
		</Dialog>
	);
}

ExportConfirmationDialog.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	controller: PropTypes.object.isRequired,
};

export default ExportConfirmationDialog;
