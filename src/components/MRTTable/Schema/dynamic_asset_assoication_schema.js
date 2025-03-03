import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { dummySchema } from '../utils/data';

const DynamicAssetAssocitionMeta = {
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(70vh - 100px)',
	columnVirtualization: false,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		...dummySchema, // Dummy schema for loading
	],
};

export default DynamicAssetAssocitionMeta;
