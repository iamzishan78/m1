import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import ListChips from 'components/Common/ListChips';
import { CommonSchema } from './common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';

const esIndex = 'shapeowners_flat';

const ContactDetailTractInterestMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	isInFiniteScroll: true,
	columnVirtualization: true,
	isElasticQuery: false,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'ownerEntity',
			accessorKey: 'ownerEntity',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'shape.shapeJson.properties.shapeLabel.keyword',
			accessorKey: 'shape.shapeJson.properties.shapeLabel',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue}
						link={`/map/parcels/${row?.original?.shape?._id}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.State.keyword',
			header: 'State',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.State,
			id: 'shape.shapeJson.properties.originalProperties.State',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			header: 'County',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.County,
			id: 'shape.shapeJson.properties.originalProperties.County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.Survey.keyword',
			header: 'Survey/ Meridian',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.Survey,
			id: 'shape.shapeJson.properties.originalProperties.Survey',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.Block.keyword',
			header: 'Block/ Township',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.Block,
			id: 'shape.shapeJson.properties.originalProperties.Block',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.Section.keyword',
			header: 'Section/ Range',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.Section,
			id: 'shape.shapeJson.properties.originalProperties.Section',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.AbstractName.keyword',
			header: 'Abstract/ Section',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.AbstractName,
			id: 'shape.shapeJson.properties.originalProperties.AbstractName',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'qtr.keyword',
			header: 'QTR Calls',
			accessorFn: row => row?.qtr,
			id: 'qtr',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.sdGrossAcres.keyword',
			header: 'Gross Acres',
			accessorFn: row => row?.shape?.shapeJson?.properties?.sdGrossAcres,
			id: 'shape.shapeJson.properties.sdGrossAcres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthFrom.keyword',
			header: 'Depth From',
			accessorFn: row => row?.depthFrom,
			id: 'depthFrom',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthTo.keyword',
			header: 'Depth To',
			accessorFn: row => row?.depthTo,
			id: 'depthTo',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.name.keyword',
			header: 'Owner Name',
			accessorFn: row => row?.contact?.entityDetail?.name,
			id: 'contact.entityDetail.name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mineral_interest',
			header: 'Mineral Interest',
			isSearchField: false,
			accessorFn: row => row?.mineral_interest,
			id: 'mineral_interest',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'royalty_interest',
			header: 'Royalty Interest',
			isSearchField: false,
			accessorFn: row => row?.royalty_interest,
			id: 'royalty_interest',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			header: 'ORRI',
			isSearchField: false,
			accessorFn: row => row?.orri,
			id: 'orri',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'net_acres',
			header: 'Net Acres',
			isSearchField: false,
			accessorFn: row => row?.net_acres,
			id: 'net_acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nra',
			header: 'NRA',
			accessorFn: row => row?.nra,
			isSearchField: false,
			id: 'nra',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.department.keyword',
			header: 'Department',
			accessorFn: row => row?.shape?.shapeJson?.properties?.department,
			id: 'shape.shapeJson.properties.department',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			accessorKey: 'deals.name',
			header: 'Associated Deals',
			Cell: ({ row }) => {
				return (
					<div>
						{row?.original?.deals && Array.isArray(row?.original?.deals) ? (
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
								}}
							>
								<ListChips list={row?.original?.deals} />
							</div>
						) : (
							<div />
						)}
					</div>
				);
			},
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('ownerEntity');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'Parcel Ownership'}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ row }) => {
				const id = row.getValue('ownerEntity');
				return <CommentCell id={id} value={row?.original?.commentsCount} targetLabel={'Parcel Ownership'} />;
			},
		},
	],
};

export default ContactDetailTractInterestMeta;
