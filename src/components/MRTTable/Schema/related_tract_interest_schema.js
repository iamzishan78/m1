/* eslint-disable react/prop-types */
import React from 'react';

import ListChips from 'components/Common/ListChips';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';

import { CommonSchema } from './common_schema';

const esIndex = 'shapeowners_flat';

const RelatedTractInterestMeta = {
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
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'customLayerId.keyword',
			header: 'Custom Layer ID',
			id: 'customLayerId',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'ownerEntity',
			header: 'Owner Entity',
			id: 'ownerEntity',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'shape.shapeJson.properties.shapeLabel.keyword',
			id: 'shape.shapeJson.properties.shapeLabel',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue}
						link={`/map/parcels/${row?.original?.shape?._id}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				</div>
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.State.keyword',
			header: 'State',
			id: 'shape.shapeJson.properties.originalProperties.State',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			header: 'County',
			id: 'shape.shapeJson.properties.originalProperties.County',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.Survey.keyword',
			header: 'Survey/ Meridian',
			id: 'shape.shapeJson.properties.originalProperties.Survey',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.Block.keyword',
			header: 'Block/ Township',
			id: 'shape.shapeJson.properties.originalProperties.Block',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.Section.keyword',
			header: 'Section/ Range',
			id: 'shape.shapeJson.properties.originalProperties.Section',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.AbstractName.keyword',
			header: 'Abstract/ Section',
			id: 'shape.shapeJson.properties.originalProperties.AbstractName',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'qtr.keyword',
			header: 'QTR Calls',
			id: 'qtr',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.sdGrossAcres.keyword',
			header: 'Gross Acres',
			id: 'shape.shapeJson.properties.sdGrossAcres',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'depthFrom.keyword',
			header: 'Depth From',
			id: 'depthFrom',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'depthTo.keyword',
			header: 'Depth To',
			id: 'depthTo',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'contact.entityDetail.name.keyword',
			header: 'Owner Name',
			id: 'contact.entityDetail.name',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'surface_interest',
			header: 'Surface Interest',
			id: 'surface_interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'mineral_interest',
			header: 'Mineral Interest',
			id: 'mineral_interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'royalty_interest',
			header: 'Royalty Interest',
			id: 'royalty_interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'orri',
			header: 'ORRI',
			id: 'orri',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'working_interest',
			id: 'working_interest',
			header: 'Working Interest',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'net_acres',
			header: 'Net Acres',
			id: 'net_acres',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'nra',
			header: 'NRA',
			id: 'nra',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.department.keyword',
			header: 'Department',
			id: 'shape.shapeJson.properties.department',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'deals.name.keyword',
			id: 'deals.name',
			header: 'Associated Deals',
			isExport: 'deals',
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
			...CommonSchema.COMMENTS,
			Cell: ({ row }) => {
				const id = row.getValue('ownerEntity');
				return <CommentCell id={id} value={row?.original?.commentsCount} targetLabel={'Parcel Ownership'} />;
			},
		},
	],
};

export default RelatedTractInterestMeta;
