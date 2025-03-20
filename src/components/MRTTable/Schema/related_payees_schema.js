/* eslint-disable react/prop-types */
import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import { TO_FIXED } from 'utils/consts';

import RelatedPayeesToolbar from '../TablesOverride/RelatedPayeesTable/RelatedPayeesToolbar';

const esIndex = 'contacts_flat';

// Related Payments Meta
const RelatedPaymentsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 550px)',
	CustomToolBar: RelatedPayeesToolbar,
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
			name: 'payments.payeeName.keyword',
			id: 'payments.payeeName',
			header: 'Payee Name',
			isArrayKey: true,
			Cell: ({ row }) => {
				const value = row.original?.payments?.payeeName || '';
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
			name: 'payments.payeeAddress.keyword',
			id: 'payments.payeeAddress',
			header: 'Payee Address',
			isArrayKey: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'payments.paymentAllocation.keyword',
			id: 'payments.paymentAllocation',
			header: 'Payment Allocation',
			type: 'number',
			isArrayKey: true,
			Cell: ({ row }) => {
				const value = row.original?.payments?.paymentAllocation;
				return value ? `${Number(value).toFixed(TO_FIXED)}%` : value === 0 ? '0%' : '';
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'payments.paymentAmount.keyword',
			id: 'payments.paymentAmount',
			header: 'Payment Amount',
			type: 'number',
			isArrayKey: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'payments.status.keyword',
			id: 'payments.status',
			header: 'Status',
			isArrayKey: true,
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'contact'} />;
			},
		},
	],
};

export default RelatedPaymentsMeta;
