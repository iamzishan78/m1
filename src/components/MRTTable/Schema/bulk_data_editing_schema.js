/* eslint-disable react/prop-types */
import React from 'react';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import BulkDataEditingToolBar from 'components/MRTTable/TablesOverride/BulkDataEditing/Toolbar';

const esIndex = 'jobs_flat';

const BulkDataEditingMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	isInFiniteScroll: true,
	isDeleteDisabled: true,
	// isExportDisabled: true,
	CustomToolBar: BulkDataEditingToolBar,
	maxTableHeight: 'calc(100vh - 200px)',
	defaultSort: { field: 'ts', order: 'desc' },
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			id: 'name',
			header: 'Job Name',
			name: 'name.keyword',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			id: 'type',
			header: 'Job Type',
			name: 'type.keyword',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Progress',
			id: 'percentageProgress',
			name: 'percentageProgress.keyword',
		},
		CommonSchema.CREATED_DATE,
		{
			...CommonSchema.USER,
			header: 'Created By',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			id: 'status',
			header: 'Job Status',
			name: 'status.keyword',
			Cell: ({ renderedCellValue }) => (
				<span
					style={{
						width: '100%',
						fontWeight: 600,
						cursor: 'pointer',
						textAlign: 'center',
						padding: '4px 10px',
						textDecoration: 'initial',
						color: renderedCellValue === 'Failed' || renderedCellValue === 'Completed' ? 'white' : '',
						backgroundColor:
							renderedCellValue === 'Failed' ? '#FF7C7F' : renderedCellValue === 'Completed' ? '#A9D18E' : '',
					}}
				>
					{renderedCellValue}
				</span>
			),
		},
	],
};

export default BulkDataEditingMeta;
