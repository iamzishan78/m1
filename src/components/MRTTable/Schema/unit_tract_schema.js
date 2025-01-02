/* eslint-disable react/prop-types */
import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TractPerUnitToolBar from 'components/MRTTable/TablesOverride/TractPerUnit/TractPerUnitToolBar';

import { tableController, tableGlobalController } from 'hookstate/tableController';

const esIndex = 'shapetracts_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('UnitTractTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addTractToUnit',
			shapeId: customLayer?._id,
			shapeType: 'Unit',
			selectedRow,
		},
	});
};

const TractMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'layer.keyword', value: 'parcel' }],
	maxTableHeight: 'calc(100vh - 489px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	CustomToolBar: TractPerUnitToolBar,
	onClickedRow,
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
			name: 'name.keyword',
			id: 'name',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue || row.getValue('shapeJson.properties.originalProperties.State')}
						link={`/map/parcels/${row.getValue('_id')}`}
					/>
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'state.keyword',
			id: 'state',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'county.keyword',
			id: 'county',
			header: 'county',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'meridian.keyword',
			id: 'meridian',
			header: 'Meridian',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'township.keyword',
			id: 'township',
			header: 'Township',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'range.keyword',
			id: 'range',
			header: 'Range',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'section.keyword',
			id: 'section',
			header: 'Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'altSurvey.keyword',
			id: 'altSurvey',
			header: 'Alt Survey',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'legalDescription.keyword',
			id: 'legalDescription',
			header: 'Full Legal Description',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeArea',
			id: 'shapeArea',
			header: 'Tract Calc. Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'sdGrossAcres',
			id: 'sdGrossAcres',
			header: 'Tract Gross Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'unitTractId.keyword',
			id: 'unitTractId',
			header: 'Unit Tract ID',
			isSearchField: false,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uAcres',
			id: 'uAcres',
			header: 'Unit Tract Acres',
			isSearchField: false,
		},
	],
};

export default TractMeta;
