import { ErrorOutline } from '@material-ui/icons';
import { formatDate } from 'components/Shared/functions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';

const esIndex = 'checkdetails_flat';

const checkDetailsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 300px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	isDeleteDisabled: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'check.checkName.keyword',
			accessorFn: row => row?.check?.checkNumber,
			id: 'check.checkName',
			isExternalFilter: true,
			header: 'Check Number',
		
			Cell: ({ row, cell }) => {
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							 value={
								row?.original?.check?.checkNumber && row?.original?.check?.payor?.name
									? `${row?.original?.check?.checkNumber} - ${row?.original?.check?.payor?.name}`
									: row?.original?.check?.checkNumber || row?.original?.check?.payor?.name || ''
							}
							link={`/revenue/statement/details/${row?.original?._id}`}
							onClick={e => {
								e.stopPropagation();
							}}
						/>
					</div>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.name.keyword',
			accessorFn: row => row?.property?.name,
			id: 'property.name',
			header: 'Property',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.payor.name.keyword',
			accessorFn: row => row?.check?.payor?.name,
			id: 'check.payor.name',
			header: 'Payor',
		},
	    // Column for Check Date
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.checkDate.keyword',
            accessorFn: row => row?.check?.checkDate,
            id: 'checkDate',
            header: 'Check Date',
            type: 'date',
            isSearchField: false,
            // Cell rendering for Check Date column
            Cell: ({ renderedCellValue, row }) => {
                return <>{formatDate(renderedCellValue)}</>;
            },
        },
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.ownerNumber.keyword',
			accessorFn: row => row?.property?.ownerNumber,
			id: 'property.ownerNumber',
			header: 'Owner Number',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property._owner.name.keyword',
			accessorFn: row => row?.property?._owner?.name,
			id: 'Owner',
			header: 'Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property._owner.name.keyword',
			accessorFn: row => row?.property?._owner?.name,
			id: 'Owner',
			header: 'Owner',
		},
		{
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.depositDate.keyword',
            accessorFn: row => row?.check?.depositDate,
            id: 'depositDate',
            header: 'Deposit Date',
            type: 'date',
            isSearchField: false,
            // Cell rendering for Check Date column
            Cell: ({ renderedCellValue, row }) => {
                return <>{formatDate(renderedCellValue)}</>;
            },
        },
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkAmount',
			accessorKey: 'check.checkAmount',
			header: 'Check Amount',
			Cell: ({ renderedCellValue }) => <>{vf_currency_to_fixed(renderedCellValue)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.source.keyword',
			accessorKey: 'check.source',
			header: 'Source',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.sourceId.keyword',
			accessorFn: row => row?.check?.sourceId,
			id: 'check.sourceId',
			header: 'Source Id',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkNumber.keyword',
			accessorKey: 'check.checkNumber',
			id: 'check.checkNumber',
			header: 'Payor Property #',
			Cell: ({ row }) => <>{row?.original?.check?.checkNumber}</>,
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
			name: 'product.keyword',
			accessorKey: 'product',
			header: 'Product',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'date',
			accessorKey: 'date',
			header: 'Sales Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'disbursement',
			accessorKey: 'disbursement',
			header: 'Decimal Interest',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestType.keyword',
			accessorKey: 'interestType',
			header: 'Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'price',
			accessorKey: 'price',
			header: 'Avg Price',
			Cell: ({ row }) => {
				const value = row?.original?.price;
				return <p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>;
			},
			type: 'price',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyValue',
			accessorKey: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerVolume',
			accessorKey: 'grossOwnerVolume',
			header: 'Gross Owner Volume',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerValue',
			accessorKey: 'grossOwnerValue',
			header: 'Owner Gross Revenue',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerTax',
			accessorKey: 'ownerTax',
			header: 'Owner Tax Amt',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxType.keyword',
			accessorKey: 'taxType',
			header: 'Tax Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deductType.keyword',
			accessorKey: 'deductType',
			header: 'Deduct Cd',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'netOwnerValue',
			accessorKey: 'netOwnerValue',
			header: 'Owner Net Rev',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'propertyId',
			accessorKey: 'propertyId',
		},
	],
};

export default checkDetailsMeta;
