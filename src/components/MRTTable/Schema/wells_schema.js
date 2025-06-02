import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import { tableController } from 'stateManagement/tableController';

import FlyToMap from '../Common/TableCells/coordinates_fly_map';

const esIndex = 'platform_wells';

const WellsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 290px)',
	isExportDisabled: true,
	isInFiniteScroll: true,
	isDeleteDisabled: true,
	columnVirtualization: true,
	geoKey: 'geoJSON',
	asyncRowSelection: true,
	getIdsFromRows: rows => rows?.map(row => row?._id) || [],
	additionalQueries: ['comments'],
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
			id: 'api',
			header: 'API',
			name: 'api.keyword',
			getFilterByServerSide: true,
			Cell: ({ renderedCellValue, row }) => {
				const { stateValues } = tableController('WellsTable').useState(['toolbarInternalActions']);
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={renderedCellValue}
							link={`/map/wells/${row.getValue('_id')}`}
							onClick={stateValues.toolbarInternalActions?.onClose}
						/>
					</div>
				);
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			id: 'wellName',
			header: 'Well Name',
			name: 'wellName.keyword',
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.STRING_COLUMN,

			id: 'state',
			header: 'State',
			name: 'state.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,

			id: 'county',
			header: 'County',
			name: 'county.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,

			id: 'wellType',
			header: 'Well Type',
			name: 'wellType.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,

			id: 'wellStatus',
			header: 'Well Status',
			name: 'wellStatus.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,

			id: 'operator',
			header: 'Operator Name',
			name: 'operator.keyword',
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.STRING_COLUMN,

			id: 'wellBoreProfile',
			header: 'Well Profile',
			name: 'wellBoreProfile.keyword',
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const { stateValues } = tableController('WellsTable').useState(['commentsCounter']);
				const comment = stateValues?.commentsCounter?.find(comment => comment._id === id);
				return <CommentCell id={id} value={comment?.total} targetLabel={'well'} />;
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'coordinates',
			id: 'coordinates',
			header: '',
			size: 70,
			Cell: ({ row }) => {
				const id = row.getValue('_id');

				return <FlyToMap id={id} type="wells" disabled={!id} />;
			},
		},
	],
};

export default WellsMeta;
