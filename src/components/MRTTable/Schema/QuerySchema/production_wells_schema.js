/* eslint-disable react/prop-types */
import React from 'react';

import moment from 'moment';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import { PRODUCTIONDETAILQUERY } from 'graphQL/useQueryProductionDetail';

const tableKey = 'ProductionWellsTable';

const ProductionWellsMeta = {
	query: PRODUCTIONDETAILQUERY,
	maxTableHeight: 'calc(70vh - 120px)',
	getVariables: tableMeta => {
		const { id, pageSize } = tableMeta?.customProps || {};

		if (!id) {
			return {};
		}

		return {
			id,
			pageSize,
		};
	},
	getDataFromRes: res => {
		return res?.data?.externalProductionDetail || [];
	},
	getIdsFromRows: rows => {
		return rows?.map(row => row?.Id) || [];
	},
	isClientSide: true,
	isSelectAllAllowed: true,
	isDeleteDisabled: true,
	isExportDisabled: true,
	enableFacetedValues: true,
	columnVirtualization: true,
	isInFiniteScroll: true,
	disableRowSelection: true,
	FooterKeys: ['oil', 'gas', 'water', 'allocatedOil', 'allocatedWater', 'allocatedGas'],
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			accessorKey: 'Id',
			name: 'Id',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Date',
			accessorKey: 'ReportDate',
			name: 'ReportDate',
			type: 'date',
			Cell: ({ row }) => {
				const value = row?.original?.ReportDate;
				const displayValue = value ? moment(value).format('MM/YYYY') : '';
				return <>{displayValue}</>;
			},
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Oil (BBL)',
			accessorKey: 'oil',
			name: 'oil',
			accessorFn: row => row?.oil,
			...CommonSchema.CUMULATIVE_FOOTER('oil', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Gas (MCF)',
			accessorKey: 'gas',
			name: 'gas',
			accessorFn: row => row?.gas,
			...CommonSchema.CUMULATIVE_FOOTER('gas', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'H2O (BBL)',
			accessorKey: 'water',
			name: 'water',
			accessorFn: row => row?.water,
			...CommonSchema.CUMULATIVE_FOOTER('water', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Allocated Oil (BBL)',
			accessorKey: 'allocatedOil',
			name: 'allocatedOil',
			accessorFn: row => row?.allocatedOil,
			...CommonSchema.CUMULATIVE_FOOTER('allocatedOil', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Allocated Gas (MCF)',
			accessorKey: 'allocatedGas',
			name: 'allocatedGas',
			accessorFn: row => row?.allocatedGas,
			...CommonSchema.CUMULATIVE_FOOTER('allocatedGas', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Allocated Water (BBL)',
			accessorKey: 'allocatedWater',
			name: 'allocatedWater',
			accessorFn: row => row?.allocatedWater,
			...CommonSchema.CUMULATIVE_FOOTER('allocatedWater', tableKey),
		},
	],
};

export default ProductionWellsMeta;
