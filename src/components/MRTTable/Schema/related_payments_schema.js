import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import { tableGlobalController } from 'hookstate/tableController';
import RelatedPaymentsToolbar from '../TablesOverride/RelatedPaymentsTable/RelatedPaymentsToolbar';

const esIndex = 'payment_flat';

// click on row
const onClickedRow = selectedRow => {
	tableGlobalController.updateState({
		paymentMultiGrid: { showMultiGrid: true, paymentId: selectedRow._id },
	});
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
	maxTableHeight: '400px',
	CustomToolBar: RelatedPaymentsToolbar,
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
			simple: true,
			type: 'date',
			isSearchField: false,
			Cell: ({ renderedCellValue, row }) => {
				return <>{formatDate(row?.original?.startDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'endDate',
			accessorFn: row => row?.endDate,
			id: 'endDate',
			header: 'End Date',
			simple: true,
			type: 'date',
			isSearchField: false,
			Cell: ({ renderedCellValue, row }) => {
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
			name: 'nextPayment.keyword',
			accessorFn: row => row?.nextPayment,
			id: 'nextPayment',
			header: 'Next Payment',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'amount.keyword',
			accessorFn: row => row?.amount,
			id: 'amount',
			header: 'Amount',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'companyShare.keyword',
			accessorFn: row => row?.companyShare,
			id: 'companyShare',
			header: 'Company Share',
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
			name: 'assignedTo.keyword',
			accessorFn: row => row?.assignedTo,
			id: 'assignedTo',
			header: 'Assigned To',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'paymentStatus.keyword',
			accessorFn: row => row?.paymentStatus,
			id: 'paymentStatus',
			header: 'Payment Status',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'calendarLinks.keyword',
			accessorFn: row => row?.calendarLinks,
			id: 'calendarLinks',
			header: 'Calendar Link',
		},
	],
};

export default RelatedPaymentsMeta;
