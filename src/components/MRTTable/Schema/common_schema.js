/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { Autocomplete, Box, createFilterOptions, TextField } from '@mui/material';

import { useQuery } from '@apollo/client';
import { get, set } from 'lodash';
import moment from 'moment';

import { addTrailingZeros, formatDate } from 'components/Shared/functions';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { tableController } from 'stateManagement/tableController';

import { CURRENCY_TO_FIXED, INTEREST_TO_FIXED, TO_FIXED } from 'utils/consts';

import NavigationFlagField from '../Common/TableCells/NavigationFlagField';

const ACTION_COLUMN = {
	header: ' ',
	isPinned: false,
	hidden: false,
	filter: false,
	isSearchField: false,
	enableSorting: false,
	enableColumnActions: false,
	enableHiding: false,
	type: 'string',
	enableColumnFilter: false,
	isExport: false,
	enableColumnOrdering: false,
	enableColumnDragging: false,
	enableResizing: false,
	showInLast: true,
};

export const CommonSchema = {
	ACTION_COLUMN,
	COMMENTS: {
		...ACTION_COLUMN,
		name: 'comments',
		id: 'comments',
		size: 120,
	},
	TAGS: {
		...ACTION_COLUMN,
		name: 'tags',
		id: 'tags',
		header: 'Tags',
		size: 250,
		isExport: 'tags',
		handleArrayExport: {
			esType: 'collection',
			actualKey: 'tag',
		},
	},
	IS_TRACKED: {
		...ACTION_COLUMN,
		name: 'isTracked',
		id: 'isTracked',
		size: 120,
	},
	HIDDEN: {
		header: ' ',
		isAlwaysHidden: true,
		isSearchField: false,
		hidden: true,
		enableColumnPinning: false,
		enableHiding: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableColumnDragging: false,
		enableSorting: false,
	},
	MONGO_ID: {
		header: 'M1neral System ID',
		isSearchField: false,
		hidden: true,
		enableColumnFilter: false,
		enableColumnPinning: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableColumnDragging: false,
		enableSorting: false,
		size: 250,
		isHiddenFieldExport: true,
		type: 'mongoID',
	},
	INITAIL_PINNED: {
		isPinned: true,
		enableHiding: false,
		filter: true,
		type: 'string',
		isExternalFilter: false,
		enableColumnActions: true,
		enableColumnOrdering: false,
		enableColumnDragging: false,
		size: 350,
	},
	STRING_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
	},
	SELECT_SOME: {
		name: 'over-ride-checkbox',
		id: 'over-ride-checkbox',
		isPinned: true,
		hidden: false,
		isSearchField: false,
		enableHiding: false,
		enableSorting: false,
		filter: false,
		isExternalFilter: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableColumnDragging: false,
		enableColumnFilter: false,
		isExport: false,
		enableResizing: false,
		size: 80,
	},
	USER: {
		name: 'user.name',
		id: 'user.name',
		header: 'User',
		size: 250,
		filter: true,
		type: 'string',
	},
	CREATED_BY: {
		name: 'createBy.name',
		id: 'createBy.name',
		header: 'Created By',
		size: 250,
		filter: true,
		isSearchField: false,
		type: 'string',
	},
	CREATED_DATE: {
		name: 'createAt',
		id: 'createAt',
		header: 'Created Date',
		size: 250,
		filter: true,
		isSearchField: false,
		type: 'date',
		Cell: ({ row }) => {
			return <>{formatDate(row.original?.createAt)}</>;
		},
	},
	LAST_UPDATED_BY: {
		name: 'lastUpdateBy.name',
		id: 'lastUpdateBy.name',
		header: 'Last Updated By',
		size: 250,
		filter: true,
		isSearchField: false,
		type: 'string',
	},
	LAST_UPDATED_DATE: {
		name: 'lastUpdateAt',
		id: 'lastUpdateAt',
		header: 'Last Updated Date',
		size: 250,
		filter: true,
		isSearchField: false,
		type: 'date',
		Cell: ({ row }) => {
			return <>{formatDate(row.original?.lastUpdateAt)}</>;
		},
	},
	AGGREGATED_FIELD: (name, aggregationFn = 'sum', sx = {}) => ({
		aggregationFn,
		AggregatedCell: ({ cell, table }) => (
			<>
				{name ? `${name} by ${table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:` : ''}
				<Box
					sx={{
						color: 'info.main',
						display: 'inline',
						fontWeight: 'bold',
						paddingLeft: '0.3rem',
						...sx,
					}}
				>
					{parseFloat(cell.getValue().toFixed(INTEREST_TO_FIXED))}
				</Box>
			</>
		),
	}),
	AGGREGATED_FOOTER: (field, tableKey) => ({
		Aggregation: {
			[`sum_${field}`]: {
				sum: { field },
			},
		},
		Footer: () => {
			const Controller = tableController(tableKey);
			const footerProps = Controller.getValue('footerProps') || {};

			const mongoKey = `sum_${field}`.replace(/\./g, '_');
			const value = get(footerProps, `${mongoKey}[0].${mongoKey}`);
			return (
				<div
					style={{
						fontWeight: 'bolder',
						fontSize: '0.875rem',
						color: 'rgba(0, 0, 0, 0.87)',
					}}
				>
					{value ? addTrailingZeros(parseFloat(value).toFixed(INTEREST_TO_FIXED)) : 0}
				</div>
			);
		},
	}),
	INTEREST_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: false,
		enableSorting: true,
		type: 'number',
		Cell: ({ row, column }) => {
			const value = row.getValue(column.id);

			if (!value && value !== 0) {
				return null;
			}

			return <>{!value ? value : addTrailingZeros(parseFloat(value).toFixed(INTEREST_TO_FIXED))}</>;
		},
	},
	CURRENCY_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: false,
		enableSorting: true,
		type: 'number',
		subType: 'price',
		Cell: ({ row, column }) => {
			const value = row.getValue(column.id);

			if (!value && value !== 0) {
				return null;
			}

			return <>{vf_currency_to_fixed(value, CURRENCY_TO_FIXED)}</>;
		},
	},
	SELECT_STRING_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
		filterVariant: 'autocomplete',
		muiFilterAutocompleteProps: {
			getOptionLabel: option => {
				return option.label || '';
			},
		},
	},

	SELECT_DATE_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'date',
		filterVariant: 'autocomplete',
	},

	NUMBER_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'number',
		filterVariant: 'equals',
		Cell: ({ row, column }) => {
			const value = row.getValue(column.id);

			if (!value && value !== 0) {
				return null;
			}

			return <>{vf_number(value, TO_FIXED)}</>;
		},
	},
	CUMULATIVE_FOOTER: (field, tableKey, toFixed = INTEREST_TO_FIXED) => ({
		Footer: () => {
			const Controller = tableController(tableKey);
			const footerProps = Controller.getValue('footerProps') || {};

			const value = get(footerProps, field);

			return <div>{value ? addTrailingZeros(parseFloat(value).toFixed(toFixed)) : 0}</div>;
		},
	}),
	NAVIGATION_CHECK_COLUMN: featureName => {
		const column = {
			isPinned: false,
			hidden: false,
			filter: false,
			isSearchField: false,
			enableSorting: false,
			enableColumnActions: false,
			enableHiding: false,
			type: 'string',
			enableColumnFilter: false,
			enableColumnOrdering: true,
			enableResizing: true,
			Cell: ({ row }) => {
				return <NavigationFlagField featureName={featureName} row={row?.original} />;
			},
		};
		return column;
	},
};

