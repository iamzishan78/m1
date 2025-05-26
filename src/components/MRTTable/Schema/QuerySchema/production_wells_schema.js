/* eslint-disable react/prop-types */
import React from 'react';

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
	isDeleteDisabled: true,
	enableFacetedValues: true,
	columnVirtualization: true,
	isInFiniteScroll: true,
	disableRowSelection: true,
	FooterKeys: ['oil', 'gas', 'water', 'allocatedOil', 'allocatedWater', 'allocatedGas'],
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			id: 'Id',
			name: 'Id',
		},
		{
			...CommonSchema.SELECT_DATE_COLUMN,
			header: 'Date',
			id: 'ReportDate',
			name: 'ReportDate',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Oil (BBL)',
			id: 'oil',
			name: 'oil',
			...CommonSchema.CUMULATIVE_FOOTER('oil', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Gas (MCF)',
			id: 'gas',
			name: 'gas',
			...CommonSchema.CUMULATIVE_FOOTER('gas', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'H2O (BBL)',
			id: 'water',
			name: 'water',
			...CommonSchema.CUMULATIVE_FOOTER('water', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Allocated Oil (BBL)',
			id: 'allocatedOil',
			name: 'allocatedOil',
			...CommonSchema.CUMULATIVE_FOOTER('allocatedOil', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Allocated Gas (MCF)',
			id: 'allocatedGas',
			name: 'allocatedGas',
			...CommonSchema.CUMULATIVE_FOOTER('allocatedGas', tableKey),
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Allocated Water (BBL)',
			id: 'allocatedWater',
			name: 'allocatedWater',
			...CommonSchema.CUMULATIVE_FOOTER('allocatedWater', tableKey),
		},
	],
};

export default ProductionWellsMeta;
