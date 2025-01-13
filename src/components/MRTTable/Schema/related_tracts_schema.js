/* eslint-disable react/prop-types */
import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

const esIndex = 'shapeowners_flat';

const RelatedTractsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
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
			name: 'tract.name.keyword',
			id: 'tract.name',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/parcels/${row?.original?.tractId}`} />
				</div>
			),
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.state.keyword',
			id: 'tract.state',
			header: 'State',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.county.keyword',
			id: 'tract.county',
			header: 'County',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.basin.keyword',
			id: 'tract.basin',
			header: 'Basin',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.field.keyword',
			id: 'tract.field',
			header: 'Field',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.survey.keyword',
			id: 'tract.survey',
			header: 'Survey/ Meridian',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.block.keyword',
			id: 'tract.block',
			header: 'Block/ Township',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.section.keyword',
			id: 'tract.section',
			header: 'Section/ Range',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.abstract.keyword',
			id: 'tract.abstract',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.qtr.keyword',
			id: 'tract.qtr',
			header: 'QTR Calls',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.name.keyword',
			id: 'contact.entityDetail.name',
			header: 'Name',
			size: 450,
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/contact/details/${row?.original?.contact?._id}`} />
				</div>
			),
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'mineral_interest',
			id: 'mineral_interest',
			header: 'Mineral Interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'royalty_interest',
			id: 'royalty_interest',
			header: 'Royality Interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'orri',
			id: 'orri',
			header: 'ORRI',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'working_interest',
			id: 'working_interest',
			header: 'Working Interest',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'tract.sdGrossAcres.keyword',
			id: 'tract.sdGrossAcres',
			header: 'Gross Acres',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'net_acres',
			id: 'net_acres',
			header: 'Net Acres',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'company_net_acres',
			id: 'company_net_acres',
			header: 'Co Net Acres',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nra',
			id: 'nra',
			header: 'NRA',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'acquisition_nra',
			id: 'acquisition_nra',
			header: 'Acquisition $/NRA',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'acquisition_cost',
			id: 'acquisition_cost',
			header: 'Acquisition Cost',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'depthFrom.keyword',
			id: 'depthFrom',
			header: 'Depth From',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'depthTo.keyword',
			id: 'depthTo',
			header: 'Depth To',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'tractStatus.keyword',
			id: 'tractStatus',
			header: 'Tract Status',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.department.keyword',
			id: 'shape.shapeJson.properties.department',
			header: 'Department',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'mapStatus.keyword',
			id: 'mapStatus',
			header: 'Map Status',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'countAcres.keyword',
			id: 'countAcres',
			header: 'Count Acres',
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				const targetLabel = 'parcel';
				return (
					<CommentCell
						id={id}
						value={renderedCellValue.length}
						targetLabel={targetLabel}
						tableKey={'RelatedTractsTable'}
					/>
				);
			},
		},
	],
};

export default RelatedTractsMeta;
