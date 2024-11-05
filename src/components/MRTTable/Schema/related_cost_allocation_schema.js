import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import RelatedCostAllocationsToolbar from '../TablesOverride/RelatedCostAllocationsTable/RelatedCostAllocationsToolbar';
import { tableGlobalController } from 'hookstate/tableController';
import { getArrayValue } from '../utils/helper';
import vf_currency from 'components/Shared/valueformatters/vf_currency';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';

const esIndex = 'properties_flat';

// Related Cost Allocations Meta
const RelatedCostAllocationsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 550px)',
	CustomToolBar: RelatedCostAllocationsToolbar,
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
			name: 'number.keyword',
			accessorFn: row => row?.number,
			id: 'number',
			header: 'Property #',
			Cell: ({ row }) => {
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							onClick={e => {
								e.stopPropagation();
							}}
							value={row.getValue('number') || '-'}
							link={`/revenue/property/details/${row.getValue('_id')}`}
						/>
					</div>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'name.keyword',
			accessorFn: row => row?.name,
			id: 'name',
			header: 'Property Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'costAllocations.allocation.keyword',
			accessorFn: row => row?.costAllocations?.allocation,
			id: 'costAllocations.allocation',
			header: 'Cost Allocation',
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
				const value = getArrayValue(row.original.costAllocations, 'allocation', paymentId, 'paymentId');
				return `${value}%`;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'costAllocations.amount.keyword',
			accessorFn: row => row?.costAllocations?.amount,
			id: 'costAllocations.amount',
			header: 'Cost Allocation Amount',
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
				const value = getArrayValue(row.original.costAllocations, 'amount', paymentId, 'paymentId');
				return value ? vf_currency(parseFloat(value)) : '';
			},
		},
	],
};

export default RelatedCostAllocationsMeta;
