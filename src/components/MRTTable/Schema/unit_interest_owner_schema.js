/* eslint-disable react/prop-types */
import React from 'react';

import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';

import { isEmpty, pickBy } from 'lodash';

import ListChips from 'components/Common/ListChips';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import Loaders from 'components/Loaders';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import OwnersPerUnitToolBar from 'components/MRTTable/TablesOverride/OwnersPerUnit/OwnersPerUnitToolBar';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import UnitIcon from 'components/Shared/svgIcons/unit';

import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { copy } from 'utils/helper';

const esIndex = 'shapeowners_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		const user = globalStateController.getValue('user');
		Loaders.createToast(loaderId, 'Updation in Progress');

		const customData = copy(row?.custom_data) ?? {};
		const filteredCustomData = pickBy(customData, value => value !== '' && !isEmpty(value));

		const shapeOwners = {
			_id: row._id,
			custom_data: {
				...filteredCustomData,
				[item.name]: value,
			},
		};

		await client.mutate({
			variables: {
				shapeOwners,
				shapeType: 'Unit',
				userId: user._id,
			},
			mutation: UPDATE_SHAPE_OWNERS,
			refetchQueries: ['getDbFilters'],
		});

		Loaders.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch {
		Loaders.errorToast(loaderId, 'Failed to Update');
	}
};

const onClickedRow = selectedRow => {
	const Controller = tableController('UnitInterestOwnerTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addOwnerToUnit',
			shapeId: customLayer?._id,
			uAcres: customLayer?.shapeJson?.properties?.uAcres,
			uUnitPricing: customLayer?.shapeJson?.properties?.uUnitPricing,
			uMaxUnitPricing: customLayer?.shapeJson?.properties?.uMaxUnitPricing,
			shapeType: 'Unit',
			selectedRow,
		},
	});
};

const UnitInterestOwnerMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	gridViewSettings: {
		label: 'Unit Owners',
		module: 'UnitOwner',
		Icon: UnitIcon,
		defaultView: {
			name: 'All Unit Owners',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Unit Owner') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '325px',
			left: '300px',
		},
	},
	fetchMetaData: {
		category: 'Unit Interest Owners', // enable to show custom field inside unit grid
	},
	CustomToolBar: OwnersPerUnitToolBar,
	onClickedRow,
	onCustomKeyChange,
	defaultSort: { field: '_ts', order: 'asc' },
	maxTableHeight: 'calc(100vh - 489px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	deletedKeys: {
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' },
	},
	defaultFlterMode: 'multiselect',
	isShowActionMenuFirst: true,
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
			isExport: 'name',
			header: 'Owner Name',
			Cell: ({ renderedCellValue, row }) => {
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
										data-testid="monetization-icon"
										style={{
											marginLeft: '10px',
											color: 'gray',
										}}
									/>
								</FeatureFlag>
							)}
						</p>
					</div>
				);
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
			header: 'Primary Address',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uName.keyword',
			id: 'shape.shapeJson.properties.uName',
			header: 'Unit Name',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uNumber.keyword',
			id: 'shape.shapeJson.properties.uNumber',
			header: 'Unit #',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.StateAbbreviation.keyword',
			id: 'shape.shapeJson.properties.originalProperties.StateAbbreviation',
			header: 'State',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			id: 'shape.shapeJson.properties.originalProperties.County',
			header: 'County',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uAcres.keyword',
			id: 'shape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.ownerType.keyword',
			id: 'contact.ownerType',
			header: 'Entity Type',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'working_interest',
			id: 'working_interest',
			header: 'Working Interest',
			...CommonSchema.AGGREGATED_FOOTER('working_interest', 'UnitInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'royalty_interest',
			id: 'royalty_interest',
			header: 'Royalty Interest',
			...CommonSchema.AGGREGATED_FOOTER('royalty_interest', 'UnitInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'orri',
			id: 'orri',
			header: 'ORRI',
			...CommonSchema.AGGREGATED_FOOTER('orri', 'UnitInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nri',
			id: 'nri',
			header: 'NRI',
			...CommonSchema.AGGREGATED_FOOTER('nri', 'UnitInterestOwnerTable'),
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'net_acres',
			id: 'net_acres',
			header: 'Net Acres',
			...CommonSchema.AGGREGATED_FOOTER('net_acres', 'UnitInterestOwnerTable'),
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nra',
			id: 'nra',
			header: 'NRA',
			...CommonSchema.AGGREGATED_FOOTER('nra', 'UnitInterestOwnerTable'),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'unitTractId.keyword',
			id: 'unitTractId',
			header: 'Unit Tract ID',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'tractAcres',
			id: 'tractAcres',
			header: 'Unit Tract Acres',
			...CommonSchema.AGGREGATED_FOOTER('tractAcres', 'UnitInterestOwnerTable'),
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
			name: 'uUnitPricingInterest',
			id: 'uUnitPricingInterest',
			header: 'Target Price/NRA',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'offer_price',
			id: 'offer_price',
			header: 'Target Offer Price',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'uMaxUnitPricingInterest',
			id: 'uMaxUnitPricingInterest',
			header: 'Max Price/NRA',
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
			name: 'contact.homePhone.keyword',
			id: 'contact.homePhone',
			header: 'Contact Home Phone 1',
			size: 275,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.mobilePhone.keyword',
			id: 'contact.mobilePhone',
			header: 'Contact Mobile Phone 1',
			size: 275,
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
			header: 'Campaign Priority 1',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.reviewer.name.keyword',
			id: 'shape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.qualifier.name.keyword',
			id: 'shape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
			isHiddenFieldExport: true,
			hidden: true,
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
			...CommonSchema.STRING_COLUMN,
			name: 'deals.name.keyword',
			id: 'deals.name',
			header: 'Associated Deals',
			handleArrayExport: {
				esType: 'collection',
				actualKey: 'name',
			},
			isSearchField: false,
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
			name: 'isPurchased',
			accessorFn: row => row?.isPurchased,
			header: 'Purchased Data Exists',
			id: 'isPurchased',
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
						targetLabel={'Unit Ownership'}
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
						targetLabel={'Unit Ownership'}
						hideShareCommentsToggle
					/>
				);
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			isPinned: true, // pin action column so it can be moved at first position
			showInLast: false,
			size: 80,
			name: 'actionMenu',
			id: 'actionMenu',
			Cell: ({ row }) => {
				const name = row.getValue('name');
				const contactId = row.getValue('ownerEntity');

				return <ContactActionMenu id={contactId} name={name} esIndex={esIndex} dialogType="dialog" />;
			},
		},
	],
};

export default UnitInterestOwnerMeta;
