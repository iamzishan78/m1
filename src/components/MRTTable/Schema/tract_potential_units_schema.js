/* eslint-disable react/prop-types */
import React from 'react';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import TractPotentialUnitsToolbar from 'components/MRTTable/TablesOverride/TractPotentialUnitsTable/TractPotentialUnitsToolbar';

import { CommonSchema } from './common_schema';

const esIndex = 'shapes_flat';

const TractPotentialUnitsMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	CustomToolBar: TractPotentialUnitsToolbar,
	defaultSort: { field: '_ts', order: 'asc' },
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	isDeleteDisabled: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
		},

		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			name: '_id.keyword',
			id: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			id: 'name',
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/units/${row.getValue('_id')}`} />
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uNumber.keyword',
			id: 'shapeJson.properties.uNumber',
			header: 'Unit Number',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uType.keyword',
			id: 'shapeJson.properties.uType',
			header: 'Unit Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uAcres.keyword',
			id: 'shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uStatus.keyword',
			id: 'shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uPrimaryOperator.keyword',
			id: 'shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shapeJson.properties.uUnitPricing.keyword',
			id: 'shapeJson.properties.uUnitPricing',
			header: 'Target Unit Pricing (Per NRA)',
			size: 320,
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shapeJson.properties.uMaxUnitPricing.keyword',
			id: 'shapeJson.properties.uMaxUnitPricing',
			header: 'Max Unit Pricing (Per NRA)',
			size: 320,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.qualifier.name.keyword',
			id: 'shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.reviewer.name.keyword',
			id: 'shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			type: 'array',
			name: 'shapeJson.properties.campaigns.keyword',
			id: 'shapeJson.properties.campaigns',
			header: 'Campaigns',
			size: 270,
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.shapeJson?.properties?.campaigns} fullWidth disabled />;
			},
		},
	],
};

export default TractPotentialUnitsMeta;
