import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import RelatedPayeesToolbar from '../TablesOverride/RelatedPayeesTable/RelatedPayeesToolbar';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';

const esIndex = 'contacts_flat';

// Related Payments Meta
const RelatedPaymentsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 550px)',
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
			id: 'payments.payeeName',
			header: 'Payee Name',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'payeeName',
			},
			Cell: ({ row }) => {
				const value = row.original?.payments?.payeeName || '';
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
			name: 'payments.payeeAddress.keyword',
			accessorFn: row => row?.payments?.payeeAddress,
			id: 'payments.payeeAddress',
			header: 'Payee Address',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'payeeAddress',
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payments.paymentAllocation.keyword',
			accessorFn: row => row?.payments?.paymentAllocation,
			id: 'payments.paymentAllocation',
			header: 'Payment Allocation',
			type: 'number',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'paymentAllocation',
			},
			Cell: ({ row }) => {
				const value = row.original?.payments?.paymentAllocation;
				return value ? `${Number(value).toFixed(2)}%` : value === 0 ? `0%` : '';
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'payments.paymentAmount.keyword',
			accessorFn: row => row?.payments?.paymentAmount,
			id: 'payments.paymentAmount',
			header: 'Payment Amount',
			type: 'number',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'paymentAmount',
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payments.status.keyword',
			accessorFn: row => row?.payments?.status,
			id: 'payments.status',
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
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'contact'} />;
			},
		},
	],
};

export default RelatedPaymentsMeta;
