import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

const DealsMeta = {
	maxTableHeight: 'calc(100vh - 250px)',
	isDeleteDisabled: true,
	isInFiniteScroll: true,
	columnVirtualization: true,
	modelName: 'Deal',
	defaultSort: { field: 'lastUpdateAt', order: 'desc', unmapped_type: 'date' },
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Deal Name',
			accessorKey: 'name',
			name: 'name',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Offer Price',
			accessorKey: 'offerPrice',
			name: 'offerPrice',
		},
		{
			...CommonSchema.STRING_COLUMN,
			type: 'date',
			header: 'Deal Received',
			accessorKey: 'receivedDate',
			name: 'receivedDate',
			Cell: ({ row }) => {
				return <>{formatDate(row.original?.receivedDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			type: 'date',
			header: 'Bid Date',
			accessorKey: 'bidDate',
			name: 'bidDate',
			Cell: ({ row }) => {
				return <>{formatDate(row.original?.bidDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			type: 'date',
			header: 'Close Date',
			accessorKey: 'closeDate',
			name: 'closeDate',
			Cell: ({ row }) => {
				return <>{formatDate(row.original?.closeDate)}</>;
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Closed Price',
			accessorKey: 'closedPrice',
			name: 'closedPrice',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'Total NRA',
			accessorKey: 'totalNRA',
			name: 'totalNRA',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Flowline',
			accessorKey: 'stage.pipeline.name',
			name: 'stage.pipeline.name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Deal Stage',
			accessorKey: 'stage.name',
			name: 'stage.name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Status',
			accessorKey: 'status',
			name: 'status',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Deal Owner',
			accessorKey: 'owner.name',
			name: 'owner.name',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Notes',
			accessorKey: 'notes',
			name: 'notes',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Created By',
			name: 'createBy',
			accessorKey: 'createBy',
		},
		CommonSchema.CREATED_DATE,
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Last Updated By',
			name: 'lastUpdateBy',
			accessorKey: 'lastUpdateBy',
		},
		CommonSchema.LAST_UPDATED_DATE,
	],
};

export default DealsMeta;
