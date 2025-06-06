import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import DynamicAssetGridToolBar from 'components/MRTTable/TablesOverride/DynamicAssetGrid/DynamicAssetGridToolBar';

import { dummySchema } from '../utils/data';

const DynamicAssetMeta = {
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 215px)',
	columnVirtualization: false,
	isAggregatedSearch: true,

	CustomToolBar: DynamicAssetGridToolBar,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		...dummySchema, // Dummy schema for loading
	],
};

export default DynamicAssetMeta;
