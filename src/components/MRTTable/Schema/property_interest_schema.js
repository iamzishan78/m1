import { Box } from '@mui/material';
import { formatDate } from 'components/Shared/functions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';

const esIndex = 'propertyinterest_flat';

const PropertyIntrestMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: 'property.name.keyword', order: 'asc' },
	maxTableHeight: 'calc(100vh - 330px)',
	isInFiniteScroll: true,
	// columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'property._id',
			accessorKey: 'property._id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'property.name.keyword',
			accessorKey: 'property.name',
			header: 'Property',
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('property._id') || row.original?.property?._id;
				const value = renderedCellValue || row.getValue('property.number');

				if (!id) return value;

				return <ColumnWithLink value={value} link={`property/details/${id}`} onClick={() => { }} />;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.number.keyword',
			accessorKey: 'property.number',
			header: 'Operator Property #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.operator.name.keyword',
			accessorKey: 'property.operator.name',
			header: 'Operator',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.purchaser.name.keyword',
			accessorKey: 'property.purchaser.name',
			header: 'Payor',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: "property.purchaserNumber.keyword",
			accessorKey: 'property.purchaserNumber',
			header: "Payor Property #",
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			accessorKey: 'status',
			header: 'Status',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestType.keyword',
			accessorKey: 'interestType',
			header: 'Interest Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestAmount',
			accessorKey: 'interestAmount',
			header: 'Interest Amount',
			isSearchField: false,
			type: 'number',
			aggregationFn: 'sum',
			AggregatedCell: ({ cell, table }) => (
				<>
					Interest by {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:
					<Box
						sx={{
							color: 'info.main',
							display: 'inline',
							fontWeight: 'bold',
							paddingLeft: '0.3rem',
						}}
					>
						{parseFloat(cell.getValue().toFixed(3))}
					</Box>
				</>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'costFree.keyword',
			accessorKey: 'costFree',
			header: 'Cost Free',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'effectiveDate',
			accessorKey: 'effectiveDate',
			header: 'Effective Date',
			type: 'date',
			Cell: ({ row }) => <>{formatDate(row.getValue('effectiveDate'))}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.state.keyword',
			accessorKey: 'property.state',
			header: 'State',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.county.keyword',
			accessorKey: 'property.county',
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerName.keyword',
			accessorKey: 'ownerName',
			header: 'Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.legalDescription.keyword',
			accessorKey: 'property.legalDescription',
			header: 'Description',
		},
	],
};

export default PropertyIntrestMeta;