export const validateRequiredString = value => (!value?.length ? 'Required' : undefined);

export const editFieldProps =
	({ tableKey, type, validate, isSelect = false, required = true, onChange, onKeyDown, ...rest }) =>
	({ cell, row, table }) => {
		const Controller = tableController(tableKey);

		const {
			stateValues: { validationErrors, editedData },
		} = Controller.useState(['validationErrors', 'editedData']);

		const errorText = validationErrors?.[row.id]?.[cell.column.id];

		const [value, setValue] = useState(cell.getValue());

		const onBlur = event => {
			const target = isSelect ? event.target : event.currentTarget;

			const validationError = validate?.(target.value);

			const rowData = editedData[row.id] || {};

			set(rowData, cell.column.id, target.value);

			Controller.setValidationErrors(row.id, cell.column.id, validationError);

			if (onChange) {
				onChange(target.value, cell.column.id, rowData, row.id);
			} else {
				Controller.setEditedData(row.id, rowData);
			}
		};

		return {
			type,
			required,

			select: isSelect,

			...(type === 'date' && { value: moment(value).format('yyyy-MM-DD') }),

			error: !!errorText,
			helperText: errorText,
			//store edited user in state to be saved later
			onChange: e => {
				const target = isSelect ? e.target : e.currentTarget;

				setValue(target.value);

				if (type === 'date' || isSelect) {
					onBlur(e);
				}
			},
			onFocus: e => {
				document.querySelectorAll('td.hovered').forEach(td => {
					td.classList.remove('hovered');
				});
				e.target.closest?.('td')?.classList?.add('hovered');
			},
			onBlur: e => {
				e.target.closest?.('td')?.classList?.remove('hovered');
				e.nativeEvent?.target?.closest?.('td')?.classList?.remove('hovered');
				onBlur(e);
			},
			...(onKeyDown && {
				onKeyDown: e => onKeyDown(e, table, value, cell.column.id, editedData[row.id], row.id),
			}),
			...rest,
		};
	};

