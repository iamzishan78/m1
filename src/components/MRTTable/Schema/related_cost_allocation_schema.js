import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import RelatedCostAllocationsToolbar from '../TablesOverride/RelatedCostAllocationsTable/RelatedCostAllocationsToolbar';

const esIndex = 'properties_flat';

// Related Cost Allocations Meta
const RelatedCostAllocationsMeta = {
    esIndex,
    pageSize: 50,
    pagination: {
        pageIndex: 0,
        pageSize: 50,
    },
    maxTableHeight: 'calc(100vh - 790px)',
    CustomToolBar: RelatedCostAllocationsToolbar,
    isInFiniteScroll: true,
    columnVirtualization: true,
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
            name: "number.keyword",
            accessorFn: row => row?.number,
            id: "number",
            header: "Property #",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "name.keyword",
            accessorFn: row => row?.name,
            id: "name",
            header: "Property Name",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "costAllocation.allocation.keyword",
            accessorFn: row => row?.costAllocation?.allocation,
            id: "costAllocation.allocation",
            header: "Cost Allocation",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "costAllocation.amount.keyword",
            accessorFn: row => row?.costAllocation?.amount,
            id: "costAllocation.amount",
            header: "Cost Allocation Amount",
        }
    ],
};

export default RelatedCostAllocationsMeta;
