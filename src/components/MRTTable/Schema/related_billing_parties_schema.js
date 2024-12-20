import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import RelatedBillingPartiesToolbar from '../TablesOverride/RelatedBillingPartiesTable/RelatedBillingPartiesToolbar';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';

const esIndex = 'contacts_flat';

// Related Billing Parties Meta
const RelatedBillingPartiesMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 550px)',
	CustomToolBar: RelatedBillingPartiesToolbar,
	isInFiniteScroll: true,
	columnReordering: false,
	isGeneric: false,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
		},
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'billingParties.name.keyword',
			accessorFn: row => row?.billingParties?.name,
			id: 'billingParties.name',
			header: 'Billing Party Name',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'name',
			},
			Cell: ({ row }) => {
				const value = row.original?.billingParties?.name || '';
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={value}
							link={`/contact/details/${row.getValue('_id')}`}
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
			name: 'billingParties.address.keyword',
			accessorFn: row => row?.billingParties?.address,
			id: 'billingParties.address',
			header: 'Billing Party Address',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'address',
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.allocation.keyword',
			accessorFn: row => row?.billingParties?.allocation,
			id: 'billingParties.allocation',
			header: 'Billing Party Allocation',
			type: 'number',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'allocation',
			},
			Cell: ({ row }) => {
				const value = row.original?.billingParties?.allocation;
				return value ? `${Number(value).toFixed(2)}%` : value === 0 ? `0%` : '';
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'billingParties.amount.keyword',
			accessorFn: row => row?.billingParties?.amount,
			id: 'billingParties.amount',
			header: 'Billing Party Amount',
			type: 'number',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'amount',
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.status.keyword',
			accessorFn: row => row?.billingParties?.status,
			id: 'billingParties.status',
			header: 'Status',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'status',
			},
		},
	],
};

export default RelatedBillingPartiesMeta;
