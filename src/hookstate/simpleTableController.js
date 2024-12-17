import { hookstate } from '@hookstate/core';
import { isEqual } from 'lodash';
import { hookStateController } from 'hookstate/hookStateController';
import {
	simpleDateFilterOptions,
	simpleNumberFilterOptions,
	simpleStringFilterOptions,
} from 'components/MRTTable/utils/data';
import { simpleTableState } from './initialStates';
import filterModeMenu from 'components/MRTTable/utils/filterModeMenu';

const handleVisiblityMenu = () => {
	const interval2 = setInterval(() => {
		const elements = document.querySelectorAll('ul[role="menu"] .MuiFormControlLabel-label');
		// || element?.className.includes('Mui-disabled')
		if (elements) {
			elements.forEach(element => {
				if (['Select', 'Row Numbers'].includes(element.outerText) || element.outerText === '')
					while (element !== null) {
						if (element.tagName === 'LI') {
							element.style.display = 'none';
							break;
						}
						element = element.parentNode;
					}
			});
			clearInterval(interval2);
		}
	}, 0);
};

const handleVisiblityMenuClick = () => {
	const interval = setInterval(() => {
		const element = document.querySelector('[aria-label="Show/Hide columns"]');
		if (element) {
			element.addEventListener('click', () => {
				handleVisiblityMenu();
			});
			clearInterval(interval);
		}
	}, 1000);
};

const handleColumnMenuClick = () => {
	setInterval(() => {
		const elements = document.querySelectorAll('[aria-label="Column Actions"]');
		if (elements) {
			elements.forEach(element => {
				const clickListner = () => {
					const interval2 = setInterval(() => {
						const ulElement = document.querySelector('.MuiPaper-elevation1 ul[role="menu"]'); // Replace "your-ul-id" with the actual ID of your <ul> element
						if (ulElement) {
							const liElements = ulElement.getElementsByTagName('li');
							for (let i = 0; i < liElements.length; i++) {
								const li = liElements[i];
								const divElement = li.querySelector('div');
								if (
									divElement &&
									(divElement.textContent.includes('Pin to right') ||
										divElement.textContent.includes('Show all columns'))
								) {
									li.style.display = 'none';
									// break;
								}
							}
							clearInterval(interval2);
						}
					}, 0);
				};
				element.removeEventListener('click', clickListner);
				element.addEventListener('click', clickListner);
			});
		}
	}, 300);
};

