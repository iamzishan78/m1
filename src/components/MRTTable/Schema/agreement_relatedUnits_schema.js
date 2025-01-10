/* eslint-disable react/prop-types */
import React from 'react';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

// Elastic search index
const esIndex = 'relatedshapes_flat';

// Grid schema
const UnitMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	maxTableHeight: 'calc(100vh - 215px)',
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
			...CommonSchema.INITAIL_PINNED,
			name: 'relatedShape.name.keyword',
			id: 'relatedShape.name',
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/units/${row.original?.relatedShape?._id}`} />
				</div>
			),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.uNumber.keyword',
			id: 'relatedShape.shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.State.keyword',
			id: 'relatedShape.shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.County.keyword',
			id: 'relatedShape.shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.surveyMerdian.keyword',
			id: 'relatedShape.shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.blockTownship.keyword',
			id: 'relatedShape.shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.rangeSection.keyword',
			id: 'relatedShape.shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			id: 'relatedShape.shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.uAcres.keyword',
			id: 'relatedShape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.uStatus.keyword',
			id: 'relatedShape.shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.uPrimaryOperator.keyword',
			id: 'relatedShape.shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.uUnitPricing.keyword',
			id: 'relatedShape.shapeJson.properties.uUnitPricing',
			header: 'Target Price/Acre',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.uMaxUnitPricing.keyword',
			id: 'relatedShape.shapeJson.properties.uMaxUnitPricing',
			header: 'Max Price/Acre',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'interestSummary.unitInterestCount',
			id: 'interestSummary.unitInterestCount',
			header: 'Owner Count',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			type: 'array',
			name: 'relatedShape.shapeJson.properties.campaigns.keyword',
			id: 'relatedShape.shapeJson.properties.campaigns',
			header: 'Campaigns',
			size: 270,
			Cell: ({ row }) => {
				return (
					<CampaignField value={row?.original?.relatedShape?.shapeJson?.properties?.campaigns} fullWidth disabled />
				);
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.qualifier.name.keyword',
			id: 'relatedShape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatedShape.shapeJson.properties.reviewer.name.keyword',
			id: 'relatedShape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: '_ts',
			id: '_ts',
			header: 'Last Updated',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => <div>{formatDate(row.getValue('_ts'))}</div>,
		},
	],
};

export default UnitMeta;
