/* eslint-disable react/prop-types */
import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import { TO_FIXED } from 'utils/consts';

import RelatedBillingPartiesToolbar from '../TablesOverride/RelatedBillingPartiesTable/RelatedBillingPartiesToolbar';

const esIndex = 'contacts_flat';

// Related Billing Parties Meta
const RelatedBillingPartiesMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: '30vh',
	CustomToolBar: RelatedBillingPartiesToolbar,
	isInFiniteScroll: true,
	isGeneric: false,
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
			name: 'billingParties.name.keyword',
			id: 'billingParties.name',
			header: 'Billing Party Name',
			isArrayKey: true,
			Cell: ({ row }) => {
				const value = row.original?.billingParties?.name || '';
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={value}
							link={`/contact/details/${row.getValue('_id')}`}
							onClick={e => {
								e.stopPropagation();
							}}
						/>
					</div>
				);
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'billingParties.address.keyword',
			id: 'billingParties.address',
			header: 'Billing Party Address',
			isArrayKey: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'billingParties.allocation.keyword',
			id: 'billingParties.allocation',
			header: 'Billing Party Allocation',
			type: 'number',
			isArrayKey: true,
			Cell: ({ row }) => {
				const value = row.original?.billingParties?.allocation;
				return value ? `${Number(value).toFixed(TO_FIXED)}%` : value === 0 ? '0%' : '';
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'billingParties.amount.keyword',
			id: 'billingParties.amount',
			header: 'Billing Party Amount',
			type: 'number',
			isArrayKey: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'billingParties.status.keyword',
			id: 'billingParties.status',
			header: 'Status',
			isArrayKey: true,
		},
	],
};

export default RelatedBillingPartiesMeta;
