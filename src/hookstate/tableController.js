import React from 'react';
import { hookstate } from '@hookstate/core';
import _, { get, isEqual, isEmpty } from 'lodash';
import ESAutoCompleteFilter from 'components/MRTTable/Common/ESAutoCompleteFilter';
import { copy, deepEqual } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';
import { stringFilterOptions, numberFilterOptions, dateFilterOptions } from 'components/MRTTable/utils/data';
import filterModeMenu from 'components/MRTTable/utils/filterModeMenu';
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { globalStateController } from 'hookstate/globalStateController';
import ReactSelectField from "components/MRTTable/Common/MetaData/ReactSelectField";
import CustomFieldText from "components/MRTTable/Common/MetaData/CustomFieldText";
import { metaDataColumnStateController } from 'components/MRTTable/Common/MetaData/MetaDataColumnsController'
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';
import { gridViewStateController } from 'components/MRTTable/Common/GridView/GridViewController'
import { formatGridViewToMRT } from "components/MRTTable/utils/helper"
import TableHeaderMoreOptions from 'components/MRTTable/Common/TableHeaderMoreOptions';
import MRT_SelectCheckbox_OverRide from 'components/MRTTable/Common/MRT_SelectCheckbox_OverRide';

const initialState = {
	defaultFilters: [],
	customProps: [],
	filters: [],
	sorting: [],
	searchFields: [],
	groupedField: {},
	grouping: [],
	footerProps: [],
	ExternalFilter: [],
	defaultSort: {},
	columnOrdering: [],
	columnPinning: {
		left: [],
	},
}
export const tableESState = {};
export const tableGlobalState = hookstate({
	refetch: false,
	reInitialized: false,
});

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

async function fetchTableSchema(client, fetchMetaData, TableSchema, onCustomKeyChange, tableKey) {

	const _user = globalStateController.getValue('user')

	const result = await client.query({
		variables: {
			user: _user?._id,
			category: fetchMetaData?.category,
		},
		query: GET_META_DATA,
	});

	const data = result?.data?.getMetaData?.metaData

	const metaDataTableSchema = data.map((item, index) => {
		const key = item?.esKey.replaceAll('.keyword', '')

		return ({
			...item,
			...CommonSchema.COMMON_COLUMN,
			name: `${key}.keyword`,
			id: key,
			accessorFn: (row) => get(row, key),
			header: item?.label,
			isCustom: true,
			size: 350,
			inputType: item?.type,
			dbKey: item?.name,
			Cell: ({ row }) => {
				const value = _.get(row?.original, `custom_data.${item?.name}`)

				if (item?.type === "multiselect" || item?.type === "dropdown") {
					return (
						<div>
							<ReactSelectField
								tooltipView={true}
								isSingleSelect={item.type !== "multiselect"}
								dropdownOptions={item.dropdownOptions}
								index={index}
								column={item}
								value={value}
								id={item.label}
								tableKey={tableKey}
								onCustomKeyChange={(value) => onCustomKeyChange(client, row?.original, value, item)}
							/>
						</div>
					);
				}

				if (item?.type === "text") {
					return (
						<CustomFieldText
							value={value}
							onCustomKeyChange={(value) => { onCustomKeyChange(client, row?.original, value, item) }}
						/>
					)
				}

				return <>{value}</>
			},
		})
	});

	metaDataColumnStateController(tableKey)?.initialize(tableKey, metaDataTableSchema);

	const lastColumns = TableSchema.filter(obj => obj.showInLast === true)
	const defaultColumns = TableSchema.filter(obj => obj.showInLast !== true)
	const newTableSchema = [...defaultColumns, ...metaDataTableSchema, ...lastColumns]
	return newTableSchema
}

async function fetchGridViews(client, module, tableKey) {
	const user = globalStateController.getValue('user')
	const result = await client.query({
		variables: {
			module,
			userId: user._id,
		},
		query: GET_GRID_VIEWS,
	});
	const allGridViews = result?.data?.getGridViews?.gridViews
	const gridViewController = gridViewStateController(tableKey)
	gridViewController?.initialize(tableKey, allGridViews);

	const defaultDisplay = allGridViews?.find(obj => obj.defaultDisplayBy?.includes(user?._id));
	return defaultDisplay
}


