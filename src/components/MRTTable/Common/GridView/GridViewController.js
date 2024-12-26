import { hookstate, useHookstate } from '@hookstate/core';
import { hookStateController } from 'hookstate/hookStateController';
import { tableController } from 'hookstate/tableController';
import _, { isEqual } from 'lodash';

export const gridViewStates = hookstate({});

export const useGridViewStates = () => useHookstate(gridViewStates);

const gridViewStatesControllerHandler = state => ({
	initialize: (tableKey, allGridViews) => {
		state.merge({
			tableKey,
			allGridViews,
		});
	},

	gridViewApply: selectedGridView => {
		// debugger;
		if (!!!selectedGridView) return;

		const TableKey = state.tableKey?.get({ noproxy: true });
		const Controller = tableController(TableKey);

		const TableSchema = Controller.getValue('defaultTableSchema');
		const columnPinning = Controller.getValue('defaultColumnPinning');

		const columns = TableSchema?.map(element => element.accessorKey || element.id);

		const updatedGridViewOrdering = columns?.filter(column => selectedGridView.columnOrdering?.includes(column));
		const updatedGridViewLeftPinning = columns?.filter(column =>
			selectedGridView.columnPinning?.left?.includes(column)
		);
		const updatedGridViewRightPinning = columns?.filter(column =>
			selectedGridView.columnPinning?.right?.includes(column)
		);
		const updatedGridViewPinning = { left: updatedGridViewLeftPinning };
		if (selectedGridView.columnPinning?.right?.length > 0) {
			updatedGridViewPinning.right = updatedGridViewRightPinning;
		}

		const updatedGridFilters = selectedGridView.filters?.filter(filter => columns.includes(filter.field)) || [];
		const updatedGridSorting = selectedGridView.sorting?.filter(sort => columns.includes(sort.id)) || [];

		const updatedGridColumns = columns?.map(column => {
			const existingColumn = selectedGridView.columns?.find(col => col.name === column);
			return existingColumn || { name: column, display: false };
		});

		const updatedGridView = {
			...selectedGridView,
			columns: updatedGridColumns,
			columnOrdering: updatedGridViewOrdering,
			columnPinning: updatedGridViewPinning,
			filters: updatedGridFilters,
			sorting: updatedGridSorting,
		};

		let viewToApply = selectedGridView;

		// Only apply if the updated grid view is different
		if (!isEqual(selectedGridView, updatedGridView) && selectedGridView.type !== 'Default') {
			viewToApply = updatedGridView;
		}

		Controller.updateState({
			gridView: {
				selectedGridView: viewToApply,
				showViewModal: false,
				showSaveAsNew: false,
			},
		});

		if (viewToApply?.columns) {
			const columnstoShow = viewToApply?.columns.reduce((acc, obj) => {
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
		if (viewToApply?.filters?.length) {
			Controller.setShowColumnFilters(true);
			Controller.clearFilters();
			Controller.setFilters(viewToApply.filters);
		} else {
			Controller.setShowColumnFilters(false);
			Controller.clearFilters();
		}
		if (viewToApply?.sorting) {
			Controller.setSorting(viewToApply?.sorting);
		} else {
			Controller.setSorting([]);
		}
		if (viewToApply?.columnPinning) {
			let filterLeftPinning = viewToApply?.columnPinning?.left?.map(element =>
				element === 'mrt-row-select' ? 'over-ride-checkbox' : element
			);
			if (!filterLeftPinning.includes('mrt-row-numbers')) {
				filterLeftPinning.splice(1, 0, 'mrt-row-numbers');
			}
			const newColumnPinning = {
				...viewToApply.columnPinning,
				left: filterLeftPinning,
			};
			Controller.setColumnPinning(newColumnPinning, columnPinning, TableSchema);
		} else {
			Controller.setColumnPinning(columnPinning, columnPinning, TableSchema);
		}
		if (viewToApply?.columnOrdering) {
			let newColumnOrder = viewToApply?.columnOrdering?.map(element =>
				element === 'mrt-row-select' ? 'over-ride-checkbox' : element
			);
			if (!newColumnOrder.includes('mrt-row-numbers')) {
				newColumnOrder.splice(1, 0, 'mrt-row-numbers');
			}
			Controller.setColumnOrdering(newColumnOrder);
		} else {
			const columnOrder = TableSchema.map(column => column.accessorKey || column.id);
			const defaultColumnOrder = _.concat(['over-ride-checkbox', 'mrt-row-numbers'], _.slice(columnOrder, 1));
			Controller.setColumnOrdering(defaultColumnOrder);
		}
	},
});

export const gridViewStateController = TableKey => {
	return {
		...gridViewStatesControllerHandler(gridViewStates[TableKey]),
		...hookStateController(gridViewStates[TableKey], {}),
	};
};
