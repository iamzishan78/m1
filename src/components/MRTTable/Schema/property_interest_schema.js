/* eslint-disable react/prop-types */
import React from 'react';

import { Box } from '@mui/material';

import { get } from 'lodash';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import { TO_FIXED } from 'utils/consts';

const esIndex = 'propertyinterest_flat';

const PropertyIntrestMeta = {
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
			accessorFn: row => get(row, 'property._id'),
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'property.name.keyword',
			id: 'property.name',
			accessorFn: row => get(row, 'property.name'),
			header: 'Property',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'property.number.keyword',
			id: 'property.number',
			accessorFn: row => get(row, 'property.number'),
			header: 'Operator Property #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.operator.name.keyword',
			id: 'property.operator.name',
			accessorFn: row => get(row, 'property.operator.name'),
			header: 'Operator',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.purchaser.name.keyword',
			id: 'property.purchaser.name',
			accessorFn: row => get(row, 'property.purchaser.name'),
			header: 'Payor',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.purchaserNumber.keyword',
			id: 'property.purchaserNumber',
			accessorFn: row => get(row, 'property.purchaserNumber'),
			header: 'Payor Property #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			id: 'status',
			accessorFn: row => get(row, 'status'),
			header: 'Status',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestType.keyword',
			id: 'interestType',
			accessorFn: row => get(row, 'interestType'),
			header: 'Interest Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestAmount',
			id: 'interestAmount',
			accessorFn: row => get(row, 'interestAmount'),
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
						{parseFloat(cell.getValue().toFixed(TO_FIXED))}
					</Box>
				</>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'costFree.keyword',
			id: 'costFree',
			accessorFn: row => get(row, 'costFree'),
			header: 'Cost Free',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'effectiveDate',
			id: 'effectiveDate',
			accessorFn: row => get(row, 'effectiveDate'),
			header: 'Effective Date',
			type: 'date',
			Cell: ({ row }) => <>{formatDate(row.original.effectiveDate)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.state.keyword',
			id: 'property.state',
			accessorFn: row => get(row, 'property.state'),
			header: 'State',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.county.keyword',
			id: 'property.county',
			accessorFn: row => get(row, 'property.county'),
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerName.keyword',
			id: 'ownerName',
			accessorFn: row => get(row, 'ownerName'),
			header: 'Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.legalDescription.keyword',
			id: 'property.legalDescription',
			accessorFn: row => get(row, 'property.legalDescription'),
			header: 'Description',
		},
	],
};

export default PropertyIntrestMeta;
