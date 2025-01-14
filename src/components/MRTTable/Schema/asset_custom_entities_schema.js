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
			...CommonSchema.COMMON_COLUMN,
			name: 'tableName.keyword',
			accessorFn: row => row?.tableName,
			id: 'tableName',
			header: 'Asset Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'creationPlace.keyword',
			accessorFn: row => row?.creationPlace,
			id: 'creationPlace',
			header: 'Creation Place',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'numberOfKeys',
			accessorFn: row => row?.numberOfKeys,
			id: 'numberOfKeys',
			header: 'Number of Keys',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'controlColumns.label.keyword',
			accessorKey: 'controlColumns.label',
			header: 'Control Columns',
			Cell: ({ row }) => <Chips list={row?.original?.controlColumns} />,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'associatedModels.label.keyword',
			accessorKey: 'associatedModels.label',
			header: 'Associated Models',
			Cell: ({ row }) => <Chips list={row?.original?.associatedModels} />,
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
