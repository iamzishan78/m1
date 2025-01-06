/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { Box } from '@mui/material';

import { get, set } from 'lodash';
import moment from 'moment';

import { addTrailingZeros, formatDate } from 'components/Shared/functions';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';

import { tableController } from 'hookstate/tableController';

import { CURRENCY_TO_FIXED, INTEREST_TO_FIXED } from 'utils/consts';

export const CommonSchema = {
	COMMENTS: {
		name: 'comments',
		id: 'comments',
		header: '',
		size: 120,
		isPinned: false,
		hidden: false,
		filter: false,
		isSearchField: false,
		enableSorting: false,
		type: 'string',
		enableColumnActions: false,
		enableHiding: false,
		enableColumnFilter: false,
		isExport: false,
		enableColumnOrdering: false,
		enableColumnDragging: false,
		enableResizing: false,
		showInLast: true,
	},
	TAGS: {
		name: 'tags',
		id: 'tags',
		header: 'Tags',
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
		enableColumnFilter: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableColumnDragging: false,
		enableResizing: false,
		showInLast: true,
		isExport: 'tags',
		handleArrayExport: {
			esType: 'collection',
			actualKey: 'tag',
		},
	},
	IS_TRACKED: {
		name: 'isTracked',
		id: 'isTracked',
		header: '',
		size: 120,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
		enableColumnFilter: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableColumnDragging: false,
		enableResizing: false,
		showInLast: true,
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
	COMMON_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
	},
	ACTION_COLUMN: {
		header: ' ',
		isPinned: false,
		hidden: false,
		filter: true,
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
		Cell: ({ row }) => {
			return <>{row.original?.user?.name}</>;
		},
	},
	CREATED_BY: {
		name: 'createBy.name',
		id: 'createBy.name',
		header: 'Created By',
		size: 250,
		filter: true,
		isSearchField: false,
		type: 'string',
		Cell: ({ row }) => {
			return <>{row.original?.createBy?.name}</>;
		},
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
		Cell: ({ row }) => {
			return <>{row.original?.lastUpdateBy?.name}</>;
		},
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
				{name} by {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:
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

			return <div>{value ? addTrailingZeros(parseFloat(value).toFixed(INTEREST_TO_FIXED)) : 0}</div>;
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

			return <>{!value ? `$${value}` : vf_currency_to_fixed(value, CURRENCY_TO_FIXED)}</>;
		},
	},
	STRING_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
		filterVariant: 'select',
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
	},
	CUMULATIVE_FOOTER: (field, tableKey, toFixed = INTEREST_TO_FIXED) => ({
		Footer: () => {
			const Controller = tableController(tableKey);
			const footerProps = Controller.getValue('footerProps') || {};

			const value = get(footerProps, field);

			return <div>{value ? addTrailingZeros(parseFloat(value).toFixed(toFixed)) : 0}</div>;
		},
	}),
};

export const validateRequiredString = value => (!value?.length ? 'Required' : undefined);

export const editFieldProps =
	(tableKey, type, validate, required = true) =>
	({ cell, row }) => {
		const Controller = tableController(tableKey);

		const {
			stateValues: { validationErrors, editedData },
		} = Controller.useState(['validationErrors', 'editedData']);

		const errorText = validationErrors?.[row.id]?.[cell.column.id];

		const [value, setValue] = useState(cell.getValue());

		const onBlur = event => {
			const validationError = validate?.(event.currentTarget.value);

			const rowData = editedData[row.id] || {};

			set(rowData, cell.column.id, event.currentTarget.value);

			Controller.setValidationErrors(row.id, cell.column.id, validationError);
			Controller.setEditedData(row.id, rowData);
		};

		return {
			type,
			required,

			...(type === 'date' && { value: moment(value).format('yyyy-MM-DD') }),

			error: !!errorText,
			helperText: errorText,
			//store edited user in state to be saved later
			onChange: e => {
				setValue(e.currentTarget.value);

				if (type === 'date') {
					onBlur(e);
				}
			},
			onBlur: e => {
				onBlur(e);
			},
		};
	};
