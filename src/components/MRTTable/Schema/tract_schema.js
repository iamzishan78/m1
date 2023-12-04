import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';

const esIndex = 'shapes_flat';

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
			name: 'shapeJson.properties.campaignName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.campaignName,
			id: 'shapeJson.properties.campaignName',
			header: 'Campaign Name',
			size: 270,
			Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.sdGrossAcres.keyword',
			accessorFn: row => row?.shapeJson?.properties?.sdGrossAcres,
			id: 'shapeJson.properties.sdGrossAcres',
			header: 'Gross Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.shapeArea.keyword',
			accessorFn: row => row?.shapeJson?.properties?.shapeArea,
			id: 'shapeJson.properties.shapeArea',
			header: 'Calc Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.department.keyword',
			accessorFn: row => row?.shapeJson?.properties?.department,
			id: 'shapeJson.properties.department',
			header: 'Department',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				const targetLabel = 'parcel';
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={targetLabel} />;
			},

		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				const targetLabel = 'parcel';
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={targetLabel} />;
			},

		}
	],
};

export default TractMeta;
