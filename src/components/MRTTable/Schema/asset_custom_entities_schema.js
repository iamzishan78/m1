/* eslint-disable react/prop-types */
import React from 'react';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import Chips from '../Common/TableCells/Chips';
import AssetCustomEntitiesToolbar from '../TablesOverride/AssetCustomEntities/Toolbars/AssetCustomEntities';

const esIndex = 'assetcustomentities_flat';

const AssetCustomEntitiesMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: '35vh',
	isInFiniteScroll: true,
	columnVirtualization: false,
	isDeleteDisabled: true,
	CustomToolBar: AssetCustomEntitiesToolbar,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'name.keyword',
			accessorFn: row => row?.name,
			id: 'name',
			header: 'Asset Name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'creationPlace.keyword',
			accessorFn: row => row?.creationPlace,
			id: 'creationPlace',
			header: 'Creation Place',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeType.keyword',
			accessorFn: row => row?.shapeType,
			id: 'shapeType',
			header: 'Shape Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'numberOfKeys',
			accessorFn: row => row?.numberOfKeys,
			id: 'numberOfKeys',
			header: 'Number of Keys',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'controlColumns.label.keyword',
			accessorKey: 'controlColumns.label',
			header: 'Control Columns',
			Cell: ({ row }) => <Chips list={row?.original?.controlColumns} />,
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'controlColumns',
				// field in customprops that will be matched
				referenceValueKey: 'mappingKey',
				// field that needs to be exported from matched object
				actualKey: 'label', //label
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'associatedModels.name.keyword',
			accessorKey: 'associatedModels.name',
			header: 'Associated Models',
			Cell: ({ row }) => <Chips list={row?.original?.associatedModels} />,
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'associatedModels',
				// field in customprops that will be matched
				referenceValueKey: '_id',
				// field that needs to be exported from matched object
				actualKey: 'name', //label
			},
		},
		{
			...CommonSchema.CREATED_BY,
		},
		{
			...CommonSchema.LAST_UPDATED_BY,
		},
		{
			...CommonSchema.CREATED_DATE,
		},
		{
			...CommonSchema.LAST_UPDATED_DATE,
		},
	],
};

export default AssetCustomEntitiesMeta;
