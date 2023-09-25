import { Box } from '@mui/material';
import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { formatDate } from 'components/Shared/functions';

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
			name: 'property._id',
			accessorKey: 'property._id',
			isSearchField: false,
			hidden: true,
			enableColumnActions: false,
			enableHiding: false,
		},
		{
			name: 'property.name.keyword',
			accessorKey: 'property.name',
			header: 'Property',
			size: 250,
			isPinned: true,
			enableHiding: false,
			isGrouped: true,
			filter: true,
			type: 'string',
			enableColumnActions: false,
			enableColumnOrdering: false,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('property._id') || row.original?.property?._id;
				const value = renderedCellValue || row.getValue('property.number');

				if (!id) return value;

				return <ColumnWithLink value={value} link={`property/details/${id}`} onClick={() => {}} />;
			},
		},
		{
			name: 'property.number.keyword',
			accessorKey: 'property.number',
			header: 'Property Number',
			size: 210,
			filter: true,
			type: 'string',
		},
		{
			name: 'status.keyword',
			accessorKey: 'status',
			header: 'Status',
			size: 150,
			enableSorting: false,
			filter: true,
			type: 'string',
		},
		{
			name: 'interestType.keyword',
			accessorKey: 'interestType',
			header: 'Interest Type',
			size: 200,
			enableSorting: false,
			filter: true,
			type: 'string',
		},
		{
			name: 'interestAmount',
			accessorKey: 'interestAmount',
			header: 'Interest Amount',
			size: 280,
			filter: false,
			enableColumnFilter: false,
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
			name: 'costFree.keyword',
			accessorKey: 'costFree',
			header: 'Cost Free',
			size: 150,
			enableSorting: false,
			filter: true,
			type: 'string',
		},
		{
			name: 'effectiveDate',
			accessorKey: 'effectiveDate',
			header: 'Effective Date',
			size: 200,
			isSearchField: false,
			filter: true,
			type: 'date',
			Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue, false)}</>,
		},
		{
			name: 'property.state.keyword',
			accessorKey: 'property.state',
			header: 'State',
			size: 150,
			enableSorting: false,
			filter: true,
			type: 'string',
		},
		{
			name: 'property.county.keyword',
			accessorKey: 'property.county',
			header: 'County',
			size: 200,
			enableSorting: false,
			filter: true,
			type: 'string',
		},
		{
			name: 'ownerName.keyword',
			accessorKey: 'ownerName',
			header: 'Owner',
			size: 250,
			filter: true,
			type: 'string',
		},
		{
			name: 'property.legalDescription.keyword',
			accessorKey: 'property.legalDescription',
			header: 'Description',
			size: 250,
			enableColumnFilter: false,
			enableSorting: false,
			isSearchField: false,
		},
	],
};

export default PropertyIntrestMeta;
