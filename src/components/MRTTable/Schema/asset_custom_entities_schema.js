import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import AssetCustomEntitiesToolbar from '../TablesOverride/AssetCustomEntities/AssetCustomEntitiesToolbar';
import Chips from '../Common/TableCells/Chips';

const esIndex = 'assetcustomentities_flat';

const AssetCustomEntitiesMeta = {
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
	CustomToolBar: AssetCustomEntitiesToolbar,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tableName.keyword',
			accessorFn: row => row?.tableName,
			id: 'tableName',
			header: 'Asset Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'creationPlace.keyword',
			accessorFn: row => row?.creationPlace,
			id: 'creationPlace',
			header: 'Creation Place',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'numberOfKeys',
			accessorFn: row => row?.numberOfKeys,
			id: 'numberOfKeys',
			header: 'Number of Keys',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'controlColumns.label.keyword',
			accessorKey: 'controlColumns',
			header: 'Control Columns',
			Cell: ({ renderedCellValue }) => {
				return <Chips list={renderedCellValue} />;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'associatedModels.keyword',
			accessorKey: 'associatedModels',
			header: 'Associated Models',
			Cell: ({ renderedCellValue }) => {
				return <Chips list={renderedCellValue} />;
			},
		},
	],
};

export default AssetCustomEntitiesMeta;
