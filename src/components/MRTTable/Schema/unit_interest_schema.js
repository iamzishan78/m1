/* eslint-disable react/prop-types */
import React from 'react';

import ListChips from 'components/Common/ListChips';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import UnitIcon from 'components/Shared/svgIcons/unit';

import { CommonSchema } from './common_schema';
import ContactNameLink from '../Common/TableCells/ContactNameLink';

const esIndex = 'shapeowners_flat';

const UnitInterestMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	gridViewSettings: {
		label: 'Unit Interests',
		module: 'UnitInterest',
		Icon: UnitIcon,
		defaultView: {
			name: 'All Unit Interests',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Unit Interest') {
				view.filters = [
					{
						field: 'contactOwners',
						value: user.name || user.displayName || user.email,
					},
				];
			}

			return view;
		},
		cssOverride: {
			top: '161px',
			left: '190px',
		},
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [
		{ field: 'shape.layer.keyword', value: 'unit' },
		{ field: 'contact.IsDeleted', value: 'false' },
		{ field: 'shape.IsDeleted', value: 'false' },
		{ field: 'descriptor', value: 'ShapeOwnerDescriptor' },
	],
	maxTableHeight: 'calc(100vh - 215px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	deletedKeys: {
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' },
	},
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'contact._id.keyword',
			id: 'contact._id',
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
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.currentAddress.keyword',
			id: 'contact.entityDetail.currentAddress',
			header: 'Current Address',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.primaryAddress.keyword',
			id: 'contact.entityDetail.primaryAddress',
			header: 'Primary Address - Full',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.address1.keyword',
			id: 'contact.entityDetail.address1',
			header: 'Primary Address 1',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.address2.keyword',
			id: 'contact.entityDetail.address2',
			header: 'Primary Address 2',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.city.keyword',
			id: 'contact.entityDetail.city',
			header: 'Primary Address City',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.state.keyword',
			id: 'contact.entityDetail.state',
			header: 'Primary Address State',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.zip.keyword',
			id: 'contact.entityDetail.zip',
			header: 'Primary Address Zip Code',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uName.keyword',
			id: 'shape.shapeJson.properties.uName',
			header: 'Unit Name',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uNumber.keyword',
			id: 'shape.shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.State.keyword',
			id: 'shape.shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			id: 'shape.shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.surveyMerdian.keyword',
			id: 'shape.shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.blockTownship.keyword',
			id: 'shape.shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.rangeSection.keyword',
			id: 'shape.shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			id: 'shape.shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uAcres.keyword',
			id: 'shape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'unitTractId.keyword',
			id: 'unitTractId',
			header: 'Unit Tract ID',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'tractAcres',
			id: 'tractAcres',
			header: 'Unit Tract Acres',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'working_interest',
			id: 'working_interest',
			header: 'WI',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'royalty_interest',
			id: 'royalty_interest',
			header: 'RI',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'orri',
			id: 'orri',
			header: 'ORRI',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'nri',
			id: 'nri',
			header: 'NRI',
			isSearchField: false,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'net_acres',
			id: 'net_acres',
			header: 'Net Acres',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'nra',
			id: 'nra',
			header: 'NRA',
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
			name: 'uUnitPricingInterest',
			id: 'uUnitPricingInterest',
			header: 'Target Price/NRA',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'max_offer_price',
			id: 'max_offer_price',
			header: 'Max Offer Price',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'uMaxUnitPricingInterest',
			id: 'uMaxUnitPricingInterest',
			header: 'Max Price/NRA',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'actual_offer_price',
			id: 'actual_offer_price',
			header: 'Actual Offer Price',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.contactStatus.keyword',
			id: 'contact.contactStatus',
			header: 'Contact Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contactOwners.keyword',
			id: 'contactOwners',
			header: 'Contact Owner',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.status.keyword',
			id: 'contact.status',
			header: 'Stage',
		},

		{
			...CommonSchema.STRING_COLUMN,
			type: 'array',
			name: 'campaigns',
			id: 'campaigns',
			header: 'Campaigns',
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.campaigns} fullWidth disabled />;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'campaignPriority.keyword',
			id: 'campaignPriority',
			header: 'Campaign Priority',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.reviewer.name.keyword',
			id: 'shape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.qualifier.name.keyword',
			id: 'shape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'deals.name.keyword',
			id: 'deals.name',
			header: 'Associated Deals',
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
			...CommonSchema.STRING_COLUMN,
			name: 'dataSource.keyword',
			id: 'dataSource',
			header: 'Data Source',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'taxYear',
			type: 'number',
			id: 'taxYear',
			header: 'Tax Year',
			isSearchField: false,
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('contact._id');
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
	],
};

export default UnitInterestMeta;
