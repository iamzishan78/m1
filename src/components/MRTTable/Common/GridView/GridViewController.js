import { hookstate, useHookstate } from '@hookstate/core';
import { hookStateController } from 'hookstate/hookStateController';
import { tableController } from 'hookstate/tableController';
import _ from 'lodash';

export const gridViewStates = hookstate({});

export const useGridViewStates = () => useHookstate(gridViewStates);

const gridViewStatesControllerHandler = state => ({
	initialize: (tableKey, allGridViews) => {
		state.merge({
			tableKey,
			allGridViews
		});
	},

	gridViewApply: (selectedGridView) => {
		if (!(!!selectedGridView)) return
		const TableKey = state.tableKey?.get({ noproxy: true })
		const Controller = tableController(TableKey)

		Controller.updateState({
			gridView: {
				selectedGridView: selectedGridView,
				showViewModal: false,
				showSaveAsNew: false,
			},
		});

		const TableSchema = Controller.getValue('TableSchema')
		const columnPinning = Controller.getValue('columnPinning')
		if (selectedGridView?.columns) {
			const columnstoShow = selectedGridView?.columns.reduce((acc, obj) => {
				acc[obj.name] = obj.display;
				return acc;
			}, {});

			Controller.setColumnVisibility(columnstoShow);
		} else {
			const defaultVisibility = TableSchema?.reduce(
				(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }),
				{}
			);
			Controller.setColumnVisibility(defaultVisibility);
		}
		if (selectedGridView?.filters?.length) {
			Controller.setShowColumnFilters(true);
			Controller.clearFilters();
			Controller.setFilters(selectedGridView.filters)
		} else {
			Controller.setShowColumnFilters(false);
			Controller.clearFilters();
		}
		if (selectedGridView?.sorting) {
			Controller.setSorting(selectedGridView?.sorting);
		} else {
			Controller.setSorting([]);
		}
		if (selectedGridView?.columnPinning) {
			let filterLeftPinning = selectedGridView?.columnPinning?.left?.map(element => (element === "mrt-row-select" ? "over-ride-checkbox" : element));
			const newColumnPinning = {
				left: filterLeftPinning
			}
			Controller.setColumnPinning(
				newColumnPinning,
				columnPinning,
				TableSchema
			);
		} else {
			const pinnedColumns = TableSchema?.filter(column => column.isPinned);
			const pinnedFields = pinnedColumns?.map(column => column.id || column.accessorKey);
			Controller.setColumnPinning(columnPinning, pinnedFields, TableSchema);
		}
		if (selectedGridView?.columnOrdering) {
			const newColumnOrder = selectedGridView?.columnOrdering?.map(element => (element === "mrt-row-select" ? "over-ride-checkbox" : element));
			Controller.setColumnOrdering(newColumnOrder);
		} else {
			const columnOrder = TableSchema.map(column => column.accessorKey || column.id);
			const defaultColumnOrder = _.concat(['over-ride-checkbox', 'mrt-row-numbers'], _.slice(columnOrder, 1))
			Controller.setColumnOrdering(defaultColumnOrder);
		}
	}

});

export const gridViewStateController = TableKey => {
	return {
		...gridViewStatesControllerHandler(gridViewStates[TableKey]),
		...hookStateController(gridViewStates[TableKey], {}),
	}
};


