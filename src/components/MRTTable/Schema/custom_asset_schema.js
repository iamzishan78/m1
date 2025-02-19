/* eslint-disable react/prop-types */
import React from 'react';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import AssetEntityToolbar from '../TablesOverride/AssetCustomEntities/Toolbars/AssetEntity';

const esIndex = 'customentitiesmodelkeys_flat';

const customAssetMeta = {
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
	CustomToolBar: AssetEntityToolbar,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'label.keyword',
			accessorFn: row => row?.label,
			id: 'label',
			header: 'Column Label',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'mappingKey.keyword',
			accessorFn: row => row?.mappingKey,
			id: 'mappingKey',
			header: 'Column Key',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'keyType.keyword',
			accessorFn: row => row?.keyType,
			id: 'keyType',
			header: 'Column Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'isSummaryField',
			accessorKey: 'isSummaryField',
			header: 'Summary Field',
			isSearchField: false,
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			type: 'boolean',
			Cell: ({ row }) => {
				const isSummaryField = [true, 'true', 'True'].includes(row.getValue('isSummaryField'));

				return <>{isSummaryField ? 'Yes' : 'No'}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'isControlColumn',
			accessorKey: 'isControlColumn',
			header: 'Control Column',
			isSearchField: false,
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			type: 'boolean',
			Cell: ({ row }) => {
				const isControlColumn = [true, 'true', 'True'].includes(row.getValue('isControlColumn'));

				return <>{isControlColumn ? 'Yes' : 'No'}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'isGridDisplayed',
			accessorKey: 'isGridDisplayed',
			header: 'Grid Column',
			isSearchField: false,
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			type: 'boolean',
			Cell: ({ row }) => {
				const isGridDisplayed = [true, 'true', 'True'].includes(row.getValue('isGridDisplayed'));

				return <>{isGridDisplayed ? 'Yes' : 'No'}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'isDialogDisplayed',
			accessorKey: 'isDialogDisplayed',
			header: 'Dialog Field',
			isSearchField: false,
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			type: 'boolean',
			Cell: ({ row }) => {
				const isDialogDisplayed = [true, 'true', 'True'].includes(row.getValue('isDialogDisplayed'));

				return <>{isDialogDisplayed ? 'Yes' : 'No'}</>;
			},
		},
	],
};

export default customAssetMeta;
