import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import vf_number from 'components/Shared/valueformatters/vf_number';
import { formatDate } from 'components/Shared/functions';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import CheckDetailsToolbar from '../TablesOverride/CheckDetailsTable/CheckDetailsToolbar';
import DeleteIcon from '@material-ui/icons/Delete';

const esIndex = 'checkdetails_flat';

const CheckDetailsMeta = {
	// initials
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(60vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	CustomToolBar: CheckDetailsToolbar,
	isDeleteDisabled: true,
	// table columns schema
	TableSchema: [
		// hidden column
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		// Pinned column
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'property.name.keyword',
			accessorKey: 'property.name',
			header: 'Property',
			Cell: ({ row }) => {
				const value = `${row?.original?.property?.purchaserNumber || ''} - ${row?.original?.property?.name || ''}`;
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
		},
		// Common columns
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.purchaserNumber.keyword',
			accessorKey: 'property.purchaserNumber',
			header: 'Payor Prop #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.name.keyword',
			accessorKey: 'property.name',
			header: 'Property Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.number.keyword',
			accessorKey: 'property.number',
			header: 'Operator Prop #',
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
			name: 'date',
			accessorKey: 'date',
			header: 'Sales Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>; // format date before showing
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
		// Comment button
		{
			...CommonSchema.COMMENTS,
			// Cell rendering for Comments column
			Cell: ({ renderedCellValue, row }) => {
				const id = row?.original?.property?._id;
				const targetLabel = 'Property';
				return <CommentCell id={id} value={''} targetLabel={targetLabel} />;
			},
		},
	],
};

export default CheckDetailsMeta;
