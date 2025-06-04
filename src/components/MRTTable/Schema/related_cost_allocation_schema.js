import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import { TO_FIXED } from 'utils/consts';

import RelatedCostAllocationsToolbar from '../TablesOverride/RelatedCostAllocationsTable/RelatedCostAllocationsToolbar';

const esIndex = 'properties_flat';

// Related Cost Allocations Meta
const RelatedCostAllocationsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: '30vh',
	CustomToolBar: RelatedCostAllocationsToolbar,
	isInFiniteScroll: true,
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
			name: 'number.keyword',
			id: 'number',
			header: 'Property #',
			Cell: ({ row }) => {
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							onClick={e => {
								e.stopPropagation();
							}}
							value={row.getValue('number') || '-'}
							link={`/revenue/property/details/${row.getValue('_id')}`}
						/>
					</div>
				);
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'name.keyword',
			id: 'name',
			header: 'Property Name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'costAllocations.allocation.keyword',
			id: 'costAllocations.allocation',
			header: 'Cost Allocation',
			type: 'number',
			isArrayKey: true,
			Cell: ({ row }) => {
				const value = row.original?.costAllocations?.allocation;
				return value ? `${Number(value).toFixed(TO_FIXED)}%` : value === 0 ? '0%' : '';
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'costAllocations.amount.keyword',
			id: 'costAllocations.amount',
			header: 'Cost Allocation Amount',
			type: 'number',
			isArrayKey: true,
		},
	],
};

export default RelatedCostAllocationsMeta;
