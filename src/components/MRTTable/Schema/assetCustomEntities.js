import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import AssetCustomEntitiesToolbar from '../TablesOverride/AssetCustomEntities/AssetCustomEntitiesToolbar';

const esIndex = 'assetcustomentities_flat';

const AssetCustomEntitiesMeta = {
  esIndex,
  pageSize: 50,
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  maxTableHeight: '40vh',
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
      accessorFn: (row) => row?.tableName,
      id: 'tableName',
      header: 'Asset Name',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'creationPlace.keyword',
      accessorFn: (row) => row?.creationPlace,
      id: 'creationPlace',
      header: 'Creation Place',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'numberOfKeys',
      accessorFn: (row) => row?.numberOfKeys,
      id: 'numberOfKeys',
      header: 'Number of Keys',
    },
  ],
};

export default AssetCustomEntitiesMeta;
