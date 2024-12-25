import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import vf_number from 'components/Shared/valueformatters/vf_number';

const esIndex = 'checkdetails_flat';

const PropertyRevenueDetailMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(60vh - 200px)',
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
			name: 'check.checkNumber.keyword',
			accessorKey: 'check.checkNumber',
			header: 'Check #',
			Cell: ({ row }) => {
				return (
					<ColumnWithLink
						value={
							row?.original?.check?.checkNumber && row?.original?.check?.payor?.name
								? `${row?.original?.check?.checkNumber} - ${row?.original?.check?.payor?.name}`
								: row?.original?.check?.checkNumber || row?.original?.check?.payor?.name || ''
						}
						link={`/revenue/statement/details/${row?.original?.check?._id}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				);
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.payor.name.keyword',
			accessorKey: 'check.payor.name',
			header: 'Purchaser',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.purchaserNumber.keyword',
			accessorKey: 'property.purchaserNumber',
			header: 'Purhaser Property #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.name.keyword',
			accessorKey: 'property.name',
			header: 'Property Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkDate',
			accessorKey: 'check.checkDate',
			header: 'Check Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.checkDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.ownerNumber.keyword',
			accessorFn: row => row?.property?.ownerNumber,
			id: 'property.ownerNumber',
			header: 'Owner Number',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property._owner.name.keyword',
			accessorFn: row => row?.property?._owner?.name,
			id: 'property._owner.name',
			header: 'Owner',
			hidden: true,
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
			hidden: true,
        },
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'check.checkAmount',
			accessorKey: 'check.checkAmount',
			header: 'Check Amount',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.source.keyword',
			accessorKey: 'check.source',
			header: 'Source',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.sourceId.keyword',
			accessorFn: row => row?.check?.sourceId,
			id: 'check.sourceId',
			header: 'Source Id',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkNumber.keyword',
			accessorKey: 'check.checkNumber',
			id: 'check.checkNumber',
			header: 'Payor Property #',
			Cell: ({ row }) => <>{row?.original?.check?.checkNumber}</>,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.state.keyword',
			accessorKey: 'property.state',
			header: 'State',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.county.keyword',
			accessorKey: 'property.county',
			header: 'County',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'date',
			accessorKey: 'date',
			header: 'Sales Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'product.keyword',
			accessorKey: 'product',
			header: 'Product',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
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
			...CommonSchema.CURRENCY_COLUMN,
			name: 'price',
			accessorKey: 'price',
			header: 'Avg Price',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyVolume',
			accessorKey: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const value = row?.original?.grossPropertyVolume;
				return value ? <p>{vf_number(value, 2)}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossPropertyValue',
			accessorKey: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerVolume',
			accessorKey: 'grossOwnerVolume',
			header: 'Owner Volume',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const value = row?.original?.grossOwnerVolume;
				return value ? <p>{vf_number(value, 2)}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossOwnerValue',
			accessorKey: 'grossOwnerValue',
			header: 'Owner Gross Revenue',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
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
			...CommonSchema.CURRENCY_COLUMN,
			name: 'ownerDeducts',
			accessorKey: 'ownerDeducts',
			header: 'Deduct Amt',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deductType.keyword',
			accessorKey: 'deductType',
			header: 'Deduct Cd',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
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

export default PropertyRevenueDetailMeta;
