/* eslint-disable react/prop-types */
import React from 'react';

import { Box } from '@mui/material';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import { INTEREST_TO_FIXED } from 'utils/consts';

const esIndex = 'propertyinterest_flat';

const PropertyInterestMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: 'property.name.keyword', order: 'asc' },
	maxTableHeight: 'calc(100vh - 330px)',
	isInFiniteScroll: true,
	// columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'property._id',
			id: 'property._id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property',
			isGrouped: true, // Group by property
			Cell: ({ row }) => {
				const id = row.getValue('property._id');
				const value = row.getValue('property.name') || row.getValue('property.number');

				if (!id) {
					return value || null;
				}

				return <ColumnWithLink value={value} link={`property/details/${id}`} onClick={() => {}} />;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.number.keyword',
			id: 'property.number',
			header: 'Operator Property #',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.operator.name.keyword',
			id: 'property.operator.name',
			header: 'Operator',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.purchaser.name.keyword',
			id: 'property.purchaser.name',
			header: 'Payor',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.purchaserNumber.keyword',
			id: 'property.purchaserNumber',
			header: 'Payor Property #',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'status.keyword',
			id: 'status',
			header: 'Status',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'interestType.keyword',
			id: 'interestType',
			header: 'Interest Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'interestAmount',
			id: 'interestAmount',
			header: 'Interest Amount',
			isSearchField: false,
			type: 'number',
			aggregationFn: 'sum',
			AggregatedCell: ({ cell, table }) => (
				<>
					Interest by {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:
					<Box
						sx={{
							color: 'info.main',
							display: 'inline',
							fontWeight: 'bold',
							paddingLeft: '0.3rem',
						}}
					>
						{parseFloat(cell.getValue().toFixed(INTEREST_TO_FIXED))}
					</Box>
				</>
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'costFree.keyword',
			id: 'costFree',
			header: 'Cost Free',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'effectiveDate',
			id: 'effectiveDate',
			header: 'Effective Date',
			type: 'date',
			Cell: ({ row }) => <>{formatDate(row.original.effectiveDate)}</>,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.state.keyword',
			id: 'property.state',
			header: 'State',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.county.keyword',
			id: 'property.county',
			header: 'County',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'ownerName.keyword',
			id: 'ownerName',
			header: 'Owner',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.legalDescription.keyword',
			id: 'property.legalDescription',
			header: 'Description',
		},
	],
};

export default PropertyInterestMeta;