const tableESStateControllerHandler = state => ({
	initialize: async (
		tableKey,
		{
			esIndex,
			pageSize,
			defaultSort,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema,
			defaultFlterMode,
			defaultFilters,
			customProps = {},
			isSelectAllAllowed = true,
			isSelectall,
			search,
			fetchMetaData,
			onCustomKeyChange,
			gridViewSettings,
			density = 'comfortable',
			...rest
		},
		client,
	) => {
		if (state.TableSchema.get()) return;

		let _Schema = TableSchema;
		if (!rest.isGeneric)
			_Schema.unshift({
				...CommonSchema.SELECT_SOME,
				Header: () => <TableHeaderMoreOptions tableKey={tableKey} />,
				Cell: ({ row }) => {
					const tableState = tableController(tableKey).useState(['mrtTableRef']);
					const tableStateValues = tableState.stateValues;
					return <MRT_SelectCheckbox_OverRide row={row} selectAll={false} table={tableStateValues?.mrtTableRef} tableKey={tableKey} />
				},
			});

		if (fetchMetaData) {
			_Schema = await fetchTableSchema(client, fetchMetaData, TableSchema, onCustomKeyChange, tableKey)
		}

		let defaultDisplay = []
		let formatGridView = {}
		let gridView = {}

		if (gridViewSettings) {
			defaultDisplay = await fetchGridViews(client, gridViewSettings.module, tableKey)

			formatGridView = formatGridViewToMRT(defaultDisplay)
			gridView = {
				selectedGridView: !!defaultDisplay ? defaultDisplay : gridViewSettings.defaultView,
				showViewModal: false,
				showSaveAsNew: false,
			}
		}

		_Schema = _.uniqBy(_Schema, (item) => item.accessorKey || item.id);

		const _TableSchema = _Schema.map(schemaColumn => {
			if (schemaColumn.filter && !schemaColumn.Filter) {
				schemaColumn.SingleSelect = function Comp({ column }) {
					return (
						<div>
							<ESAutoCompleteFilter
								tableKey={tableKey}
								esIndex={esIndex}
								column={{
									field: column.columnDef.name,
									isComposite: column.columnDef.isComposite,
									label: column.columnDef.header,
									type: column.columnDef.type,
									setFilterValue: column.setFilterValue,
									filterSelectOptions: column.columnDef.filterSelectOptions,
									filterValue: column?.getFilterValue() || '',
								}}
								multiple={false}
							/>
							<span style={{ fontSize: '0.7rem', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 400 }}>
								Filter Mode: Single Select
							</span>
						</div>
					);
				};

				schemaColumn.MultiSelect = function Comp({ column }) {
					return (
						<div>
							<ESAutoCompleteFilter
								tableKey={tableKey}
								esIndex={esIndex}
								column={{
									field: column.columnDef.name,
									label: column.columnDef.header,
									type: column.columnDef.type,
									setFilterValue: column.setFilterValue,
									filterValue: column?.getFilterValue() || [],
								}}
								multiple
							/>
							<span style={{ fontSize: '0.7rem', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 400 }}>
								{' '}
								Filter Mode: Multi Select
							</span>
						</div>
					);
				};

				schemaColumn.Filter = defaultFlterMode === 'multiselect' ? schemaColumn.MultiSelect : schemaColumn.SingleSelect;
			}
			if (schemaColumn.filter) {
				let options;
				if (schemaColumn.type === 'string') {
					options = stringFilterOptions;
				} else if (schemaColumn.type === 'number') {
					options = numberFilterOptions;
				} else if (schemaColumn.type === 'date') {
					options = dateFilterOptions;
				}
				if (schemaColumn.isComposite)
					options = options.filter((option) => option !== 'multiselect')

				schemaColumn.columnFilterModeOptions = options;
				schemaColumn.renderColumnFilterModeMenuItems = filterModeMenu({
					options,
					tableKey,
					name: schemaColumn.accessorKey || schemaColumn.id,
				});
			}

			return schemaColumn;
		});

		const searchFields = search ? search?.fields : _TableSchema.filter(column => column.isSearchField !== false).map(
			column => column.id || column.accessorKey
		);

		const ExternalFilter = _TableSchema.filter(column => column.isExternalFilter === true).map(column => column.name);

		const pinnedColumns = _TableSchema.filter(column => column.isPinned);
		const pinnedFields = pinnedColumns.map(column => {
			column.enableResizing = false;
			column.enableColumnDragging = false;
			column.enableColumnOrdering = false;
			return column.id || column.accessorKey;
		});

		const columnOrder = _TableSchema.map(column => {
			let col = column.accessorKey || column.id
			if (Array.isArray(col)) col = col[0]
			return col
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
			let size = 60;
			pinnedColumns.forEach(column => {
				size += column.size;
			});
			tableCss['& .MuiTableRow-root>:nth-child(2)'] = {
				marginLeft: `-${size}px !important`,
			};
		}
		const groupedField =
			_TableSchema.find(column => column.isGrouped)?.accessorKey || _TableSchema.find(column => column.isGrouped)?.id;

		const columnVisibility = _TableSchema.reduce(
			(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }),
			{}
		);
		const filterModes = _TableSchema.filter(column => column.filter).reduce(
			(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: 'custom' }),
			{}
		);

		state.merge({
			...rest,
			initialized: true,
			tableKey,
			esIndex,
			fetchMetaData,
			gridViewSettings,
			gridView,
			pageSize,
			isSelectall: false,
			isSelectAllAllowed,
			showColumnFilters: formatGridView?.filters ? true : false,
			data: { rows: [], total: 0 },
			isLoading: false,
			isFetching: false,
			isError: false,
			defaultFilters: defaultFilters || state?.defaultFilters?.get({ noproxy: true }),
			customProps: isEmpty(state?.customProps?.get({ noproxy: true })) ? customProps : state?.customProps?.get({ noproxy: true }),
			filters: formatGridView?.filters ? formatGridView.filters : [],
			sorting: formatGridView?.sorting ? formatGridView.sorting : [],
			rowSelection: {},
			searchFields,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema: _TableSchema,
			tableCss,
			groupedField,
			grouping: groupedField ? [groupedField] : [],
			footerProps: [],
			ExternalFilter,
			columnVisibility: formatGridView?.columnVisibility ? formatGridView.columnVisibility : columnVisibility,
			defaultSort,
			filterModes,
			density,
			columnOrdering: formatGridView?.columnOrdering ? formatGridView.columnOrdering : ['over-ride-checkbox', 'mrt-row-numbers', ...columnOrder],
			columnPinning: formatGridView?.columnPinning ? formatGridView.columnPinning : {
				left: [
					...(pinnedFields.length > 0
						? _.concat(['over-ride-checkbox', 'mrt-row-numbers'], _.slice(pinnedFields, 1))
						: ['over-ride-checkbox', 'mrt-row-numbers']),
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
				Filter: columnSchema?.SingleSelect,
			});
		} else if (mode === 'multiselect') {
			state.TableSchema?.[index]?.merge({
				Filter: columnSchema?.MultiSelect,
			});
		} else if (columnSchema?.Filter) {
			state.TableSchema?.[index]?.merge({ Filter: null });
		}

		state.filterModes?.merge({
			[column]: {
				mode,
				isKeyword: columnSchema.name.includes('.keyword'),
			},
		});
	},
	setSelectAll: value => {
		state.isSelectall.set(value);
	},

	setColumnVisibility: visibility => {
		if (!deepEqual(state.columnVisibility?.get({ noproxy: true }), visibility)) state.columnVisibility?.set(visibility);
	},

	setColumnPinning: (columnPinning, oldPinning, TableSchema) => {
		if (!deepEqual(state.columnPinning?.get({ noproxy: true }), columnPinning)) {
			let size = 0;
			columnPinning.left.forEach(pin => {
				if (pin === 'mrt-row-numbers') {
					size += 60
				} else if (pin === 'mrt-row-select') {
					size += 0;
				} else {
					size += state.TableSchema.get({ noproxy: true }).find(
						column => column.id === pin || column.accessorKey === pin
					)?.size;
				}
			});
			const tableCss = {
				...state.tableCss?.get({ noproxy: true }),
				'& .MuiTableRow-root>:nth-child(2)': { marginLeft: `-${size}px !important` },
			};
			state.columnPinning?.set(columnPinning);

			let changeTableSchema = false;
			columnPinning.left.forEach(col => {
				if (oldPinning.left.find(l => l === col)) return;
				TableSchema.forEach(column => {
					if (column.id === col) {
						column.enableResizing = false;
						column.enableColumnDragging = false;
						column.enableColumnOrdering = false;
						column.enableHiding = false;
						changeTableSchema = true;
					}
				});
			});

			oldPinning.left.forEach(col => {
				if (columnPinning.left.find(l => l === col)) return;
				TableSchema.forEach(column => {
					if (column.id === col) {
						column.enableResizing = true;
						column.enableColumnDragging = true;
						column.enableColumnOrdering = true;
						column.enableHiding = true;
						changeTableSchema = true;
					}
				});
			});
			if (changeTableSchema) state.TableSchema.set(TableSchema);
			state.tableCss?.set(tableCss);
		}
		handleVisiblityMenu();
	},

	setColumnOrdering: order => {
		if (!deepEqual(state.columnOrdering?.get({ noproxy: true }), order)) state.columnOrdering?.set(order);
	},

	setColumnCheck: rowCheck => {
		if (!deepEqual(state.rowSelection?.get({ noproxy: true }), rowCheck)) state.rowSelection?.set(rowCheck);
	},

	setPagination: pagination =>
		!deepEqual(state.pagination?.get({ noproxy: true }), pagination) && state.pagination?.set(pagination),

	setGlobalFilter: globalFilter =>
		!deepEqual(state.globalFilter?.get({ noproxy: true }), globalFilter) && state.globalFilter?.set(globalFilter),

	setFilter: filter => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (
			deepEqual(
				filtersState.find(({ field }) => field === filter.field),
				filter
			)
		)
			return;

		state.filters?.set([...filtersState.filter(({ field }) => field !== filter.field), filter]);
	},

	getExternalFilter: () => {
		const filtersState = state.filters?.get({ noproxy: true });
		const requiredFields = state.ExternalFilter?.get({ noproxy: true });
		const esFilters = (filtersState || [])?.filter(filter => requiredFields.includes(filter.field));
		return esFilters;
	},

	clearFilter: field => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (!filtersState.find(filter => filter.field === field)) return;

		state.filters?.set(filtersState.filter(filter => filter.field !== field));
	},

	clearFilters: () => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (!filtersState?.length === 0) return;

		state.filters?.set([]);
	},

	syncFilters: filters => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (filtersState.length <= filters.length) return;

		const filterKeys = filters.map(filter => filter.id);

		const keysToClear = filtersState
			.filter(filter => !filterKeys.includes(filter.field.replace(/.keyword/, 'g', '')))
			.map(filter => filter.field);

		state.filters?.set(filtersState.filter(filter => !keysToClear.includes(filter.field)));
	},

	setIsAllRowsSelected: value => {
		if (!state.isSelectAllAllowed.get()) return;

		if (!isEqual(value, state.isAllRowsSelected.get()))
			state.isAllRowsSelected.set(value);
	},

	setShowColumnFilters: value => {
		if (!isEqual(value, state.showColumnFilters.get()))
			state.showColumnFilters.set(value);
	},

	setSorting: sorting => {
		state.sorting?.set(sorting);
	},

	setFilters: filters => {
		state.filters.set(filters)
	},

	setMrtTableRef: mrtTableRef => {
		!deepEqual(state.mrtTableRef?.get({ noproxy: true }), mrtTableRef) && state.mrtTableRef?.set(mrtTableRef)
	},

	getGenericState: rows => {
		const genericState = {};

		if (!state.isGeneric.get() || rows?.length === 0) return genericState;

		let keys = [];

		const orderKeys = ['_id', 'id', 'name', 'flatSyncAt', '_ts'];
		const excludedKeys = ['isDeleted', 'IsDeleted', 'sort'];

		rows.forEach(row => {
			keys = [
				...new Set([
					...keys,
					...Object.keys(row).filter(key => !excludedKeys.includes(key)),
				]),
			];
		});

		keys = keys.sort((a, b) => {
			const aIndex = orderKeys.indexOf(a);
			const bIndex = orderKeys.indexOf(b);

			// If both keys are in the orderKeys array, sort based on their order in orderKeys.
			if (aIndex !== -1 && bIndex !== -1) {
				return aIndex - bIndex;
			}

			// If only one key is in the orderKeys array, prioritize it.
			if (aIndex !== -1) {
				return -1;
			}

			if (bIndex !== -1) {
				return 1;
			}

			// If neither key is in the orderKeys array, maintain the original order.
			return 0;
		});

		const TableSchema = state.TableSchema.get({ noproxy: true });

		genericState.TableSchema = [
			...(TableSchema[0] ? [TableSchema[0]] : []),
			...keys.map(key => ({
				...CommonSchema.COMMON_COLUMN,
				isSearchField: false,
				name: key,
				accessorKey: key,
				header: key,
				Cell: ({ row }) => {
					let value = row.getValue(key);

					switch (typeof value) {
						case 'object':
							value = JSON.stringify(value);
							break;

						case 'string':
							break;

						default:
							break;
					}

					return <>{value}</>;
				},
			})),
		];

		return genericState;
	},

});

export const tableController = TableKey => {
	if (!tableESState[TableKey]) tableESState[TableKey] = hookstate(copy(initialState));
	return {
		...tableESStateControllerHandler(tableESState[TableKey]),
		...hookStateController(tableESState[TableKey], copy(initialState)),
	};
};

const tableGlobalControllerHandler = state => ({
	refetch: () => {
		state.refetch.set(!state.refetch.get({ noproxy: true }));
	},
	reInitialized: () => {
		state.reInitialized.set(!state.reInitialized.get({ noproxy: true }));
	}
});

export const tableGlobalController = {
	...tableGlobalControllerHandler(tableGlobalState),
	...hookStateController(tableGlobalState, {}),
};
