/* eslint-disable react/prop-types */
import React from 'react';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import TractRelatedUnitsToolbar from 'components/MRTTable/TablesOverride/TractRelatedUnitsTable/TractRelatedUnitsToolbar';

import { CommonSchema } from './common_schema';

const esIndex = 'shapetracts_flat';

const TractUnitsMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	CustomToolBar: TractRelatedUnitsToolbar,
	defaultSort: { field: '_ts', order: 'asc' },
	height: '700px',
	isInFiniteScroll: true,
	columnVirtualization: true,
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
			name: 'shape._id.keyword',
			id: 'shape._id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'shape.name.keyword',
			id: 'shape.name',
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/units/${row.getValue('shape._id')}`} />
				</div>
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uNumber.keyword',
			id: 'shape.shapeJson.properties.uNumber',
			header: 'Unit Number',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uType.keyword',
			id: 'shape.shapeJson.properties.uType',
			header: 'Unit Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uAcres.keyword',
			id: 'shape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uStatus.keyword',
			id: 'shape.shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.uPrimaryOperator.keyword',
			id: 'shape.shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uUnitPricing.keyword',
			id: 'shape.shapeJson.properties.uUnitPricing',
			header: 'Target Unit Pricing (Per NRA)',
			size: 320,
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uMaxUnitPricing.keyword',
			id: 'shape.shapeJson.properties.uMaxUnitPricing',
			header: 'Max Unit Pricing (Per NRA)',
			size: 320,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.qualifier.name.keyword',
			id: 'shape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.reviewer.name.keyword',
			id: 'shape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},
		{
			...CommonSchema.STRING_COLUMN,
			type: 'array',
			name: 'shape.shapeJson.properties.campaigns.keyword',
			id: 'shape.shapeJson.properties.campaigns',
			header: 'Campaigns',
			size: 270,
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.shape?.shapeJson?.properties?.campaigns} fullWidth disabled />;
			},
		},
	],
};

export default TractUnitsMeta;
