/* eslint-disable react/prop-types */
import React from 'react';

import _, { get } from 'lodash';

import DataType from 'components/Common/DataType';
import ESAutoCompleteFilter from 'components/MRTTable/Common/ESAutoCompleteFilter';
import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';
import {
	customFilterOptions,
	dateFilterOptions,
	numberFilterOptions,
	simpleDateFilterOptions,
	simpleNumberFilterOptions,
	simpleStringFilterOptions,
	stringFilterOptions,
} from 'components/MRTTable/utils/data';
import filterModeMenu from 'components/MRTTable/utils/filterModeMenu';
import { formatDate } from 'components/Shared/functions';
import { customLayersFieldAccessors } from 'components/Shared/SidePanel/compoennts/Filters/consts';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';

import { tableController } from 'controllers/tableController';

import { SMALL_TIMEOUT } from 'utils/consts';

export const handleVisiblityMenu = () => {
	const interval2 = setInterval(() => {
		const elements = document.querySelectorAll('ul[role="menu"] .MuiFormControlLabel-label');
		// || element?.className.includes('Mui-disabled')
		if (elements) {
			elements.forEach(element => {
				if (['Select', 'Row Numbers'].includes(element.outerText) || element.outerText === '') {
					while (element !== null) {
						if (element.tagName === 'LI') {
							element.style.display = 'none';
							break;
						}
						element = element.parentNode;
					}
				}
			});
			clearInterval(interval2);
		}
	}, 0);
};

export const handleVisiblityMenuClick = () => {
	const interval = setInterval(() => {
		const elements = document.querySelectorAll('[aria-label="Show/Hide columns"]');
		if (elements.length) {
			elements.forEach(element => {
				element.addEventListener('click', () => {
					handleVisiblityMenu();
				});
				clearInterval(interval);
			});
		}
	}, 1000);
};

export const handleColumnMenuClick = () => {
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
	}, SMALL_TIMEOUT);
};