const getFilterVariables = (field, index, type) => ({
	index,
	filters: [],
	filterKey: field,
	search: {
		fields: [],
		advanceSearch: [],
	},
	size: 1,
	filterAggs: {
		query: '',
		field,
		size: 10000,
		fieldType: 'string',
		type,
	},
});

export const editAutoCompleteField =
	({ tableKey, validate, placeholder = '', required = true, id, index, type, onChange }) =>
	// eslint-disable-next-line react/display-name
	({ cell, row, column }) => {
		const { data: optionsData } = useQuery(GET_DB_FILTERS, {
			variables: getFilterVariables(id, index, type),
			fetchPolicy: 'no-cache',
		});

		const options = optionsData?.getDbFilters?.hits?.map(hit => hit.key) || [];
		const Controller = tableController(tableKey);
		const filter = createFilterOptions();
		const initialValue = cell.getValue() || '';
		const [inputValue, setInputValue] = useState(initialValue);
		const validationErrors = Controller.getValue('validationErrors');
		const errorText = validationErrors?.[row.id]?.[column.id];

		const handleInputChange = (e, newVal) => {
			setInputValue(newVal);
		};

		const handleChange = (e, newValue) => {
			let finalValue = '';

			if (typeof newValue === 'string') {
				finalValue = newValue;
			} else if (newValue?.inputValue) {
				finalValue = newValue.inputValue;
			} else if (newValue) {
				finalValue = newValue;
			} else {
				finalValue = '';
			}

			setInputValue(finalValue);

			const originals = optionsData?.getDbFilters?.hits?.map(hit => hit.original?.[0]);

			onChange?.(finalValue, row, originals);
		};

		const handleBlur = () => {
			const finalValue = inputValue || '';
			const validationError = validate?.(finalValue);

			const editedData = Controller.getValue('editedData');
			const rowData = editedData?.[row.id] || {};

			set(rowData, column.id, finalValue);

			if (cell.setValue) {
				cell.setValue(finalValue);
			} else {
				row._valuesCache[column.id] = finalValue;
			}

			Controller.setValidationErrors(row.id, column.id, validationError);
			Controller.setEditedData(row.id, rowData);
		};

		return (
			<Autocomplete
				freeSolo
				options={options}
				value={inputValue}
				onChange={handleChange}
				onInputChange={handleInputChange}
				onFocus={e => {
					document.querySelectorAll('td.hovered').forEach(td => {
						td.classList.remove('hovered');
					});
					e.target.closest?.('td')?.classList?.add('hovered');
				}}
				onBlur={e => {
					e.target.closest?.('td')?.classList?.remove('hovered');
					e.nativeEvent?.target?.closest?.('td')?.classList?.remove('hovered');
				}}
				filterOptions={(opts, params) => {
					const filtered = filter(opts, params);
					const inputVal = params.inputValue;
					const isExisting = opts.some(option => option === inputVal);

					if (inputVal !== '' && !isExisting) {
						filtered.push({ inputValue: inputVal, label: `Add "${inputVal}"` });
					}
					return filtered;
				}}
				getOptionLabel={option => (typeof option === 'string' ? option : (option?.inputValue ?? option?.label ?? ''))}
				renderOption={(props, option) => <li {...props}>{typeof option === 'string' ? option : option.label}</li>}
				sx={{ width: '100%' }}
				renderInput={params => (
					<TextField
						{...params}
						required={required}
						size="small"
						onBlur={handleBlur}
						error={!!errorText}
						helperText={errorText}
						placeholder={placeholder}
						variant="standard"
						InputProps={{
							...params.InputProps,
							disableUnderline: true,
						}}
						sx={{
							'& .MuiInputBase-root': {
								border: 'none !important',
								boxShadow: 'none !important',
								backgroundColor: 'transparent',
								px: 0,
							},
							'& .MuiInputBase-input': {
								px: 1,
							},
							'& fieldset': {
								display: 'none',
							},
							width: '100%',
							p: 0,
						}}
					/>
				)}
			/>
		);
	};
