import { tableController, tableGlobalController } from 'hookstate/tableController';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import Loaders from 'components/Loaders';
import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';
import { copy } from 'utils/helper';
import { isEmpty, pickBy } from 'lodash';
import { globalStateController } from 'hookstate/globalStateController';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'checkdetailsinterestscomparison_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		const user = globalStateController.getValue('user');
		Loaders.createToast(loaderId, 'Updation in Progress');

		const customData = copy(row?.custom_data) ?? {};
		const filteredCustomData = pickBy(
			customData,
			value => value !== '' && !isEmpty(value)
		);

		const shapeOwners = {
			_id: row._id,
			custom_data: {
				...filteredCustomData,
				[item.name]: value,
			},
		};

		await client.mutate({
			variables: {
				shapeOwners,
				shapeType: 'Unit',
				userId: user._id
			},
			mutation: UPDATE_SHAPE_OWNERS,
		});

		Loaders.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch (err) {
		Loaders.errorToast(loaderId, 'Failed to Update');
	}
};


const onClickedRow = selectedRow => {
	const Controller = tableController('OwnersPerUnitTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addOwnerToUnit',
			shapeId: customLayer?._id,
			uAcres: customLayer?.shapeJson?.properties?.uAcres,
			uUnitPricing: customLayer?.shapeJson?.properties?.uUnitPricing,
			uMaxUnitPricing: customLayer?.shapeJson?.properties?.uMaxUnitPricing,
			shapeType: 'Unit',
			selectedRow,
		},
	});
};

const OwnersPerUnitMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	onClickedRow,
	onCustomKeyChange,
	// defaultSort: { field: '_ts', order: 'asc' },
	maxTableHeight: 'calc(100vh - 489px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	// deletedKeys: {
	// 	mainRecord: { key: '_id' },
	// 	parentRecord: { key: 'shape._id' }
	// },
	// defaultFlterMode: 'multiselect',
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
			accessorKey: 'wells.apiNumber',
			header: 'API Number',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.wellName.keyword',
			accessorKey: 'wells.wellName',
			header: 'Well Name',
			isHiddenFieldExport: true,
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
			name: 'data.allocatedGas',
			accessorKey: "data.allocatedGas",
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
			accessorKey: 'data.allocatedWater',
			header: 'Over/Short',
            Cell: ({ row }) => {
                console.log("row",row)
                
                const renderedCellValue = row?.original?.data?.allocatedWater
                return   <p
                style={{
                  fontWeight: 600,
                  color: renderedCellValue > 0 ? "#177B1E" : "#F4273D",
                }}
              >
                {renderedCellValue > 0 ? renderedCellValue : renderedCellValue *-1}
              </p>
  
            }
		},
	],
};

export default OwnersPerUnitMeta;
