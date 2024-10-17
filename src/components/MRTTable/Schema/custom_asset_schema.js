import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import AssetEntityToolbar from '../TablesOverride/AssetCustomEntities/AssetEntityToolbar';

const esIndex = 'customentitiesmodelkeys_flat';

const customAssetMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: '35vh',
	isInFiniteScroll: true,
	columnVirtualization: false,
	isDeleteDisabled: true,
	CustomToolBar: AssetEntityToolbar,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'label.keyword',
			accessorFn: row => row?.label,
			id: 'label',
			header: 'Column Label',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mappingKey.keyword',
			accessorFn: row => row?.mappingKey,
			id: 'mappingKey',
			header: 'Column Key',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'keyType.keyword',
			accessorFn: row => row?.keyType,
			id: 'keyType',
			header: 'Column Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'isSummaryField',
			accessorKey: 'isSummaryField',
			header: 'Summary Field',
			isSearchField: false,
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			type: 'boolean',
			Cell: ({ row }) => {
				const isSummaryField = [true, 'true', 'True'].includes(row.getValue('isSummaryField'));

				return <>{isSummaryField ? 'Yes' : 'No'}</>;
			},
		},
	],
};

export default customAssetMeta;
