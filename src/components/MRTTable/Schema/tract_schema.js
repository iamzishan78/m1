/* eslint-disable react/prop-types */
import React from 'react';

import _ from 'lodash';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import Loader from 'components/Loaders';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TractIcon from 'components/Shared/svgIcons/tract';

import { globalStateController } from 'controllers/globalStateController';
import { tableGlobalController } from 'controllers/tableController';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';

import { copy } from 'utils/helper';

const esIndex = 'shapes_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		Loader.createToast(loaderId, 'Updation in Progress');
		const user = globalStateController.getValue('user');

		const customData = copy(row?.shapeJson?.properties?.custom_data) ?? {};
		const filteredCustomData = _.pickBy(customData, value => value !== '' && !_.isEmpty(value));

		const shapeJson = {
			...row?.shapeJson,
			properties: {
				...row?.shapeJson?.properties,
				custom_data: {
					...filteredCustomData,
					[item.name]: value,
				},
			},
		};

		await client.mutate({
			variables: {
				customLayerId: row?._id,
				userId: user?._id,
				customLayer: {
					shape: JSON.stringify(shapeJson),
					shapeJson,
				},
			},
			mutation: UPDATECUSTOMLAYER,
			refetchQueries: ['getDbFilters'],
		});
		Loader.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch {
		Loader.errorToast(loaderId, 'Updation in Complete');
	}
};

const TractMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	// Grid views for tract
	gridViewSettings: {
		label: 'Tracts',
		module: 'Tracts',
		Icon: TractIcon,
		defaultView: {
			name: 'All Tracts',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Tracts') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '340px',
			left: '225px',
		},
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'layer.keyword', value: 'parcel' }],
	maxTableHeight: 'calc(100vh - 450px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	onCustomKeyChange,
	// get metadata for the grid
	fetchMetaData: {
		category: 'Parcel',
	},
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
		},
		// M1neral System ID field added
		{
			...CommonSchema.MONGO_ID, // Mongo Id Column
			name: '_id',
			id: '_id',
			header: 'M1neral System ID',
			isHiddenFieldExport: true,
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			id: 'name',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue || row.getValue('shapeJson.properties.originalProperties.State')}
						link={`/map/parcels/${row.getValue('_id')}`}
					/>
				</div>
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.State.keyword',
			id: 'shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.County.keyword',
			id: 'shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.surveyMerdian.keyword',
			id: 'shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.blockTownship.keyword',
			id: 'shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.rangeSection.keyword',
			id: 'shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			id: 'shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.Grantee',
			id: 'shapeJson.properties.originalProperties.Grantee',
			header: 'Alt Survey',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.sdGrossAcres',
			id: 'shapeJson.properties.sdGrossAcres',
			header: 'Gross Acres',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.shapeArea.keyword',
			id: 'shapeJson.properties.shapeArea',
			header: 'Calc Acres',
		},
		// Added tract NRA column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.netRoyalityAcres.calculatedNra',
			id: 'shapeJson.properties.netRoyalityAcres.calculatedNra',
			header: 'Tract NRA',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.execNetAcres',
			id: 'shapeJson.properties.execNetAcres',
			header: 'Exec Net Acres',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.nonExecNetAcres',
			id: 'shapeJson.properties.nonExecNetAcres',
			header: 'Non-Exec Net Acres',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shapeJson.properties.uUnitPricingNMA.keyword',
			id: 'shapeJson.properties.uUnitPricingNMA',
			header: 'Target Pricing (per NMA)',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shapeJson.properties.uMaxUnitPricingNMA.keyword',
			id: 'shapeJson.properties.uMaxUnitPricingNMA',
			header: 'Max Pricing (per NMA)',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shapeJson.properties.uUnitPricing.keyword',
			id: 'shapeJson.properties.uUnitPricing',
			header: 'Target Pricing (per NRA)',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shapeJson.properties.uMaxUnitPricing.keyword',
			id: 'shapeJson.properties.uMaxUnitPricing',
			header: 'Max Pricing (per NRA)',
		},
		// {
		// 	...CommonSchema.STRING_COLUMN,
		// 	name: 'shapeJson.properties.department.keyword',
		// 	id: 'shapeJson.properties.department',
		// 	header: 'Department',
		// },
		{
			...CommonSchema.STRING_COLUMN,
			type: 'array',
			name: 'shapeJson.properties.campaigns.keyword',
			id: 'shapeJson.properties.campaigns',
			header: 'Campaigns',
			size: 270,
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.shapeJson?.properties?.campaigns} fullWidth disabled />;
			},
		},
		// Department column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.department.keyword',
			id: 'shapeJson.properties.department',
			header: 'Department',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.ownerName.keyword',
			id: 'shapeJson.properties.ownerName',
			header: 'Owner',
		},
		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				const targetLabel = 'parcel';
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={targetLabel}
					/>
				);
			},
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

export default TractMeta;
