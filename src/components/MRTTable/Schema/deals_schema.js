 
import React from 'react';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import DealsToolbar from 'components/MRTTable/TablesOverride/RelatedDeals/Toolbar';
import { formatDate } from 'components/Shared/functions';

const DealsMeta = {
	maxTableHeight: 'calc(100vh - 250px)',
	isDeleteDisabled: true,
	isInFiniteScroll: true,
	columnVirtualization: true,
	modelName: 'Deal',
	defaultSort: { field: 'lastUpdateAt', order: 'desc', unmapped_type: 'date' },
	CustomToolBar: DealsToolbar,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Deal Name',
			id: 'name',
			name: 'name.keyword',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Offer Price',
			id: 'offerPrice',
			name: 'offerPrice',
		},
		{
			...CommonSchema.STRING_COLUMN,
			type: 'date',
			header: 'Deal Received',
			id: 'receivedDate',
			name: 'receivedDate',
			Cell: ({ row }) => {
				return <>{formatDate(row.original?.receivedDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			type: 'date',
			header: 'Bid Date',
			id: 'bidDate',
			name: 'bidDate',
			Cell: ({ row }) => {
				return <>{formatDate(row.original?.bidDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			type: 'date',
			header: 'Close Date',
			id: 'closeDate',
			name: 'closeDate',
			Cell: ({ row }) => {
				return <>{formatDate(row.original?.closeDate)}</>;
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Closed Price',
			id: 'closedPrice',
			name: 'closedPrice',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'Total NRA',
			id: 'totalNRA',
			name: 'totalNRA',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'Total NMA',
			id: 'totalNMA',
			name: 'totalNMA',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Flowline',
			id: 'stage.pipeline.name',
			name: 'stage.pipeline.name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Deal Stage',
			id: 'stage.name',
			name: 'stage.name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Status',
			id: 'status',
			name: 'status',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Deal Owner',
			id: 'owner.name',
			name: 'owner.name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Notes',
			id: 'notes',
			name: 'notes',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Created By',
			name: 'createBy',
			id: 'createBy',
		},
		CommonSchema.CREATED_DATE,
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Last Updated By',
			name: 'lastUpdateBy',
			id: 'lastUpdateBy',
		},
		CommonSchema.LAST_UPDATED_DATE,
	],
};

export default DealsMeta;
