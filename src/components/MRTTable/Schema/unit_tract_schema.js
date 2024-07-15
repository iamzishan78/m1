import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TractPerUnitToolBar from "components/MRTTable/TablesOverride/TractPerUnit/TractPerUnitToolBar";
import { tableController, tableGlobalController } from 'hookstate/tableController';

const esIndex = 'shapetracts_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('UnitTractTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addTractToUnit',
			shapeId: customLayer?._id,
			shapeType: 'Unit',
			selectedRow,
		},
	});
};

const TractMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'layer.keyword', value: 'parcel' }],
	maxTableHeight: 'calc(100vh - 550px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	CustomToolBar: TractPerUnitToolBar,
	onClickedRow,
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
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue || row.getValue('shapeJson.properties.originalProperties.State')} link={`/map/parcels/${row.getValue('_id')}`} />
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'state.keyword',
			accessorKey: 'state',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'county.keyword',
			accessorKey: 'county',
			header: 'county',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'meridian.keyword',
			accessorKey: 'meridian',
			header: 'Meridian',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'township.keyword',
			accessorKey: 'township',
			header: 'Township',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'range.keyword',
			accessorKey: 'range',
			header: 'Range',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'section.keyword',
			accessorKey: 'section',
			header: 'Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'altSurvey.keyword',
			accessorKey: 'altSurvey',
			header: 'Alt Survey',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'legalDescription.keyword',
			accessorKey: 'legalDescription',
			header: 'Full Legal Description',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeArea',
			accessorKey: 'shapeArea',
			header: 'Tract Calc. Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'sdGrossAcres',
			accessorKey: 'sdGrossAcres',
			header: 'Tract Gross Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'unitTractId.keyword',
			accessorKey: 'unitTractId',
			header: 'Unit Tract ID',
			isSearchField: false,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uAcres',
			accessorKey: 'uAcres',
			header: 'Unit Tract Acres',
			isSearchField: false,

		},
	],
};

export default TractMeta;