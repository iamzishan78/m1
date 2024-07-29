import { tableController, tableGlobalController } from 'hookstate/tableController';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import Loaders from 'components/Loaders';
import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';
import { copy } from 'utils/helper';
import { isEmpty, pickBy } from 'lodash';
import { globalStateController } from 'hookstate/globalStateController';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'checkdetailsinterestscomparison_flat';


const OwnersPerUnitMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	maxTableHeight: 'calc(100vh - 489px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
        {
            ...CommonSchema.INITAIL_PINNED,
            name: "property.name.keyword",
            accessorKey: 'property.name',
            header: "Property Name",
        },
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.number.keyword',
			accessorKey: 'property.number',
			header: 'Property Number',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.apiNumber.keyword',
			accessorFn: row => row?.wells?.apiNumber,
			id: 'wells.apiNumber',
			header: 'Well API',
			Cell: ({ row }) => {
				const apiNumbers = row?.original?.wells?.map(item => item.apiNumber) || [];
				return (apiNumbers?.length && apiNumbers?.length > 1) ? "Multiple" : apiNumbers[0];
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.wellName.keyword',
			accessorFn: row => row?.wells?.wellName,
			id: 'wells.wellName',
			header: 'Well Name',
			Cell: ({ row }) => {
				const wellName = row?.original?.wells?.map(item => item.wellName) || [];
				return (wellName?.length && wellName?.length > 1) ? "Multiple" : wellName[0];
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'date',
			accessorKey: 'date',
			header: 'Sales Date',
			isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.date)}</>
            }
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'product.keyword',
            accessorKey: 'product',
			header: 'Product',
			isHiddenFieldExport: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'reportedVolume',
			accessorKey: "reportedVolume",
			header: 'Reported Volume',
			isHiddenFieldExport: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyVolume',
			accessorKey: 'grossPropertyVolume',
			header: 'Statement Volume',
			isHiddenFieldExport: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.production.data.ReportDate',
			accessorKey: 'wells.production.data.ReportDate',
			header: 'Report Date',
            type: 'date'
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.production.data.allocatedOil',
			accessorKey: 'wells.production.data.allocatedOil',
			header: 'Oil Production',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.production.data.allocatedGas',
			accessorKey: 'wells.production.data.allocatedGas',
			header: 'Gas Production',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'data.allocatedWater',
			accessorKey: 'overShort',
			header: 'Over/Short',
            Cell: ({ row }) => {
                console.log("row",row)
                const renderedCellValue = row?.original?.overShort || 0;
                return   <p
                style={{
                  fontWeight: 600,
                  color: renderedCellValue > 0 ? "#177B1E" : "#F4273D",
                }}
              >
                {renderedCellValue > 0 ? renderedCellValue : renderedCellValue * -1 }
              </p>
  
            }
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'data.allocatedWater',
			accessorKey: 'difference',
			header: '% Difference',
            Cell: ({ row }) => {
                const renderedCellValue = row?.original?.difference
				const overShort = row?.original?.overShort
                return   <p
                style={{
                  fontWeight: 600,
                  color: overShort > 0 ? "#177B1E" : "#F4273D",
                }}
              >
                {renderedCellValue?.replace('-','')}
              </p>
  
            }
		},
	],
};

export default OwnersPerUnitMeta;
