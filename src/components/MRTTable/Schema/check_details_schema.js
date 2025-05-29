/* eslint-disable react/prop-types */
import React from 'react';

import DeleteIcon from '@material-ui/icons/Delete';

import { get, set, merge, unset } from 'lodash';
import { createRow } from 'material-react-table';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import {
	CommonSchema,
	editAutoCompleteField,
	editFieldProps,
	validateRequiredString,
} from 'components/MRTTable/Schema/common_schema';
import { NumberFormatPrecision } from 'components/Shared/Forms/Formatting/DecimalFormat';
import { NumberFormatComma } from 'components/Shared/Forms/Formatting/NumberFormatComma';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/NumberFormatCustom';
import { copy, formatDate } from 'components/Shared/functions';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { UPDATE_CHECK_DETAIL, UPDATE_CHECK_DETAILS } from 'graphQL/useMutationUpdateCheckDetail';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController, tableGlobalController } from 'stateManagement/tableController';

import { TO_FIXED } from 'utils/consts';

import CheckDetailsToolbar from '../TablesOverride/CheckDetailsTable/CheckDetailsToolbar';

const esIndex = 'checkdetails_flat';

const handleSubmitRow = (table, row, Controller) => {
	const {
		options: { onCreatingRowSave },
		refs: { editInputRefs },
		setCreatingRow,
	} = table;

	Object.values(editInputRefs?.current)
		.filter(inputRef => row.id === inputRef?.name?.split('_')?.[0])
		?.forEach(input => {
			if (input.value !== undefined && Object.hasOwn(row?._valuesCache, input.name)) {
				// @ts-ignore
				row._valuesCache[input.name] = input.value;
			}
		});
	onCreatingRowSave?.({
		exitCreatingMode: () => {
			Controller.clearEditing();

			const { getDefaultValue } = Controller.getAllValues();

			const defaultValue = getDefaultValue?.() || {};

			setCreatingRow(createRow(table, defaultValue));

			Controller.updateState({ isCreateMode: true });
		},
		row,
		table,
		values: row._valuesCache,
	});
};

const CheckDetailsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(60vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: false,
	CustomToolBar: CheckDetailsToolbar,
	isDeleteDisabled: true,
	positionCreatingRow: 'bottom',
	createDisplayMode: 'row', // ('modal', and 'custom' are also available)
	editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
	enableEditing: true,
	enableRowActions: true,
	positionActionsColumn: 'last',
	getRowId: row => row?._id,
	onCreatingRowCancel: async ({ table }) => {
		tableController('CheckDetailsTable').clearEditing();
		table.setCreatingRow(null);
	},
	onCreatingRowSave: async ({ row, table, values, exitCreatingMode }) => {
		const client = globalStateController.getValue('client');

		const Controller = tableController('CheckDetailsTable');

		const obj = copy(row.original);

		Object.entries(values).forEach(([key, value]) => {
			set(obj, key, value);
		});

		const TableSchema = Controller.getValue('TableSchema');

		let hasErrors = false;

		TableSchema.filter(c => c.validate).forEach(({ id, validate }) => {
			const value = get(obj, id);

			const validationError = validate?.(value);

			if (validationError) {
				hasErrors = true;
			}

			Controller.setValidationErrors('mrt-row-create', id, validationError);
		});

		if (hasErrors) {
			return;
		}

		const customProps = tableController('CheckDetailsTable').getValue('customProps');
		obj.check = customProps?.checkId;

		await client.mutate({
			variables: { checkDetail: { ...obj } },
			mutation: UPDATE_CHECK_DETAIL,
		});

		Controller.clearEditing();
		table.setCreatingRow(null);
		exitCreatingMode();

		tableGlobalController.refetch();
		setTimeout(() => {
			const tableContainer = table.refs.tableContainerRef.current;
			if (tableContainer) {
				tableContainer.scrollLeft = 0;
				tableContainer.scrollTop = tableContainer.scrollHeight;
			}
		}, 0);
	},
	getDefaultValue: () => {
		const data = tableController('CheckDetailsTable').getValue('data');

		const row = data?.rows?.[0] || {};

		const defaultValue = {};

		const keys = ['check'];

		keys.forEach(key => {
			set(defaultValue, key, get(row, key));
		});

		return defaultValue;
	},
	handleUpdateData: async (client, rows) => {
		const customProps = tableController('CheckDetailsTable').getValue('customProps');

		await client.mutate({
			variables: {
				checkDetails: rows.map(row => ({
					...row,
					check: customProps?.checkId,
				})),
			},
			mutation: UPDATE_CHECK_DETAILS,
		});
	},
	onDelete: async (client, row) => {
		await client.mutate({
			variables: { checkDetail: { ...row, IsDeleted: true } },
			mutation: UPDATE_CHECK_DETAIL,
		});
	},

	// table columns schema
	TableSchema: [
		// hidden column
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
			enableEditing: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			isPinnedOnEdit: true,
			name: 'property.purchaserNumber.keyword',
			id: 'property.purchaserNumber',
			header: 'Payor Prop #',
			validate: validateRequiredString,
			Edit: editAutoCompleteField({
				tableKey: 'CheckDetailsTable',
				validate: validateRequiredString,
				placeholder: 'Payor Prop #',
				index: 'properties_flat',
				id: 'purchaserNumber',
				type: 'withOriginal',
				onChange: (value, row, originals) => {
					// TO Immediately update the value of other related fields (name, state and county) when the user selects a value from the dropdown (payor prop)
					const matchedOriginal = originals?.find(original => original?.purchaserNumber === value);

					unset(row._valuesCache, 'property');
					unset(row._valuesCache, 'property._id');

					set(row._valuesCache, 'property.purchaserNumber', matchedOriginal.purchaserNumber);
					set(row._valuesCache, 'property.name', matchedOriginal.name);
					set(row._valuesCache, 'property.state', matchedOriginal.state);
					set(row._valuesCache, 'property.county', matchedOriginal.county);
				},
			}),
		},
		// Pinned column
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'property._id.keyword',
			id: 'property._id',
			header: 'Property',
			Cell: ({ row }) => {
				// Get values from valuesCache manually becuase values are set in valuesCache when the user selects a value from the dropdown (payor prop)
				const name = get(row?._valuesCache, 'property.name') || get(row?.original, 'property.name');
				const purchaserNumber =
					get(row?._valuesCache, 'property.purchaserNumber') || get(row?.original, 'property.purchaserNumber');
				const number = get(row?._valuesCache, 'property.number') || get(row?.original, 'property.number');

				const value = `${purchaserNumber || ''} - ${name || number || ''}`;

				return row?.original?.property?.IsDeleted ? (
					<p style={{ display: 'flex', alignItems: 'center' }}>
						{value}
						<div style={{ marginTop: '2px' }}>
							<DeleteIcon style={{ color: 'red' }} />
						</div>
					</p>
				) : (
					<ColumnWithLink
						value={value}
						link={`/revenue/property/details/${row?.original?.property?._id}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				);
			},
			enableEditing: false,
		},
		// Common columns
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property Name',
			enableEditing: false,
		},
		{
			...CommonSchema.HIDDEN,
			name: 'property.number.keyword',
			id: 'property.number',
			header: 'Operator Prop #',
			enableEditing: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.state.keyword',
			id: 'property.state',
			header: 'State',
			enableEditing: false,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.county.keyword',
			id: 'property.county',
			header: 'County',
			enableEditing: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'date',
			id: 'date',
			header: 'Sales Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>; // format date before showing
			},

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'date',
				validate: validateRequiredString,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'product.keyword',
			id: 'product',
			header: 'Product',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				isSelect: true,
			}),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'disbursement',
			id: 'disbursement',
			header: 'Decimal Interest',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: NumberFormatPrecision,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'interestType.keyword',
			id: 'interestType',
			header: 'Interest Type',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				isSelect: true,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'price',
			id: 'price',
			header: 'Avg Price',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: CurrencyFormatCustom,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'grossPropertyVolume',
			id: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const value = row?.original?.grossPropertyVolume;
				return value ? <p>{vf_number(value, TO_FIXED)}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: NumberFormatComma,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossPropertyValue',
			id: 'grossPropertyValue',
			header: 'Prop Gross Revenue',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: CurrencyFormatCustom,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'grossOwnerVolume',
			id: 'grossOwnerVolume',
			header: 'Owner Volume',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const value = row?.original?.grossOwnerVolume;
				return value ? <p>{vf_number(value, TO_FIXED)}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: NumberFormatComma,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossOwnerValue',
			id: 'grossOwnerValue',
			header: 'Owner Gross Revenue',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: CurrencyFormatCustom,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'ownerTax',
			id: 'ownerTax',
			header: 'Owner Tax Amt',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: CurrencyFormatCustom,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'taxType.keyword',
			id: 'taxType',
			header: 'Tax Type',

			Edit: editAutoCompleteField({
				tableKey: 'CheckDetailsTable',
				placeholder: 'Tax Type',
				index: 'checkdetails_flat',
				id: 'taxType',
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'ownerDeducts',
			id: 'ownerDeducts',
			header: 'Deduct Amount',

			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				InputProps: {
					inputComponent: CurrencyFormatCustom,
				},
				isNumber: true,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'deductType.keyword',
			id: 'deductType',
			header: 'Deduct Type',

			Edit: editAutoCompleteField({
				tableKey: 'CheckDetailsTable',
				placeholder: 'Deduct Type',
				index: 'checkdetails_flat',
				id: 'deductType',
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'netOwnerValue',
			id: 'netOwnerValue',
			header: 'Owner Net Rev',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				validate: validateRequiredString,
				InputProps: {
					inputComponent: CurrencyFormatCustom,
				},
				isNumber: true,
				onKeyDown: async (e, table, value, key, _, id) => {
					window.table = table;
					if (e.key === 'Enter') {
						e.preventDefault();
						const Controller = tableController('CheckDetailsTable');
						const { editedData, data } = Controller.getValues(['editedData', 'data']);
						const validEditedEntries = Object.entries(editedData || {}).filter(([, value]) => !!value);
						if (validEditedEntries.length > 0) {
							const rowsToUpdate = Object.entries(editedData)
								.filter(([, value]) => !!value)
								.map(([key, value]) => {
									const currentRow = data.rows.find(r => r._id === key);
									return merge(currentRow, value);
								});

							rowsToUpdate[0] = {
								...rowsToUpdate[0],
								[key]: value,
							};
							const row =
								id === 'mrt-row-create'
									? {
											id,
											_valuesCache: rowsToUpdate[0],
											original: rowsToUpdate[0],
										}
									: table.getRow(id);
							row._valuesCache[key] = value;

							handleSubmitRow(table, row, Controller);
						} else {
							const { getDefaultValue } = Controller.getAllValues();
							const defaultValue = getDefaultValue?.() || {};
							table.setCreatingRow(createRow(table, defaultValue));
							setTimeout(() => {
								const tableContainer = table.refs.tableContainerRef.current;
								if (tableContainer) {
									tableContainer.scrollLeft = 0;
									tableContainer.scrollTop = tableContainer.scrollHeight;
								}
							}, 0);
						}
					}
				},
			}),
		},
	],
};

export default CheckDetailsMeta;
