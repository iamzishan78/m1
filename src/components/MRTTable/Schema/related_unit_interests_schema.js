/* eslint-disable react/prop-types */
import React from 'react';

import ListChips from 'components/Common/ListChips';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';

import { CommonSchema } from './common_schema';

const esIndex = 'shapeowners_flat';

const RelatedlUnitInterestMeta = {
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
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'contact._id.keyword',
			header: 'Contact ID',
			id: 'contact._id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'customLayerId.keyword',
			header: 'Custom Layer ID',
			id: 'customLayerId',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'ownerEntity',
			header: 'Owner Entity',
			id: 'ownerEntity',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'shape.shapeJson.properties.uName.keyword',
			id: 'shape.shapeJson.properties.uName',
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
			id: 'shape.shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			id: 'shape.shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.surveyMerdian.keyword',
			id: 'shape.shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.blockTownship.keyword',
			id: 'shape.shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.rangeSection.keyword',
			id: 'shape.shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			id: 'shape.shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.name.keyword',
			id: 'contact.entityDetail.name',
			header: 'Owner Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxYear',
			id: 'taxYear',
			isSearchField: false,
			header: 'Tax Year',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dataSource.keyword',
			id: 'dataSource',
			header: 'Data Source',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'working_interest',
			id: 'working_interest',
			header: 'Working Interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'royalty_interest',
			id: 'royalty_interest',
			header: 'Royalty Interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'orri',
			id: 'orri',
			header: 'ORRI',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nri',
			id: 'nri',
			header: 'NRI',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nra',
			id: 'nra',
			header: 'NRA',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'unitTractId.keyword',
			id: 'unitTractId',
			header: 'Unit Tract ID',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tractAcres',
			id: 'tractAcres',
			header: 'Unit Tract Acres',
			isSearchField: false,
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'offer_price',
			id: 'offer_price',
			header: 'Target Offer Price',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'max_offer_price',
			id: 'max_offer_price',
			header: 'Max Offer Price',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'actual_offer_price',
			id: 'actual_offer_price',
			header: 'Actual Offer Price',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'closed_price',
			id: 'closed_price',
			header: 'Closed Price',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.description.keyword',
			id: 'shape.shapeJson.properties.description',
			header: 'Unit description',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			type: 'array',
			name: 'campaigns',
			id: 'campaigns',
			header: 'Campaigns',
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.campaigns} fullWidth disabled />;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignPriority.keyword',
			id: 'campaignPriority',
			header: 'Campaign Priority',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.ownerType.keyword',
			id: 'contact.ownerType',
			header: 'Owner Type',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			id: 'deals.name',
			header: 'Associated Deals',
			isExport: 'deals',
			handleArrayExport: {
				esType: 'collection',
				actualKey: 'name',
			},
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
						tableKey={'RelatedUnitInterestTable'}
					/>
				);
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('ownerEntity');
				return (
					<CommentCell
						id={id}
						value={renderedCellValue.length}
						targetLabel={'Unit Ownership'}
						tableKey={'RelatedUnitInterestTable'}
					/>
				);
			},
		},
	],
};

export default RelatedlUnitInterestMeta;
