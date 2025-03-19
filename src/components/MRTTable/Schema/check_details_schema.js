/* eslint-disable react/prop-types */
import React from 'react';

import DeleteIcon from '@material-ui/icons/Delete';

import { get, set } from 'lodash';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { CommonSchema, editFieldProps, validateRequiredString } from 'components/MRTTable/Schema/common_schema';
import { copy, formatDate } from 'components/Shared/functions';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { UPDATE_CHECK_DETAIL, UPDATE_CHECK_DETAILS } from 'graphQL/useMutationUpdateCheckDetail';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController, tableGlobalController } from 'stateManagement/tableController';

import { TO_FIXED } from 'utils/consts';

import CheckDetailsToolbar from '../TablesOverride/CheckDetailsTable/CheckDetailsToolbar';

const esIndex = 'checkdetails_flat';

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

		await client.mutate({
			variables: { checkDetail: { ...obj } },
			mutation: UPDATE_CHECK_DETAIL,
		});

		Controller.clearEditing();
		table.setCreatingRow(null);
		exitCreatingMode();

		tableGlobalController.refetch();
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
		await client.mutate({
			variables: {
				checkDetails: rows,
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
		// Pinned column
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property',
			Cell: ({ row }) => {
				const value = `${row?.original?.property?.purchaserNumber || ''} - ${row?.original?.property?.name || row?.original?.property?.number || ''}`;

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
			name: 'property.purchaserNumber.keyword',
			id: 'property.purchaserNumber',
			header: 'Payor Prop #',
			enableEditing: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property Name',
			enableEditing: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.number.keyword',
			id: 'property.number',
			header: 'Operator Prop #',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				validate: validateRequiredString,
				isSelect: true,
				onChange: (value, id, rowData, rowId) => {
					const TableSchema = tableController('CheckDetailsTable').getValue('TableSchema');

					const column = TableSchema.find(c => c.id === id);

					const { originals } = column;

					const property = originals.find(property => property.number === value);

					set(rowData, 'property', property);

					tableController('CheckDetailsTable').setEditedData(rowId, rowData);
				},
			}),
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

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				validate: validateRequiredString,
				isSelect: true,
			}),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'disbursement',
			id: 'disbursement',
			header: 'Decimal Interest',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'interestType.keyword',
			id: 'interestType',
			header: 'Type',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				validate: validateRequiredString,
				isSelect: true,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'price',
			id: 'price',
			header: 'Avg Price',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
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

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossPropertyValue',
			id: 'grossPropertyValue',
			header: 'Prop Gross Revenue',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
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

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossOwnerValue',
			id: 'grossOwnerValue',
			header: 'Owner Gross Revenue',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'ownerTax',
			id: 'ownerTax',
			header: 'Owner Tax Amt',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'taxType.keyword',
			id: 'taxType',
			header: 'Tax Type',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				validate: validateRequiredString,
				isSelect: true,
			}),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'ownerDeducts',
			id: 'ownerDeducts',
			header: 'Deduct Amt',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'number',
				validate: validateRequiredString,
			}),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'deductType.keyword',
			id: 'deductType',
			header: 'Deduct Cd',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				validate: validateRequiredString,
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
				type: 'number',
				validate: validateRequiredString,
			}),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'detailLineNotation',
			id: 'detailLineNotation',
			header: 'Detail Line Notation',

			validate: validateRequiredString,
			muiEditTextFieldProps: editFieldProps({
				tableKey: 'CheckDetailsTable',
				type: 'text',
				validate: validateRequiredString,
			}),
		},
		{
			...CommonSchema.HIDDEN,
			name: 'propertyId',
			id: 'propertyId',
			enableEditing: false,
		},
		// Comment button
		{
			...CommonSchema.COMMENTS,
			// Cell rendering for Comments column
			Cell: ({ row }) => {
				const id = row?.original?.property?._id;
				const targetLabel = 'Property';
				return <CommentCell id={id} value={''} targetLabel={targetLabel} />;
			},
			enableEditing: false,
		},
	],
};

export default CheckDetailsMeta;
