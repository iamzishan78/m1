import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import RelatedPayeesToolbar from '../TablesOverride/RelatedPayeesTable/RelatedPayeesToolbar';
import { getArrayValue } from '../utils/helper';
import { tableGlobalController } from 'hookstate/tableController';
const esIndex = 'contacts_flat';

// Related Payments Meta
const RelatedPaymentsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 790px)',
	CustomToolBar: RelatedPayeesToolbar,
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
			name: 'payments.payeeName.keyword',
			accessorFn: row => row?.payments?.payeeName,
			id: 'paympayments.payeeName',
			header: 'Payee Name',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.payments, 'payeeName', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payments.payeeAddress.keyword',
			accessorFn: row => row?.payments?.payeeAddress,
			id: 'payments.payeeAddress',
			header: 'Payee Address',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.payments, 'payeeAddress', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payments.paymentAllocation.keyword',
			accessorFn: row => row?.payments?.paymentAllocation,
			id: 'payments.paymentAllocation',
			header: 'Payment Allocation',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.payments, 'paymentAllocation', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payments.paymentAmount.keyword',
			accessorFn: row => row?.payments?.paymentAmount,
			id: 'payments.paymentAmount',
			header: 'Payment Amount',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.payments, 'paymentAmount', paymentId, 'paymentId');
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payments.status.keyword',
			accessorFn: row => row?.payments?.status,
			id: 'payments.status',
			header: 'Status',
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.payments, 'status', paymentId, 'paymentId');
			},
		},
	],
};

export default RelatedPaymentsMeta;
