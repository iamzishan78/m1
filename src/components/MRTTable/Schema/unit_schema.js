import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import FlyToMap from 'components/MRTTable/Common/TableCells/coordinates_fly_map';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import UnitIcon from 'components/Shared/svgIcons/unit';
import { formatDate } from 'components/Shared/functions';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';

const esIndex = 'shapes_flat';

const UnitMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	gridViewSettings: {
		label: 'Unit Management',
		module: 'Units',
		Icon: UnitIcon,
		defaultView: {
			name: 'All Units',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Units') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '161px',
			left: '25px',
		},
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'layer.keyword', value: 'unit' }],
	maxTableHeight: 'calc(100vh - 290px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
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
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/units/${row.getValue('_id')}`} />
				</div>
			),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uNumber.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uNumber,
			id: 'shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.State.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.State,
			id: 'shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.County.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.County,
			id: 'shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.surveyMerdian.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.surveyMerdian,
			id: 'shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.blockTownship.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.blockTownship,
			id: 'shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.rangeSection.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.rangeSection,
			id: 'shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.abstractNameShortName,
			id: 'shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uAcres.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uAcres,
			id: 'shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uStatus.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uStatus,
			id: 'shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uPrimaryOperator.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uPrimaryOperator,
			id: 'shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uUnitPricing.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uUnitPricing,
			id: 'shapeJson.properties.uUnitPricing',
			header: 'Target Price/Acre',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uMaxUnitPricing.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uMaxUnitPricing,
			id: 'shapeJson.properties.uMaxUnitPricing',
			header: 'Max Price/Acre',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestSummary.unitInterestCount',
			accessorKey: 'interestSummary.unitInterestCount',
			header: 'Owner Count',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.campaignName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.campaignName,
			id: 'shapeJson.properties.campaignName',
			header: 'Campaign Name',
			size: 270,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.qualifier.name.keyword',
			accessorFn: row => row?.shapeJson?.properties?.qualifier?.name,
			id: 'shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.reviewer.name.keyword',
			accessorFn: row => row?.shapeJson?.properties?.reviewer?.name,
			id: 'shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: '_ts',
			accessorKey: '_ts',
			header: 'Last Updated',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => <div>{formatDate(row.getValue('_ts'), false)}</div>,
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'unit'} />;
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'unit'} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'coordinates',
			accessorKey: 'coordinates',
			header: '',
			size: 70,
			Cell: ({ row }) => {
				const id = row.getValue('_id');

				return <FlyToMap id={id} />;
			},
		},
	],
};

export default UnitMeta;
