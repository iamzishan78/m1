import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import RelatedBillingPartiesToolbar from '../TablesOverride/RelatedBillingPartiesTable/RelatedBillingPartiesToolbar';
import { tableGlobalController } from 'hookstate/tableController';
import { getArrayValue } from '../utils/helper';

const esIndex = 'contacts_flat';

// Related Billing Parties Meta
const RelatedBillingPartiesMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 790px)',
	CustomToolBar: RelatedBillingPartiesToolbar,
	isInFiniteScroll: true,
	columnReordering: false,
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
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.billingParties, 'name', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.address.keyword',
			accessorFn: row => row?.billingParties?.address,
			id: 'billingParties.address',
			header: 'Billing Party Address',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.billingParties, 'address', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.allocation.keyword',
			accessorFn: row => row?.billingParties?.allocation,
			id: 'billingParties.allocation',
			header: 'Billing Party Allocation',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.billingParties, 'allocation', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.amount.keyword',
			accessorFn: row => row?.billingParties?.amount,
			id: 'billingParties.amount',
			header: 'Billing Party Amount',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.billingParties, 'amount', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.status.keyword',
			accessorFn: row => row?.billingParties?.status,
			id: 'billingParties.status',
			header: 'Status',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.billingParties, 'status', paymentId, 'paymentId');
			},
		},
	],
};

export default RelatedBillingPartiesMeta;
