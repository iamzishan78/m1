/* eslint-disable react/prop-types */
import React from 'react';

import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';

import ListChips from 'components/Common/ListChips';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TractInterestOwnerToolBar from 'components/MRTTable/TablesOverride/TractInterestOwnerTable/TractInterestOwnerToolBar';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import TractIcon from 'components/Shared/svgIcons/tract';

import { tableController, tableGlobalController } from 'controllers/tableController';

const esIndex = 'shapeowners_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('TractInterestOwnerTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addTractInterest',
			customLayerId: customLayer?._id,
			customLayer,
			selectedRow,
		},
	});
};

const TractInterestOwnerMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	gridViewSettings: {
		label: 'Tract Owners',
		module: 'TractOwner',
		Icon: TractIcon,
		defaultView: {
			name: 'All Tract Owners',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Tract Owner') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '300px',
			left: '300px',
		},
	},
	CustomToolBar: TractInterestOwnerToolBar,
	onClickedRow,
	defaultSort: { field: '_ts', order: 'asc' },
	maxTableHeight: 'calc(100vh - 461px)',
	height: '700px',
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
			name: 'ownerEntity',
			id: 'ownerEntity',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'contact.entityDetail.name.keyword',
			id: 'contact.entityDetail.name',
			header: 'Owner Name',
			Cell: ({ renderedCellValue, row }) => {
				// Check if the contact is purchased
				const isPurchased = [true, 'true', 'True'].includes(row?.original?.isPurchased);
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<p
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								minWidth: '300px',
								marginLeft: '10px',
							}}
						>
							<ColumnWithLink
								value={renderedCellValue}
								link={`/contact/details/${row.getValue('ownerEntity')}`}
								onClick={e => {
									e.stopPropagation();
								}}
							/>
							{isPurchased && (
								<FeatureFlag feature={FEATURES.IDICORE}>
									<MonetizationOnIcon
										style={{
											marginLeft: '10px',
											color: 'gray',
										}}
									/>
								</FeatureFlag>
							)}
							{/* check if agreement record is present and not deleted */}
							{/* functionality not working properly commenting this code until further notice */}
							{/* {!row?.original?.agreement?.IsDeleted && row?.original?.agreement?._id && (
								<div
									style={{ marginLeft: '15px', cursor: 'pointer', position: 'absolute', right: 0, marginRight: '15px' }}
									onClick={e => {
										e.stopPropagation();
										history.push(`/land/agreement/details/${row?.original?.agreement?._id}`);
									}}
								>
									<AgreementIcon color={'#17aadd'} />
								</div>
							)} */}
						</p>
					</div>
				);
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.ownerType.keyword',
			id: 'contact.ownerType',
			header: 'Entity Type',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'surface_interest',
			id: 'surface_interest',
			header: 'Surface Interest',
			...CommonSchema.AGGREGATED_FOOTER('surface_interest', 'TractInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			size: 275,
			name: 'mineral_interest',
			id: 'mineral_interest',
			header: 'Mineral Interest',
			...CommonSchema.AGGREGATED_FOOTER('mineral_interest', 'TractInterestOwnerTable'),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'nonExecRightsOnly.keyword',
			id: 'nonExecRightsOnly',
			header: 'Non-Exec Rights Only',
			size: 200,
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			size: 275,
			name: 'royalty_interest',
			id: 'royalty_interest',
			header: 'Royalty Interest (Lease)',
			...CommonSchema.AGGREGATED_FOOTER('royalty_interest', 'TractInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'orri',
			id: 'orri',
			header: 'ORRI',
			isSearchField: false,
			...CommonSchema.AGGREGATED_FOOTER('orri', 'TractInterestOwnerTable'),
		},

		// {
		// 	...CommonSchema.INTEREST_COLUMN,
		// 	name: 'record_title',
		// 	id: 'record_title',
		// 	header: 'Record Title',
		// },

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'operating_rights',
			id: 'operating_rights',
			header: 'Working Interest',
			...CommonSchema.AGGREGATED_FOOTER('operating_rights', 'TractInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nri',
			id: 'nri',
			header: 'NRI',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'net_acres',
			id: 'net_acres',
			header: 'Net Acres',
			...CommonSchema.AGGREGATED_FOOTER('net_acres', 'TractInterestOwnerTable'),
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'company_net_acres',
			id: 'company_net_acres',
			header: 'Co Net Acres',
			...CommonSchema.AGGREGATED_FOOTER('company_net_acres', 'TractInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nra',
			id: 'nra',
			header: 'NRA',
			...CommonSchema.AGGREGATED_FOOTER('nra', 'TractInterestOwnerTable'),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'offer_price_nma',
			id: 'offer_price_nma',
			header: 'Target Offer (NMA)',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'max_offer_price_nma',
			id: 'max_offer_price_nma',
			header: 'Max Offer (NMA)',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'offer_price',
			id: 'offer_price',
			header: 'Target Offer (NRA)',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'max_offer_price',
			id: 'max_offer_price',
			header: 'Max Offer (NRA)',
		},
		// Bonus payment column
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'bonus_payment',
			id: 'bonus_payment',
			header: 'Bonus Payment',
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
			size: 300,
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
			name: 'contact.status.keyword',
			id: 'contact.status',
			header: 'Contact Stage',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'contactOwners.keyword',
			id: 'contactOwners',
			header: 'Contact Owner',
			Cell: ({ row }) => {
				return <div>{row?.original?.contactOwners[0]}</div>;
			},
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
			name: 'leaseStatus.keyword',
			id: 'leaseStatus',
			header: 'Lease Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'dataSource.keyword',
			id: 'dataSource',
			header: 'Data Source',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'deals.name.keyword',
			id: 'deals.name',
			isExport: 'dealsName',
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
			...CommonSchema.STRING_COLUMN,
			name: 'depthFrom.keyword',
			id: 'depthFrom',
			header: 'Depth From',
			isSearchField: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'depthTo.keyword',
			id: 'depthTo',
			header: 'Depth To',
			isExternalFilter: false,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'isPurchased',
			id: 'isPurchased',
			header: 'Purchased Data Exists',
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			type: 'boolean',
			Cell: ({ row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('isPurchased'));

				return <>{isPurchased ? 'Yes' : 'No'}</>;
			},
			isSearchField: false,
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
			...CommonSchema.ACTION_COLUMN,
			name: 'isContact',
			id: 'isContact',
			Cell: ({ row }) => {
				const ownerEntity = row.getValue('ownerEntity');
				return <IsContactCell contactId={ownerEntity} />;
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ row }) => {
				const id = row.getValue('ownerEntity');
				return (
					<CommentCell
						id={id}
						value={row?.original?.commentsCount}
						targetLabel={'Parcel Ownership'}
						hideShareCommentsToggle
						type={'commentsWithTags'}
					/>
				);
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			id: 'actionMenu',
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const name = row.getValue('name');

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="dialog" />;
			},
		},

		{
			...CommonSchema.HIDDEN,
			name: 'contact.isPurchased',
			id: 'contact.isPurchased',
		},
	],
};

export default TractInterestOwnerMeta;
