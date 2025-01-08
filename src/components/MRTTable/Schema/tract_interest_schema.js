/* eslint-disable react/prop-types */
import React from 'react';

import ListChips from 'components/Common/ListChips';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TractIcon from 'components/Shared/svgIcons/tract';

import ContactNameLink from '../Common/TableCells/ContactNameLink';

const esIndex = 'shapeowners_flat';

const TractInterestsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [
		{ field: 'shape.layer.keyword', value: 'parcel' },
		{ field: 'contact.IsDeleted', value: false },
		{ field: 'shape.IsDeleted', value: false },
		{ field: 'descriptor', value: 'ParcelDescriptor' },
	],
	maxTableHeight: 'calc(100vh - 450px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	deletedKeys: {
		// Deletion keys mapping
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' },
	},
	gridViewSettings: {
		// Grid view
		label: 'Tract Interests',
		module: 'TractInterest',
		Icon: TractIcon,
		defaultView: {
			name: 'All Tract Interests',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Tract Interest') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '161px',
			left: '190px',
		},
	},
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'ownerEntity',
			id: 'ownerEntity',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'contact._id',
			id: 'contact._id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'shape._id',
			id: 'shape._id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'contact.entityDetail.name.keyword',
			id: 'contact.entityDetail.name',
			header: 'Contact Name',
			size: 500,
			Cell: ({ row }) => {
				return <ContactNameLink contact={row?.original?.contact} />;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.name.keyword',
			id: 'contact.entityDetail.name',
			header: 'Owner Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.shapeLabel.keyword',
			id: 'shape.shapeJson.properties.shapeLabel',
			header: 'Tract Name',
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
			name: 'shape.qtrQtrSelection.selectedQtr.keyword',
			id: 'shape.qtrQtrSelection.selectedQtr',
			header: 'QTR Calls',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.sdGrossAcres',
			id: 'shape.shapeJson.properties.sdGrossAcres',
			header: 'Gross Acres',
			type: 'number',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthFrom.keyword',
			id: 'depthFrom',
			header: 'Depth From',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthTo.keyword',
			id: 'depthTo',
			header: 'Depth To',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'mineral_interest',
			id: 'mineral_interest',
			header: 'Mineral Interest',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nonExecRightsOnly.keyword',
			id: 'nonExecRightsOnly',
			header: 'Non-Exec Rights Only',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'net_acres',
			id: 'net_acres',
			header: 'Net Acres',
			type: 'number',
			isSearchField: false,
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nra',
			id: 'nra',
			header: 'NRA',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uUnitPricingNMA.keyword',
			id: 'shape.shapeJson.properties.uUnitPricingNMA',
			header: 'Target Pricing (per NMA)',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uMaxUnitPricingNMA.keyword',
			id: 'shape.shapeJson.properties.uMaxUnitPricingNMA',
			header: 'Max Pricing (per NMA)',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uUnitPricing.keyword',
			id: 'shape.shapeJson.properties.uUnitPricing',
			header: 'Target Pricing (per NRA)',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uMaxUnitPricing.keyword',
			id: 'shape.shapeJson.properties.uMaxUnitPricing',
			header: 'Max Pricing (per NRA)',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'seller_asking_price',
			id: 'seller_asking_price',
			header: 'Seller Asking Price',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'competitor_offer_price',
			id: 'competitor_offer_price',
			header: 'Competitor Offer Price',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'actual_offer_price',
			id: 'actual_offer_price',
			header: 'Actual Offer Price',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.contactStatus.keyword',
			id: 'contact.contactStatus',
			header: 'Contact Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.status.keyword',
			id: 'contact.status',
			header: 'Contact Stage',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactOwners.keyword',
			id: 'contactOwners',
			header: 'Contact Owner',
			Cell: ({ row }) => {
				return <div>{row?.original?.contactOwners[0]}</div>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'leaseStatus.keyword',
			id: 'leaseStatus',
			header: 'Lease Status',
		},

		// {
		//   ...CommonSchema.COMMON_COLUMN,
		//   name: 'shape.shapeJson.properties.department.keyword',
		//   id: 'shape.shapeJson.properties.department',
		//   header: 'Department',
		// },
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
			name: 'deals.name.keyword',
			id: 'deals.name',
			isExport: 'deals', // esKey for export
			header: 'Associated Deals',
			handleArrayExport: {
				esType: 'collection',
				actualKey: 'name',
			},
			isSearchField: true,
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

export default TractInterestsMeta;
