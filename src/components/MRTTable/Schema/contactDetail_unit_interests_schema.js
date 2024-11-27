import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import ListChips from 'components/Common/ListChips';
import { CommonSchema } from './common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { Typography } from '@material-ui/core';

const esIndex = 'shapeowners_flat';

const ContactDetailUnitInterestMeta = {
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
			name: 'shape.shapeJson.properties.uName.keyword',
			accessorKey: 'shape.shapeJson.properties.uName',
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue}
						link={`/map/units/${row?.original?.shape?._id}`}
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
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.State,
			id: 'shape.shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.County,
			id: 'shape.shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.surveyMerdian.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.surveyMerdian,
			id: 'shape.shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.blockTownship.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.blockTownship,
			id: 'shape.shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.rangeSection.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.rangeSection,
			id: 'shape.shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.abstractNameShortName,
			id: 'shape.shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.name.keyword',
			accessorFn: row => row?.contact?.entityDetail?.name,
			id: 'contact.entityDetail.name',
			header: 'Owner Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxYear',
			accessorFn: row => row?.taxYear,
			id: 'taxYear',
			isSearchField: false,
			header: 'Tax Year',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'working_interest',
			accessorFn: row => row?.working_interest,
			id: 'working_interest',
			isSearchField: false,
			header: 'Working Interest',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'royalty_interest',
			accessorFn: row => row?.royalty_interest,
			id: 'royalty_interest',
			isSearchField: false,
			header: 'Royalty Interest',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			accessorFn: row => row?.orri,
			id: 'orri',
			isSearchField: false,
			header: 'ORRI',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nri',
			accessorFn: row => row?.nri,
			id: 'nri',
			isSearchField: false,
			header: 'NRI',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nra',
			accessorFn: row => row?.nra,
			id: 'nra',
			isSearchField: false,
			header: 'NRA',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'offer_price',
			accessorFn: row => row?.offer_price,
			id: 'offer_price',
			header: 'Target Offer Price',
			isSearchField: false,
			Cell: ({ row }) => <Typography>{vf_currency_to_fixed(row?.original?.offer_price, 2)}</Typography>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'max_offer_price',
			accessorFn: row => row?.max_offer_price,
			id: 'max_offer_price',
			header: 'Max Offer Price',
			isSearchField: false,
			Cell: ({ row }) => <Typography>{vf_currency_to_fixed(row?.original?.max_offer_price, 2)}</Typography>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'actual_offer_price',
			accessorFn: row => row?.actual_offer_price,
			id: 'actual_offer_price',
			header: 'Actual Offer Price',
			isSearchField: false,
			Cell: ({ row }) => <Typography>{vf_currency_to_fixed(row?.original?.actual_offer_price, 2)}</Typography>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.description.keyword',
			accessorKey: 'shape.shapeJson.properties.description',
			header: 'Unit description',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignName.keyword',
			accessorFn: row => row?.campaignName,
			id: 'campaignName',
			header: 'Campaign',
			Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignPriority.keyword',
			accessorFn: row => row?.campaignPriority,
			id: 'campaignPriority',
			header: 'Campaign Priority',
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
						targetLabel={'Unit Ownership'}
					/>
				);
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('ownerEntity');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'Unit Ownership'} />;
			},
		},
	],
};

export default ContactDetailUnitInterestMeta;
