import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';

const esIndex = 'shapeowners_flat';

const RelatedTractsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'shape._id.keyword',
			accessorFn: row => row?.shape?._id,
			id: 'shape._id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'tract.name.keyword',
			accessorFn: row => row?.tract?.name,
			id: 'tract.name',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/parcels/${row?.original?.tractId}`} />
				</div>
			),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.state.keyword',
			accessorFn: row => row?.tract?.state,
			id: 'tract.state',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.county.keyword',
			accessorFn: row => row?.tract?.county,
			id: 'tract.county',
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.basin.keyword',
			accessorFn: row => row?.tract?.basin,
			id: 'tract.basin',
			header: 'Basin',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.field.keyword',
			accessorFn: row => row?.tract?.field,
			id: 'tract.field',
			header: 'Field',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.survey.keyword',
			accessorFn: row => row?.tract?.survey,
			id: 'tract.survey',
			header: 'Survey/ Meridian',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.block.keyword',
			accessorFn: row => row?.tract?.block,
			id: 'tract.block',
			header: 'Block/ Township',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.section.keyword',
			accessorFn: row => row?.tract?.section,
			id: 'tract.section',
			header: 'Section/ Range',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.abstract.keyword',
			accessorFn: row => row?.tract?.abstract,
			id: 'tract.abstract',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tract.qtr.keyword',
			accessorFn: row => row?.tract?.qtr,
			id: 'tract.qtr',
			header: 'QTR Calls',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.name.keyword',
			accessorFn: row => row?.contact?.entityDetail?.name,
			id: 'contact.entityDetail.name',
			header: 'Name',
			size: 450,
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/contact/details/${row?.original?.contact?._id}`} />
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mineral_interest',
			accessorFn: row => row?.mineral_interest,
			id: 'mineral_interest',
			header: 'MI',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'royalty_interest',
			accessorFn: row => row?.royalty_interest,
			id: 'royalty_interest',
			header: 'RI',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			accessorFn: row => row?.orri,
			id: 'orri',
			header: 'ORRI',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'working_interest',
			accessorFn: row => row?.working_interest,
			id: 'working_interest',
			header: 'WI',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.sdGrossAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.sdGrossAcres,
			id: 'shape.shapeJson.properties.sdGrossAcres',
			header: 'Gross Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'net_acres',
			accessorFn: row => row?.net_acres,
			id: 'net_acres',
			header: 'Net Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'company_net_acres',
			accessorFn: row => row?.company_net_acres,
			id: 'company_net_acres',
			header: 'Co Net Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nra',
			accessorFn: row => row?.nra,
			id: 'nra',
			header: 'NRA',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'acquisition_nra',
			accessorFn: row => row?.acquisition_nra,
			id: 'acquisition_nra',
			header: 'Acquisition $/NRA',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'acquisition_cost',
			accessorFn: row => row?.acquisition_cost,
			id: 'acquisition_cost',
			header: 'Acquisition Cost',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthFrom.keyword',
			accessorFn: row => row?.depthFrom,
			id: 'depthFrom',
			header: 'Depth From',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthTo.keyword',
			accessorFn: row => row?.depthTo,
			id: 'depthTo',
			header: 'Depth To',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tractStatus.keyword',
			accessorFn: row => row?.tractStatus,
			id: 'tractStatus',
			header: 'Tract Status',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.department.keyword',
			accessorFn: row => row?.shape?.shapeJson.properties.department,
			id: 'shape.shapeJson.properties.department',
			header: 'Department',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mapStatus.keyword',
			accessorFn: row => row?.mapStatus,
			id: 'mapStatus',
			header: 'Map Status',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'countAcres.keyword',
			accessorFn: row => row?.countAcres,
			id: 'countAcres',
			header: 'Count Acres',
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				const targetLabel = 'parcel';
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={targetLabel} />;
			},
		},
	],
};

export default RelatedTractsMeta;
