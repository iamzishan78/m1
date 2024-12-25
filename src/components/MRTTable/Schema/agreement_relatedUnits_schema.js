import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

// Schema for agreement related units grid

// Elastic search index
const esIndex = 'relatedshapes_flat';

// Grid schema
const UnitMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	maxTableHeight: 'calc(100vh - 215px)',
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
			name: 'relatedShape.name.keyword',
			accessorKey: 'relatedShape.name',
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/units/${row.original?.relatedShape?._id}`} />
				</div>
			),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.uNumber.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.uNumber,
			id: 'relatedShape.shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.State.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.originalProperties?.State,
			id: 'relatedShape.shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.County.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.originalProperties?.County,
			id: 'relatedShape.shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.surveyMerdian.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.originalProperties?.surveyMerdian,
			id: 'relatedShape.shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.blockTownship.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.originalProperties?.blockTownship,
			id: 'relatedShape.shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.rangeSection.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.originalProperties?.rangeSection,
			id: 'relatedShape.shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.originalProperties?.abstractNameShortName,
			id: 'relatedShape.shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.uAcres.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.uAcres,
			id: 'relatedShape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.uStatus.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.uStatus,
			id: 'relatedShape.shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.uPrimaryOperator.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.uPrimaryOperator,
			id: 'relatedShape.shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.uUnitPricing.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.uUnitPricing,
			id: 'relatedShape.shapeJson.properties.uUnitPricing',
			header: 'Target Price/Acre',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.uMaxUnitPricing.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.uMaxUnitPricing,
			id: 'relatedShape.shapeJson.properties.uMaxUnitPricing',
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
			type: 'array',
			name: 'relatedShape.shapeJson.properties.campaigns.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.campaigns,
			id: 'relatedShape.shapeJson.properties.campaigns',
			header: 'Campaigns',
			size: 270,
			Cell: ({ row }) => {
				return (
					<CampaignField value={row?.original?.relatedShape?.shapeJson?.properties?.campaigns} fullWidth disabled />
				);
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.qualifier.name.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.qualifier?.name,
			id: 'relatedShape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedShape.shapeJson.properties.reviewer.name.keyword',
			accessorFn: row => row?.relatedShape?.shapeJson?.properties?.reviewer?.name,
			id: 'relatedShape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: '_ts',
			accessorKey: '_ts',
			header: 'Last Updated',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => <div>{formatDate(row.getValue('_ts'))}</div>,
		},
	],
};

export default UnitMeta;
