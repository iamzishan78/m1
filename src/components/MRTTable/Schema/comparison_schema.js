/* eslint-disable react/prop-types */
import React from 'react';

import { ErrorOutline } from '@material-ui/icons';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'checkdetailsinterestscomparison_flat';

const ComparisonMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: 'flatSyncAt', order: 'desc' },
	maxTableHeight: 'calc(100vh - 540px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
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
			isExternalFilter: true,
			header: 'Check Number',
			Cell: ({ row, cell }) => {
				const interestAmount = row.getValue('property.interest.interestAmount');
				const decimalInterest = row.getValue('disbursement');
				const showMismatchedFlag = interestAmount !== decimalInterest;
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={
								typeof cell.getValue() === 'string' && cell.getValue()?.split('_')?.[0]
									? row.getValue('property.number')
										? `${cell.getValue()} - ${row.getValue('property.number')}`
										: cell.getValue()
									: row.getValue('property.number')
							}
							link={`/revenue/statement/details/${row.getValue('check._id')}`}
							onClick={e => {
								e.stopPropagation();
							}}
						/>
						{showMismatchedFlag && (
							<div style={{ marginLeft: '15px', cursor: 'pointer' }}>
								<ErrorOutline
									style={{
										width: '17px',
										height: '17px',
										color: 'red',
									}}
								/>
							</div>
						)}
					</div>
				);
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.number.keyword',
			id: 'property.number',
			header: 'Operator Prop # / Property Number',
			size: 400,
			isExternalFilter: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.internalID.keyword',
			id: 'property.internalID',
			header: 'Company ID',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.prospectID.keyword',
			id: 'property.prospectID',
			header: 'Prospect ID',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.acquisitionID.keyword',
			id: 'property.acquisitionID',
			header: 'Acquisition ID',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.operator.keyword',
			id: 'property.operator',
			header: 'Operator',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.purchaser.name.keyword',
			id: 'property.purchaser.name',
			header: 'Payor Name',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.interest.interestType.keyword',
			id: 'property.interest.interestType',
			header: 'Interest Type',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.interest.interestAmount',
			id: 'property.interest.interestAmount',
			header: 'Interest Amount',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.interest.effectiveDate',
			id: 'property.interest.effectiveDate',
			header: 'Effective Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.property?.interest?.effectiveDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.interest.endDate',
			id: 'property.interest.endDate',
			header: 'End Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.property?.interest?.endDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.interest.status.keyword',
			id: 'property.interest.status',
			header: 'status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.interest.costFree.keyword',
			id: 'property.interest.costFree',
			header: 'Cost Free',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.apiNumber.keyword',
			id: 'wells.apiNumber',
			header: 'Well API',
			Cell: ({ row }) => {
				const apiNumbers = row?.original?.wells?.map(item => item.apiNumber) || [];
				return apiNumbers?.length && apiNumbers?.length > 1 ? 'Multiple' : apiNumbers[0] || null;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.wellName.keyword',
			id: 'wells.wellName',
			header: 'Well Name',
			Cell: ({ row }) => {
				const wellName = row?.original?.wells?.map(item => item.wellName) || [];
				return wellName?.length && wellName?.length > 1 ? 'Multiple' : wellName[0] || null;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.checkDate',
			id: 'check.checkDate',
			header: 'Check Date',
			type: 'date',
			isExternalFilter: true,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.checkDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.ownerNumber.keyword',
			id: 'property.ownerNumber',
			header: 'Owner Number',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property._owner.name.keyword',
			id: 'property._owner.name',
			header: 'Owner',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.depositDate',
			id: 'check.depositDate',
			header: 'Deposit Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.depositDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.checkAmount',
			id: 'check.checkAmount',
			header: 'Check Amount',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.source.keyword',
			id: 'check.source',
			header: 'Source',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.sourceId.keyword',
			id: 'check.sourceId',
			header: 'Source Id',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property Name',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.state.keyword',
			id: 'property.state',
			header: 'State',
			isExternalFilter: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.county.keyword',
			id: 'property.county',
			header: 'County',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'date',
			id: 'date',
			header: 'Sales Date',
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
			...CommonSchema.STRING_COLUMN,
			name: 'disbursement',
			id: 'disbursement',
			header: 'Decimal Interest',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'check._id.keyword',
			id: 'check._id',
			header: 'Check Id',
			size: 300,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'differnce',
			id: 'differnce',
			header: 'Difference',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'percentageDifference',
			id: 'percentageDifference',
			header: '% Difference',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'potentialGainLoss',
			id: 'potentialGainLoss',
			header: 'Potential Gain/Loss',
			type: 'number',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.purchaserNumber.keyword',
			id: 'property.purchaserNumber',
			header: 'Payor Prop #',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.status.keyword',
			id: 'property.status',
			header: 'Pay Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'price',
			id: 'price',
			header: 'Avg Price',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'grossPropertyVolume',
			id: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'grossPropertyValue',
			id: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'grossOwnerVolume',
			id: 'grossOwnerVolume',
			header: 'Gross Owner Volume',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'grossOwnerValue',
			id: 'grossOwnerValue',
			header: 'Owner Gross Revenue',
		},

		{
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
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

export default ComparisonMeta;
