import React from 'react';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'checkdetailsinterestscomparison_flat';

const SalesVolumeComparisonMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: 'flatSyncAt', order: 'desc' },
	maxTableHeight: 'calc(100vh - 440px)',
	height: '540px',
	isInFiniteScroll: true,
	columnVirtualization: false,
	isDeleteDisabled: true, // Disable delete functionality
	TableSchema: [
		// MongoDB ID column
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		// Property Name column
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'property.name.keyword',
			id: 'property.name',
			header: 'Property Name',
		},
		// Property Number column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'property.number.keyword',
			id: 'property.number',
			header: 'Property Number',
			isExternalFilter: true,
		},
		// Well API Number column with custom cell rendering
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.apiNumber.keyword',
			id: 'wells.apiNumber',
			header: 'Well API',
			isExport: 'wells[0].apiNumber',
			Cell: ({ row }) => {
				const apiNumbers = row?.original?.wells?.map(item => item.apiNumber) || [];
				return apiNumbers?.length && apiNumbers?.length > 1 ? 'Multiple' : apiNumbers[0] || '';
			},
		},
		// Well Name column with custom cell rendering
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.wellName.keyword',
			id: 'wells.wellName',
			header: 'Well Name',
			isExport: 'wells[0].wellName',
			Cell: ({ row }) => {
				const wellName = row?.original?.wells?.map(item => item.wellName) || [];
				return wellName?.length && wellName?.length > 1 ? 'Multiple' : wellName[0] || '';
			},
		},
		// Sales Date column with custom cell rendering to format the date
		{
			...CommonSchema.STRING_COLUMN,
			name: 'date',
			id: 'date',
			header: 'Sales Date',
			isHiddenFieldExport: true,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>;
			},
		},
		// Product column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'product.keyword',
			id: 'product',
			header: 'Product',
			isHiddenFieldExport: true,
		},
		// Reported Volume column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'reportedVolume',
			id: 'reportedVolume',
			header: 'Reported Volume',
			isHiddenFieldExport: true,
		},
		// Statement Volume column
		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'grossPropertyVolume',
			id: 'grossPropertyVolume',
			header: 'Statement Volume',
			isHiddenFieldExport: true,
		},
		// Report Date column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.production.data.ReportDate',
			id: 'wells.production.data.ReportDate',
			header: 'Report Date',
			type: 'date',
		},
		// Oil Production column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.production.data.allocatedOil',
			id: 'wells.production.data.allocatedOil',
			header: 'Oil Production',
		},
		// Gas Production column
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.production.data.allocatedGas',
			id: 'wells.production.data.allocatedGas',
			header: 'Gas Production',
		},
		// Over/Short column with custom cell rendering to display color-coded value
		{
			...CommonSchema.STRING_COLUMN,
			name: 'data.allocatedWater',
			id: 'overShort',
			header: 'Over/Short',
			isSearchField: false, // disabled searching field
			enableSorting: false, // disabled sorting field
			Cell: ({ row }) => {
				const renderedCellValue = row?.original?.overShort || 0;
				return (
					<p
						style={{
							fontWeight: 600,
							color: renderedCellValue > 0 ? '#177B1E' : '#F4273D',
						}}
					>
						{renderedCellValue > 0 ? renderedCellValue : renderedCellValue * -1}
					</p>
				);
			},
		},
		// % Difference column with custom cell rendering to display color-coded value
		{
			...CommonSchema.STRING_COLUMN,
			name: 'data.allocatedWater',
			id: 'difference',
			header: '% Difference',
			isSearchField: false, // disabled searching field
			enableSorting: false, // disabled sorting field
			Cell: ({ row }) => {
				const renderedCellValue = row?.original?.difference;
				const overShort = row?.original?.overShort;
				return (
					<p
						style={{
							fontWeight: 600,
							color: overShort > 0 ? '#177B1E' : '#F4273D',
						}}
					>
						{renderedCellValue?.replace('-', '')}
					</p>
				);
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'check.checkNumber.keyword',
			accessorKey: 'check.checkNumber',
			header: 'Check Number',
			id: 'check.checkNumber',
			isExternalFilter: true,
		},
	],
};

export default SalesVolumeComparisonMeta;
