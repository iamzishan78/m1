/* eslint-disable react/prop-types */
import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { TO_FIXED } from 'utils/consts';

const esIndex = 'checkdetails_flat';

const RevenueCheckDetailMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},

	maxTableHeight: 'calc(100vh - 250px)',
	gridViewSettings: {
		label: 'Check Details',
		Icon: 'none',
		cssOverride: {
			top: '138px',
			left: '40px',
			marginLeft: '-25px',
		},
	},
	isNotBreadcrumbView: true, // Flag to determine whether to display a simple Typography or a Breadcrumbs component. If true, Typography is rendered; if false, Breadcrumbs is rendered.
	isDeleteDisabled: true,
	isInFiniteScroll: true,
	columnVirtualization: true,
	defaultSort: { field: 'flatSyncAt', order: 'desc' },
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'check.checkNumber.keyword',
			id: 'check.checkNumber',
			header: 'Check Number',
			Cell: ({ row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={
							row?.original?.check?.checkNumber?.split('_')?.[0]
								? row?.original?.check?.payor?.name
									? `${row?.original?.check?.checkNumber?.split('_')?.[0]} - ${row?.original?.check?.payor?.name}`
									: row?.original?.check?.checkNumber
								: row?.original?.check?.payor?.name
						}
						link={`/revenue/statement/details/${row?.original?.check?._id}`}
					/>
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.payor.name.keyword',
			id: 'check.payor.name',
			header: 'Payor',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkDate',
			id: 'check.checkDate',
			header: 'Check Date',
			isHiddenFieldExport: true,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.checkDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.ownerNumber.keyword',
			id: 'property.ownerNumber',
			header: 'Owner Number',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property._owner.name.keyword',
			id: 'property._owner.name',
			header: 'Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.depositDate',
			id: 'check.depositDate',
			header: 'Deposit Date',
			isHiddenFieldExport: true,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.depositDate)}</>;
			},
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'check.checkAmount',
			id: 'check.checkAmount',
			header: 'Check Amount',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.source.keyword',
			id: 'check.source',
			header: 'Source',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.sourceId.keyword',
			id: 'check.sourceId',
			header: 'Source Id',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkNumber.keyword',
			id: 'property.number',
			header: 'Payor Property #',
			Cell: ({ row }) => <>{row?.original?.check?.checkNumber}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.state.keyword',
			id: 'property.state',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.county.keyword',
			id: 'property.county',
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'product.keyword',
			id: 'product',
			header: 'Product',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'date',
			id: 'date',
			header: 'Sales Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>;
			},
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'disbursement',
			id: 'disbursement',
			header: 'Decimal Interest',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestType.keyword',
			id: 'interestType',
			header: 'Type',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'price',
			id: 'price',
			header: 'Avg Price',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyVolume',
			id: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
			Cell: ({ row }) => {
				const value = row?.original?.grossPropertyVolume;
				return <p>{value ? `${vf_number(value, TO_FIXED)}` : ''}</p>;
			},
			subType: 'number',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossPropertyValue',
			id: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerVolume',
			id: 'grossOwnerVolume',
			header: 'Gross Owner Volume',
			Cell: ({ renderedCellValue }) => <>{vf_number(renderedCellValue, TO_FIXED)}</>,
			subType: 'number',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossOwnerValue',
			id: 'grossOwnerValue',
			header: 'Owner Gross Revenue',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'ownerTax',
			id: 'ownerTax',
			header: 'Owner Tax Amt',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxType.keyword',
			id: 'taxType',
			header: 'Tax Type',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'ownerDeducts',
			id: 'ownerDeducts',
			header: 'Deduct Amt',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'netOwnerValue',
			id: 'netOwnerValue',
			header: 'Owner Net Rev',
		},
		{
			...CommonSchema.HIDDEN,
			name: 'propertyId',
			id: 'propertyId',
		},
	],
};
export default RevenueCheckDetailMeta;
