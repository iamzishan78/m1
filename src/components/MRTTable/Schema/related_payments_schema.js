import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import { tableGlobalController } from 'hookstate/tableController';
import RelatedPaymentsToolbar from '../TablesOverride/RelatedPaymentsTable/RelatedPaymentsToolbar';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';

const esIndex = 'payment_flat';

// click on row
const onClickedRow = selectedRow => {
	const paymentMultiGrid = tableGlobalController.getValue('paymentMultiGrid');
	if (paymentMultiGrid?.paymentId && paymentMultiGrid?.paymentId === selectedRow._id) {
		tableGlobalController.updateState({
			paymentMultiGrid: { showMultiGrid: false },
		});
	} else if (selectedRow?._id) {
		tableGlobalController.updateState({
			paymentMultiGrid: {
				showMultiGrid: true,
				paymentId: selectedRow._id,
				paymentAmount: selectedRow?.amount,
			},
		});
	}
};

// Related Payments Meta
const RelatedPaymentsMeta = {
	esIndex,
	onClickedRow,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 550px)',
	CustomToolBar: RelatedPaymentsToolbar,
	isInFiniteScroll: true,
	columnReordering: false,
	enableRowSelected: true,
	hasMultiGrids: true,
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
			name: 'paymentType.keyword',
			accessorFn: row => row?.paymentType,
			id: 'paymentType',
			header: 'Payment Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'startDate',
			accessorFn: row => row?.startDate,
			id: 'startDate',
			header: 'Start Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.startDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'endDate',
			accessorFn: row => row?.endDate,
			id: 'endDate',
			header: 'End Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.endDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'frequency.keyword',
			accessorFn: row => row?.frequency,
			id: 'frequency',
			header: 'Frequency',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nextPayment',
			accessorFn: row => row?.nextPayment,
			id: 'nextPayment',
			header: 'Next Payment',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.nextPayment)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'amount.keyword',
			accessorFn: row => row?.amount,
			id: 'amount',
			type: 'number',
			header: 'Amount',
			Cell: ({ row }) => {
				const value = row?.original?.amount;
				return value ? vf_currency_to_fixed(parseFloat(value), 2) : value === 0 ? `$0` : '';
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'companyShare.keyword',
			accessorFn: row => row?.companyShare,
			id: 'companyShare',
			header: 'Company Share',
			type: 'number',
			Cell: ({ row }) => {
				const value = row?.original?.companyShare;
				return value ? vf_currency_to_fixed(parseFloat(value), 2) : value === 0 ? `$0` : '';
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'responsibleParty.keyword',
			accessorFn: row => row?.responsibleParty,
			id: 'responsibleParty',
			header: 'Responsible Party',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'assignedTo.displayName.keyword',
			accessorFn: row => row?.assignedTo?.displayName,
			id: 'assignedTo.displayName',
			header: 'Assigned To',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'paymentStatus.keyword',
			accessorFn: row => row?.paymentStatus,
			id: 'paymentStatus',
			header: 'Payment Status',
		},
	],
};

export default RelatedPaymentsMeta;
