import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

const esIndex = 'mywellproduction_flats';

const WellProductionMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	maxTableHeight: 'calc(100vh - 540px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: false,
	isDeleteDisabled: true,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'Id.keyword',
			id: 'data.Id',
			header: 'Well Id',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'data.ReportDate.keyword',
			id: 'data.ReportDate',
			header: 'Report Date',
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'data.oil',
			id: 'data.oil',
			header: 'Oil (BBL)',
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'data.gas',
			id: 'data.gas',
			header: 'Gas (MCF)',
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'data.water',
			id: 'data.water',
			header: 'H2O (BBL)',
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'data.allocatedOil',
			id: 'data.allocatedOil',
			header: 'Allocated Oil (BBL)',
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'data.allocatedGas',
			id: 'data.allocatedGas',
			header: 'Allocated Gas (MCF)',
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'data.allocatedWater',
			id: 'data.allocatedWater',
			header: 'Allocated Water (BBL)',
		},
	],
};

export default WellProductionMeta;
