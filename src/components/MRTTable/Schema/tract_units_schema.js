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
			accessorKey: 'id',
		},

		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'shape._id.keyword',
			accessorFn: row => row?.shape?._id,
			id: 'shape._id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'shape.name.keyword',
			accessorKey: 'shape.name',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uNumber.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.uNumber,
			id: 'shape.shapeJson.properties.uNumber',
			header: 'Unit Number',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uType.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.uType,
			id: 'shape.shapeJson.properties.uType',
			header: 'Unit Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.uAcres,
			id: 'shape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uStatus.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.uStatus,
			id: 'shape.shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uPrimaryOperator.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.uPrimaryOperator,
			id: 'shape.shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uUnitPricing.keyword',
			accessorKey: 'shape.shapeJson.properties.uUnitPricing',
			id: 'shape.shapeJson.properties.uUnitPricing',
			header: 'Target Unit Pricing (Per NRA)',
			size: 320,
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shape.shapeJson.properties.uMaxUnitPricing.keyword',
			accessorKey: 'shape.shapeJson.properties.uMaxUnitPricing',
			id: 'shape.shapeJson.properties.uMaxUnitPricing',
			header: 'Max Unit Pricing (Per NRA)',
			size: 320,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.qualifier.name.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.qualifier?.name,
			id: 'shape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.reviewer.name.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.reviewer?.name,
			id: 'shape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			type: 'array',
			name: 'shape.shapeJson.properties.campaigns.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.campaigns,
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