const simpleTableStateControllerHandler = state => ({
	initialize: (
		tableKey,
		{
			pageSize,
			defaultSort,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema,
			defaultFlterMode,
			defaultFilters,
			isSelectAllAllowed,
			isAllRowsSelected,
			search,
			...rest
		}
	) => {
		if (state.TableSchema.get()) return;
		const searchFields = search
			? search?.fields
			: TableSchema.filter(column => column.isSearchField !== false).map(column => column.id || column.accessorKey);

		const ExternalFilter = TableSchema.filter(column => column.isExternalFilter === true).map(column => column.name);

		const pinnedColumns = TableSchema.filter(column => column.isPinned);
		const pinnedFields = pinnedColumns.map(column => {
			column.enableResizing = false;
			column.enableColumnDragging = false;
			column.enableColumnOrdering = false;
			return column.id || column.accessorKey;
		});
		const tableCss = {
			'& .MuiDialog-root': {
				zIndex: '99999',
			},
			'& .MuiToolbar-root': {
				backgroundColor: '#F2F2F2',
				borderBottom: '1px solid rgba(224, 224, 224, 1)',
			},
			'& th.MuiToolbar-root, .MuiTableRow-head, th.MuiTableCell-head': {
				backgroundColor: '#F2F2F2',
			},
			'& .Mui-TableHeadCell-Content-Labels': {
				width: '100%',
			},
			'& .Mui-selected': {
				'&:hover': {
					'& td': {
						backgroundColor: '##cdd4de !important',
					},
				},
				'& td': {
					backgroundColor: '#e6ecf5 !important',
				},
			},
		};
		handleVisiblityMenuClick();
		handleColumnMenuClick();

		if (pinnedColumns.length > 0 && columnVirtualization) {
			let size = 120;
			pinnedColumns.forEach(column => {
				size += column.size;
			});
			tableCss['& .MuiTableRow-root>:nth-child(2)'] = {
				marginLeft: `-${size}px !important`,
			};
		}
		const groupedField =
			TableSchema.find(column => column.isGrouped)?.accessorKey || TableSchema.find(column => column.isGrouped)?.id;

		const columnVisibility = TableSchema.reduce(
			(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }),
			{}
		);
		const filterModes = TableSchema.filter(column => column.filter).reduce(
			(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: 'custom' }),
			{}
		);
		const _TableSchema = TableSchema.map(schemaColumn => {
			if (schemaColumn.filter) {
				let options;
				if (schemaColumn.type === 'string') {
					options = simpleStringFilterOptions;
				} else if (schemaColumn.type === 'number') {
					options = simpleNumberFilterOptions;
				} else if (schemaColumn.type === 'date') {
					options = simpleDateFilterOptions;
				}
				if (schemaColumn.isComposite) options = options.filter(option => option !== 'multiselect');

				schemaColumn.columnFilterModeOptions = options;
				schemaColumn.renderColumnFilterModeMenuItems = filterModeMenu({
					options,
					tableKey,
					name: schemaColumn.accessorKey || schemaColumn.id,
					controller: simpleTableController,
				});
			}

			return schemaColumn;
		});

		state.merge({
			...rest,
			initialized: true,
			tableKey,
			pageSize,
			isSelectAllAllowed: isSelectAllAllowed || false,
			isAllRowsSelected: isAllRowsSelected || false,
			showColumnFilters: false,
			data: { rows: [], total: 0 },
			isLoading: false,
			isFetching: false,
			isError: false,
			defaultFilters: state?.defaultFilters?.get({ noproxy: true }) || defaultFilters || [],
			customProps: state?.customProps?.get({ noproxy: true }) || rest.customProps || {},
			filters: [],
			sorting: [],
			searchFields,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema: _TableSchema,
			tableCss,
			groupedField,
			grouping: groupedField ? [groupedField] : [],
			footerProps: [],
			ExternalFilter,
			columnVisibility,
			defaultSort,
			filterModes,
			commentsCounter: [],
			tagsList: [],
			columnPinning: {
				left: [
					...(pinnedFields.length > 0
						? ['mrt-row-select', 'mrt-row-numbers', ...pinnedFields]
						: ['mrt-row-select', 'mrt-row-numbers']),
				],
			},
		});
	},

	setFilterMode: (column, mode) => {
		const index = state.TableSchema?.get({ noproxy: true })?.findIndex(
			element => element.accessorKey === column || element.id === column
		);
		const columnSchema = state.TableSchema?.[index]?.get({
			noproxy: true,
		});

		if (mode === 'singleselect') {
			state.TableSchema?.[index]?.merge({
				filterVariant: 'select',
			});
		} else if (mode === 'multiselect') {
			state.TableSchema?.[index]?.merge({
				filterVariant: 'text',
				// filterVariant: 'multi-select',
			});
		} else {
			state.TableSchema?.[index]?.merge({ filterVariant: 'text' });
		}

		state.filterModes?.merge({
			[column]: {
				mode,
				isKeyword: columnSchema.name.includes('.keyword'),
			},
		});
	},
	setIsAllRowsSelected: value => {
		if (!isEqual(value, state.isAllRowsSelected.get())) state.isAllRowsSelected.set(value);
	},

	updateCustomProps: customProps => {
		const currentState = state.customProps.get({ noproxy: true });
		const updatedState = {
			...currentState,
			...customProps,
		};

		if (!isEqual(currentState, updatedState)) state.customProps.set(updatedState);
	},
});

export const simpleTableController = TableKey => {
	if (!simpleTableState[TableKey]) simpleTableState[TableKey] = hookstate({});
	return {
		...simpleTableStateControllerHandler(simpleTableState[TableKey]),
		...hookStateController(simpleTableState[TableKey], {}),
	};
};
