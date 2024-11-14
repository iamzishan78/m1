import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import RelatedBillingPartiesToolbar from '../TablesOverride/RelatedBillingPartiesTable/RelatedBillingPartiesToolbar';
import { tableGlobalController } from 'hookstate/tableController';
import { getArrayValue } from '../utils/helper';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';

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
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				const value = getArrayValue(row.original.billingParties, 'name', paymentId, 'paymentId');
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
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'address',
			},
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
			type: 'number',
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
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				const value = getArrayValue(row.original.billingParties, 'allocation', paymentId, 'paymentId');
				return value ? `${value}%` : '';
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.amount.keyword',
			accessorFn: row => row?.billingParties?.amount,
			id: 'billingParties.amount',
			header: 'Billing Party Amount',
			type: 'number',
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'amount',
			},
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				const value = getArrayValue(row.original.billingParties, 'amount', paymentId, 'paymentId');
				return value ? vf_currency_to_fixed(parseFloat(value), 2) : '';
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'billingParties.status.keyword',
			accessorFn: row => row?.billingParties?.status,
			id: 'billingParties.status',
			header: 'Status',
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'paymentId',
				// field in customprops that will be matched
				referenceValueKey: 'paymentId',
				// field that needs to be exported from matched object
				actualKey: 'status',
			},
			Cell: ({ row }) => {
				const { paymentId } = tableGlobalController.getValue('paymentMultiGrid');
				return getArrayValue(row.original.billingParties, 'status', paymentId, 'paymentId');
			},
		},
	],
};

export default RelatedBillingPartiesMeta;
