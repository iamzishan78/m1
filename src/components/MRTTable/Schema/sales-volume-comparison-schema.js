import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'checkdetailsinterestscomparison_flat';


const OwnersPerUnitMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	maxTableHeight: 'calc(100vh - 710px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		// MongoDB ID column
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		// Property Name column
		{
			...CommonSchema.INITAIL_PINNED,
			name: "property.name.keyword",
			accessorKey: 'property.name',
			header: "Property Name",
		},
		// Property Number column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.number.keyword',
			accessorKey: 'property.number',
			header: 'Property Number',
			isExternalFilter: true,
		},
		// Well API Number column with custom cell rendering
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.apiNumber.keyword',
			accessorFn: row => row?.wells?.apiNumber,
			id: 'wells.apiNumber',
			header: 'Well API',
			Cell: ({ row }) => {
				const apiNumbers = row?.original?.wells?.map(item => item.apiNumber) || [];
				return (apiNumbers?.length && apiNumbers?.length > 1) ? "Multiple" : apiNumbers[0];
			},
		},
		// Well Name column with custom cell rendering
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.wellName.keyword',
			accessorFn: row => row?.wells?.wellName,
			id: 'wells.wellName',
			header: 'Well Name',
			Cell: ({ row }) => {
				const wellName = row?.original?.wells?.map(item => item.wellName) || [];
				return (wellName?.length && wellName?.length > 1) ? "Multiple" : wellName[0];
			},
		},
		// Sales Date column with custom cell rendering to format the date
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'date',
			accessorKey: 'date',
			header: 'Sales Date',
			isHiddenFieldExport: true,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>;
			}
		},
		// Product column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'product.keyword',
			accessorKey: 'product',
			header: 'Product',
			isHiddenFieldExport: true,
		},
		// Reported Volume column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'reportedVolume',
			accessorKey: "reportedVolume",
			header: 'Reported Volume',
			isHiddenFieldExport: true,
		},
		// Statement Volume column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyVolume',
			accessorKey: 'grossPropertyVolume',
			header: 'Statement Volume',
			isHiddenFieldExport: true,
		},
		// Report Date column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.production.data.ReportDate',
			accessorKey: 'wells.production.data.ReportDate',
			header: 'Report Date',
			type: 'date',
		},
		// Oil Production column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.production.data.allocatedOil',
			accessorKey: 'wells.production.data.allocatedOil',
			header: 'Oil Production',
		},
		// Gas Production column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.production.data.allocatedGas',
			accessorKey: 'wells.production.data.allocatedGas',
			header: 'Gas Production',
		},
		// Over/Short column with custom cell rendering to display color-coded value
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'data.allocatedWater',
			accessorKey: 'overShort',
			header: 'Over/Short',
			isSearchField: false, // disabled searching field
			enableSorting: false, // disabled sorting field
			Cell: ({ row }) => {
				const renderedCellValue = row?.original?.overShort || 0;
				return (
					<p
						style={{
							fontWeight: 600,
							color: renderedCellValue > 0 ? "#177B1E" : "#F4273D",
						}}
					>
						{renderedCellValue > 0 ? renderedCellValue : renderedCellValue * -1}
					</p>
				);
			},
		},
		// % Difference column with custom cell rendering to display color-coded value
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'data.allocatedWater',
			accessorKey: 'difference',
			header: '% Difference',
			isSearchField: false, // disabled searching field
			enableSorting: false, // disabled sorting field
			Cell: ({ row }) => {
				const renderedCellValue = row?.original?.difference;
				const overShort = row?.original?.overShort;
				return (
					<p
						style={{
							fontWeight: 600,
							color: overShort > 0 ? "#177B1E" : "#F4273D",
						}}
					>
						{renderedCellValue?.replace('-', '')}
					</p>
				);
			},
		},
		{
			...CommonSchema.HIDDEN,
			name: 'check.checkNumber.keyword',
			accessorFn: row => row?.check?.checkNumber,
			isExternalFilter: true,
		}
	],
};

export default OwnersPerUnitMeta;