export const handleMRTSchema = ({
	_Schema,
	tableKey,
	esIndex,
	modelName,
	defaultFlterMode,
	search,
	globalFilter,
	layerDataSourceName,
	isClientSide,
	excludeFields,
}) => {
	_Schema = _.uniqBy(_Schema, item => item.accessorKey || item.id);

	if (excludeFields) {
		_Schema = _Schema.filter(item => !excludeFields.includes(item.accessorKey || item.id));
	}

	// Syncing map views with generic grids
	const selectedMapView = viewStateController('MapView').getValue('selectedView');
	const selectedMapViewFilters = selectedMapView?.filters || [];

	const dataSourceViews = selectedMapViewFilters?.filter(view => layerDataSourceName === view.dataSourceName);
	const mapViewFilters =
		dataSourceViews?.map(view => getFormattedFilterBasedOnType(view.filterType, view.fieldName, view.filterValues)) ||
		[];
	const _TableSchema = _Schema.map(schemaColumn => {
		if (!schemaColumn.accessorFn) {
			let defaultValue = null;

			switch (schemaColumn.type) {
				case 'string':
				case 'number':
				case 'mongoID':
				case 'boolean':
				case 'date':
					defaultValue = '';
					break;

				case 'array':
					defaultValue = [];
					break;

				default:
					break;
			}

			schemaColumn.accessorFn = row => {
				let value = get(row, schemaColumn.id) ?? defaultValue;

				if (isClientSide) {
					switch (schemaColumn.type) {
						case 'date':
							value = formatDate(value);
							break;

						default:
							break;
					}
				}
				return value;
			};
		}

		if (schemaColumn.header && !schemaColumn.showInLast) {
			const HeaderComp = () => {
				const { header, type } = schemaColumn;
				const {
					stateValues: { showTypes },
				} = tableController(tableKey).useState(['showTypes']);
				return <DataType title={header} type={type || 'unknown'} showType={showTypes} />;
			};

			schemaColumn.Header = HeaderComp;
		}

		if (isClientSide) {
			if (schemaColumn.filter) {
				let options;
				if (schemaColumn.type === 'string') {
					options = simpleStringFilterOptions;
				} else if (schemaColumn.type === 'number') {
					options = simpleNumberFilterOptions;
				} else if (schemaColumn.type === 'date') {
					options = simpleDateFilterOptions;
				}
				if (schemaColumn.isComposite) {
					options = options.filter(option => option !== 'multiselect');
				}

				schemaColumn.columnFilterModeOptions = options;
				schemaColumn.renderColumnFilterModeMenuItems = filterModeMenu({
					options,
					tableKey,
					name: schemaColumn.accessorKey || schemaColumn.id,
					schemaColumn,
					controller: tableController,
					layerDataSourceName,
				});
			}

			const updatedFilterModes = tableController(tableKey).setInitialFilterMode(
				schemaColumn,
				schemaColumn.type === 'number' ? 'equals' : 'singleselect',
				schemaColumn.id
			);

			return { ...schemaColumn, ...updatedFilterModes };
		}

		if (schemaColumn.filter && !schemaColumn.Filter) {
			schemaColumn.SingleSelect = function Comp({ column, isCustom, _value, textFieldProps }) {
				return (
					<div>
						<ESAutoCompleteFilter
							tableKey={tableKey}
							esIndex={esIndex}
							modelName={modelName}
							column={{
								field: column.columnDef.name,
								isComposite: column.columnDef.isComposite,
								label: column.columnDef.header,
								type: column.columnDef.type,
								subType: column.columnDef.subType,
								defaultFilterOptions: column.columnDef.defaultFilterOptions,
								setFilterValue: column.setFilterValue,
								filterSelectOptions: column.columnDef.filterSelectOptions,
								filterValue: column?.getFilterValue() ?? '',
							}}
							extendSearchQuery={globalFilter}
							multiple={false}
							_value={_value}
							textFieldProps={textFieldProps}
						/>
						{!isCustom && (
							<span style={{ fontSize: '0.7rem', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 400 }}>
								Filter Mode: Single Select
							</span>
						)}
					</div>
				);
			};

			schemaColumn.MultiSelect = function Comp({ column }) {
				const getValue = () => {
					const selectedValues = column?.getFilterValue() || [];
					const selectedLabels = column.columnDef.filterSelectOptions
						.filter(option => selectedValues.includes(option.value))
						.map(option => option.label);
					return selectedLabels;
				};
				return (
					<div>
						<ESAutoCompleteFilter
							tableKey={tableKey}
							esIndex={esIndex}
							modelName={modelName}
							column={{
								field: column.columnDef.name,
								label: column.columnDef.header,
								type: column.columnDef.type,
								subType: column.columnDef.subType,
								defaultFilterOptions: column.columnDef.defaultFilterOptions,
								setFilterValue: column.setFilterValue,
								filterSelectOptions: column.columnDef.filterSelectOptions,
								filterValue: column.columnDef.filterSelectOptions ? getValue() : column?.getFilterValue() || [],
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
			switch (schemaColumn.type) {
				case 'string':
					options = stringFilterOptions;
					break;

				case 'number':
					options = numberFilterOptions;
					break;

				case 'date':
					options = dateFilterOptions;
					break;

				default:
					options = customFilterOptions;
					break;
			}

			if (schemaColumn.isComposite) {
				options = options.filter(option => option !== 'multiselect');
			}

			schemaColumn.columnFilterModeOptions = options;
			schemaColumn.renderColumnFilterModeMenuItems = filterModeMenu({
				options,
				tableKey,
				name: schemaColumn.accessorKey || schemaColumn.id,
				schemaColumn,
				controller: tableController,
				layerDataSourceName,
			});
		}

		// setting filtermodes based on map views
		const columnMapView = mapViewFilters.find(
			filter => filter?.field?.replace('.keyword', '') === schemaColumn?.name?.replace('.keyword', '')
		);
		if (!columnMapView || customLayersFieldAccessors[layerDataSourceName]) {
			return schemaColumn;
		}

		const updatedFilterModes = tableController(tableKey).setInitialFilterMode(
			schemaColumn,
			columnMapView.searchType,
			columnMapView.field?.replace('.keyword', '')
		);

		return { ...schemaColumn, ...updatedFilterModes };
	});

	const searchFields = search
		? search?.fields
		: _TableSchema
				.filter(column => column.isSearchField !== false)
				.map(column => column.name || column.id || column.accessorKey);

	const ExternalFilter = _TableSchema.filter(column => column.isExternalFilter === true).map(column => column.name);

	const pinnedColumns = _TableSchema.filter(column => column.isPinned);
	const pinnedFields = pinnedColumns.map(column => {
		column.enableResizing = false;
		column.enableColumnDragging = false;
		column.enableColumnOrdering = false;
		return column.id || column.accessorKey;
	});

	const columnOrder = _TableSchema.map(column => {
		let col = column.accessorKey || column.id;
		if (Array.isArray(col)) {
			col = col[0];
		}
		return col;
	});

	const tableCss = {
		'& .MuiDialog-root': {
			zIndex: '99999',
		},
		'& .Mui-ToolbarDropZone': {
			backgroundColor: '#F2F2F2',
			borderBottom: '1px solid rgba(224, 224, 224, 1)',
		},
		'& th.MuiToolbar-root, .MuiTableRow-head, th.MuiTableCell-head,th.MuiTableCell-head::before': {
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
		// Add hover effect for cells
		'& td:hover': {
			border: '3px solid rgb(23, 170, 221)', // Add blue border on hover
		},
	};
	handleVisiblityMenuClick();
	handleColumnMenuClick();

	const groupedField =
		_TableSchema.find(column => column.isGrouped)?.accessorKey || _TableSchema.find(column => column.isGrouped)?.id;

	const columnVisibility = _TableSchema.reduce(
		(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }),
		{}
	);
	const filterModes = _TableSchema
		.filter(column => column.filter)
		.reduce((acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: 'custom' }), {});

	if (!isClientSide) {
		columnVisibility['mrt-row-select'] = false;
	}

	return {
		_TableSchema,
		tableCss,
		searchFields,
		groupedField,
		ExternalFilter,
		columnVisibility,
		filterModes,
		columnOrder,
		pinnedFields,
	};
};

export const getLayerKey = (identifier, array) => {
	// Find the key in LayerMeta that matches the prefix of the identifier
	const key = Object.keys(array).find(metaKey => identifier?.startsWith(metaKey));

	// Return the corresponding value or undefined if no match is found
	return key ? key : undefined;
};

export const getWellColor = w => {
	// Check if the well status is of Permit type
	const isWellPermitStatus = ['PERMIT', 'PERMIT - NEW DRILL', 'PERMIT - EXISTING WELL'].includes(
		w?.properties?.wellStatus
	);

	// Switch on whether wellStatus or wellType
	const switchType = isWellPermitStatus ? w.properties.wellStatus : w.properties.wellType;
	switch (switchType) {
		// rgb(2, 207, 53)
		case 'OIL':
		case 'OIL AND GAS':
			return [2, 207, 53]; // green

		// rgb(230, 15, 15)
		case 'GAS':
			return [230, 15, 15]; // red

		// rgb(74, 211, 242)
		case 'WATER':
			return [74, 211, 242]; // blue

		// rgb(251, 152, 40)
		case 'PERMIT':
		case 'PERMIT - NEW DRILL':
		case 'PERMIT - EXISTING WELL':
			return [251, 152, 40]; // orange

		// rgba(30, 26, 26, 0.55)
		case 'PERMITTED':
			return [251, 152, 40]; // orange

		// rgb(192, 0, 0)
		default:
			return [58, 58, 58]; // default dark for permitted
	}
};

export const generateDataFunc = () => {
	async function* getData(initalData) {
		let data = initalData;
		let pausePromise;
		// Expose a function to externally pause the generator

		while (true) {
			if (pausePromise) {
				// Pause until the external promise is resolved
				// eslint-disable-next-line no-await-in-loop
				await pausePromise;
			}
			if (data) {
				let dataToReturn = data;
				data = null;
				yield dataToReturn;
			} else {
				// No new data, pause until the external promise is resolved

				pausePromise = new Promise(resolve => {
					// Expose a function to externally pause the generator
					getData.feedData = d => {
						data = d;
						pausePromise = null; // Reset the promise after resolving
						resolve();
					};
				});
				// eslint-disable-next-line no-await-in-loop
				await pausePromise;
			}
		}
	}

	return getData;
};
