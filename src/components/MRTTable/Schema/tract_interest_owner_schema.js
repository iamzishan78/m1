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

import { tableController, tableGlobalController } from 'hookstate/tableController';

const esIndex = 'shapeowners_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('TractPerUnitTable');
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

const TractPerUnitMeta = {
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
			accessorKey: '_id',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'ownerEntity',
			accessorKey: 'ownerEntity',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'contact.entityDetail.name.keyword',
			accessorFn: row => row?.contact?.entityDetail?.name,
			id: 'contact.entityDetail.name',
			header: 'Owner Name',
			Cell: ({ renderedCellValue, row }) => {
				// Check if the contact is purchased
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('contact.isPurchased'));
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
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.ownerType.keyword',
			id: 'contact.ownerType',
			accessorFn: row => row?.contact?.ownerType,
			header: 'Entity Type',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'surface_interest',
			accessorKey: 'surface_interest',
			header: 'Surface Interest',
			...CommonSchema.AGGREGATED_FOOTER('surface_interest', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			size: 275,
			name: 'mineral_interest',
			accessorKey: 'mineral_interest',
			header: 'Mineral Interest',
			...CommonSchema.AGGREGATED_FOOTER('mineral_interest', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nonExecRightsOnly.keyword',
			accessorKey: 'nonExecRightsOnly',
			header: 'Non-Exec Rights Only',
			id: 'nonExecRightsOnly',
			size: 200,
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			size: 275,
			name: 'royalty_interest',
			accessorKey: 'royalty_interest',
			header: 'Royalty Interest (Lease)',
			...CommonSchema.AGGREGATED_FOOTER('royalty_interest', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'orri',
			accessorKey: 'orri',
			header: 'ORRI',
			isSearchField: false,
			...CommonSchema.AGGREGATED_FOOTER('orri', 'TractPerUnitTable'),
		},

		// {
		// 	...CommonSchema.INTEREST_COLUMN,
		// 	name: 'record_title',
		// 	accessorKey: 'record_title',
		// 	header: 'Record Title',
		// },

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'operating_rights',
			accessorKey: 'operating_rights',
			header: 'Working Interest',
			...CommonSchema.AGGREGATED_FOOTER('operating_rights', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nri',
			accessorKey: 'nri',
			header: 'NRI',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'net_acres',
			accessorKey: 'net_acres',
			header: 'Net Acres',
			...CommonSchema.AGGREGATED_FOOTER('net_acres', 'TractPerUnitTable'),
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'company_net_acres',
			accessorKey: 'company_net_acres',
			header: 'Co Net Acres',
			...CommonSchema.AGGREGATED_FOOTER('company_net_acres', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			...CommonSchema.AGGREGATED_FOOTER('nra', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'offer_price_nma',
			accessorKey: 'offer_price_nma',
			header: 'Target Offer (NMA)',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'max_offer_price_nma',
			accessorKey: 'max_offer_price_nma',
			header: 'Max Offer (NMA)',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'offer_price',
			accessorKey: 'offer_price',
			header: 'Target Offer (NRA)',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'max_offer_price',
			accessorKey: 'max_offer_price',
			header: 'Max Offer (NRA)',
		},
		// Bonus payment column
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'bonus_payment',
			accessorKey: 'bonus_payment',
			header: 'Bonus Payment',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'seller_asking_price',
			accessorKey: 'seller_asking_price',
			header: 'Seller Asking Price',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'competitor_offer_price',
			accessorKey: 'competitor_offer_price',
			header: 'Competitor Offer Price',
			size: 300,
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'actual_offer_price',
			accessorKey: 'actual_offer_price',
			header: 'Actual Offer Price',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.contactStatus.keyword',
			accessorFn: row => row?.contact?.contactStatus,
			id: 'contact.contactStatus',
			header: 'Contact Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.status.keyword',
			accessorFn: row => row?.contact?.status,
			id: 'contact.status',
			header: 'Contact Stage',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactOwners.keyword',
			accessorKey: 'contactOwners',
			header: 'Contact Owner',
			Cell: ({ row }) => {
				return <div>{row?.original?.contactOwners[0]}</div>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			type: 'array',
			name: 'campaigns',
			accessorFn: row => row?.campaigns,
			id: 'campaigns',
			header: 'Campaigns',
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.campaigns} fullWidth disabled />;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignPriority.keyword',
			accessorKey: 'campaignPriority',
			header: 'Campaign Priority',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'leaseStatus.keyword',
			accessorKey: 'leaseStatus',
			header: 'Lease Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dataSource.keyword',
			accessorKey: 'dataSource',
			id: 'dataSource',
			header: 'Data Source',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			id: 'deals.name',
			accessorFn: row => row?.deals?.name,
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
			...CommonSchema.COMMON_COLUMN,
			name: 'depthFrom.keyword',
			accessorKey: 'depthFrom',
			header: 'Depth From',
			isSearchField: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthTo.keyword',
			accessorKey: 'depthTo',
			header: 'Depth To',
			isExternalFilter: false,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.isPurchased',
			accessorFn: row => row?.contact?.isPurchased,
			header: 'Purchased Data Exists',
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			Cell: ({ row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('contact.isPurchased'));
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
			accessorKey: 'isContact',
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
					/>
				);
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const name = row.getValue('name');

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="dialog" />;
			},
		},

		{
			...CommonSchema.HIDDEN,
			name: 'contact.isPurchased',
			accessorKey: 'contact.isPurchased',
		},
	],
};

export default TractPerUnitMeta;
