/* eslint-disable react/prop-types */
import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { TO_FIXED } from 'utils/consts';

const esIndex = 'checkdetails_flat';

const PropertyRevenueDetailMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(60vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	isDeleteDisabled: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'check.checkNumber.keyword',
			id: 'check.checkNumber',
			header: 'Check #',
			Cell: ({ row }) => {
				return (
					<ColumnWithLink
						value={
							row?.original?.check?.checkNumber && row?.original?.check?.payor?.name
								? `${row?.original?.check?.checkNumber} - ${row?.original?.check?.payor?.name}`
								: row?.original?.check?.checkNumber || row?.original?.check?.payor?.name || ''
						}
						link={`/revenue/statement/details/${row?.original?.check?._id}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				);
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.payor.name.keyword',
			id: 'check.payor.name',
			header: 'Purchaser',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.purchaserNumber.keyword',
			id: 'property.purchaserNumber',
			header: 'Purhaser Property #',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property Name',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.checkDate',
			id: 'check.checkDate',
			header: 'Check Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.checkDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.ownerNumber.keyword',
			accessorFn: row => row?.property?.ownerNumber,
			id: 'property.ownerNumber',
			header: 'Owner Number',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property._owner.name.keyword',
			accessorFn: row => row?.property?._owner?.name,
			id: 'property._owner.name',
			header: 'Owner',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.depositDate.keyword',
			accessorFn: row => row?.check?.depositDate,
			id: 'check.depositDate',
			header: 'Deposit Date',
			type: 'date',
			isSearchField: false,
			// Cell rendering for Check Date column
			Cell: ({ renderedCellValue, row }) => {
				return <>{formatDate(renderedCellValue)}</>;
			},
			hidden: true,
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'check.checkAmount',
			accessorKey: 'check.checkAmount',
			header: 'Check Amount',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.source.keyword',
			accessorKey: 'check.source',
			header: 'Source',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.sourceId.keyword',
			accessorFn: row => row?.check?.sourceId,
			id: 'check.sourceId',
			header: 'Source Id',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkNumber.keyword',
			accessorKey: 'check.checkNumber',
			id: 'check.checkNumber',
			header: 'Payor Property #',
			Cell: ({ row }) => <>{row?.original?.check?.checkNumber}</>,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.state.keyword',
			accessorKey: 'property.state',
			header: 'State',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.county.keyword',
			accessorKey: 'property.county',
			header: 'County',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'date',
			accessorKey: 'date',
			id: 'date',
			header: 'Sales Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'product.keyword',
			id: 'product',
			header: 'Product',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'disbursement',
			id: 'disbursement',
			header: 'Decimal Interest',
		},

		{
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
			name: 'grossPropertyVolume',
			id: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const value = row?.original?.grossPropertyVolume;
				return value ? <p>{vf_number(value, TO_FIXED)}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			name: 'grossPropertyValue',
			id: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'grossOwnerVolume',
			id: 'grossOwnerVolume',
			header: 'Owner Volume',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const value = row?.original?.grossOwnerVolume;
				return value ? <p>{vf_number(value, TO_FIXED)}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
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
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
			name: 'deductType.keyword',
			id: 'deductType',
			header: 'Deduct Cd',
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
			accessorKey: 'propertyId',
		},
	],
};

export default PropertyRevenueDetailMeta;
