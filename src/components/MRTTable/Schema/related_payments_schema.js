/* eslint-disable react/prop-types */
import React from 'react';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import { tableGlobalController } from 'stateManagement/tableController';

import RelatedPaymentsToolbar from '../TablesOverride/RelatedPaymentsTable/RelatedPaymentsToolbar';

const esIndex = 'payment_flat';

// click on row
const onClickedRow = selectedRow => {
	const paymentMultiGrid = tableGlobalController.getValue('paymentMultiGrid');
	if (paymentMultiGrid?.paymentId && paymentMultiGrid?.paymentId === selectedRow._id) {
		tableGlobalController.updateState({
			paymentMultiGrid: { showMultiGrid: false },
		});
	} else if (selectedRow?._id) {
		tableGlobalController.updateState({
			paymentMultiGrid: {
				showMultiGrid: true,
				paymentId: selectedRow._id,
				paymentAmount: selectedRow?.amount,
			},
		});
	}
};

// Related Payments Meta
const RelatedPaymentsMeta = {
	esIndex,
	onClickedRow,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: '30vh',
	CustomToolBar: RelatedPaymentsToolbar,
	isInFiniteScroll: true,
	enableRowSelected: true,
	hasMultiGrids: true,
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
			name: 'paymentType.keyword',
			id: 'paymentType',
			header: 'Payment Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'startDate',
			id: 'startDate',
			header: 'Start Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.startDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'endDate',
			id: 'endDate',
			header: 'End Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.endDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'frequency.keyword',
			id: 'frequency',
			header: 'Frequency',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'nextPayment',
			id: 'nextPayment',
			header: 'Next Payment',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.nextPayment)}</>;
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'amount.keyword',
			id: 'amount',
			header: 'Amount',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'companyShare.keyword',
			id: 'companyShare',
			header: 'Company Share',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'responsibleParty.keyword',
			id: 'responsibleParty',
			header: 'Responsible Party',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'assignedTo.displayName.keyword',
			id: 'assignedTo.displayName',
			header: 'Assigned To',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'paymentStatus.keyword',
			id: 'paymentStatus',
			header: 'Payment Status',
		},
	],
};

export default RelatedPaymentsMeta;
