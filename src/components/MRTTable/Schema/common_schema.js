import { Box } from '@mui/material';
import { addTrailingZeros, formatDate } from 'components/Shared/functions';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import { tableController } from 'hookstate/tableController';
import { get } from 'lodash';

export const CommonSchema = {
	COMMENTS: {
		name: 'comments',
		accessorKey: 'comments',
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
		enableResizing: false,
		showInLast: true,
	},
	TAGS: {
		name: 'tags',
		accessorKey: 'tags',
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
		accessorKey: 'isTracked',
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
		enableResizing: false,
		showInLast: true,
	},
	HIDDEN: {
		header: ' ',
		isAlwaysHidden: true,
		isSearchField: false,
		hidden: true,
		enablePinning: false,
		enableHiding: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableSorting: false,
	},
	MONGO_ID: {
		header: 'M1neral System ID',
		isSearchField: false,
		hidden: true,
		enableColumnFilter: false,
		enablePinning: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
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
		enableResizing: false,
		showInLast: true,
	},
	SELECT_SOME: {
		name: 'over-ride-checkbox',
		accessorKey: 'over-ride-checkbox',
		isPinned: true,
		hidden: false,
		isSearchField: false,
		enableHiding: false,
		enableSorting: false,
		filter: false,
		isExternalFilter: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableColumnFilter: false,
		isExport: false,
		enableResizing: false,
		size: 80,
	},
	USER: {
		name: 'user.name',
		accessorKey: 'user.name',
		header: 'User',
		size: 250,
		filter: true,
		isSearchField: false,
		type: 'string',
		Cell: ({ row }) => {
			return <>{row.original?.user?.name}</>;
		},
	},
	CREATED_BY: {
		name: 'createBy.name',
		accessorKey: 'createBy.name',
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
		accessorKey: 'createAt',
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
		accessorKey: 'lastUpdateBy.name',
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
		accessorKey: 'lastUpdateAt',
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
					{parseFloat(cell.getValue().toFixed(3))}
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

			return <div>{value ? addTrailingZeros(parseFloat(value).toFixed(8)) : 0}</div>;
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
		Cell: ({ renderedCellValue }) => {
			const value = renderedCellValue?.props?.['aria-label'] ?? renderedCellValue;
			if (value || value === 0) {
				return <>{!value ? value : addTrailingZeros(parseFloat(value).toFixed(8))}</>;
			}
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
		Cell: ({ renderedCellValue }) => {
			const value = renderedCellValue?.props?.['aria-label'] ?? renderedCellValue;
			if (value || value === 0) {
				return <>{!value ? `$${value}` : vf_currency_to_fixed(value, 2)}</>;
			}
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
	},
};
