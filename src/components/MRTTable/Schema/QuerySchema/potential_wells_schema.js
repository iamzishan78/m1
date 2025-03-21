import React from 'react';

import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import FlyToMap from 'components/MRTTable/Common/TableCells/coordinates_fly_map';
import IsTracked from 'components/MRTTable/Common/TableCells/IsTracked';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import PotentialWellToolbar from 'components/MRTTable/TablesOverride/PotentialWellTable/PotentialWellToolbar';
import { getPolygonString } from 'components/Shared/functions';

import { SHAPEWELLS } from 'graphQL/useQueryPaginatedShapeWells';

import { tableController } from 'stateManagement/tableController';

const PotentialWellsMeta = {
	query: SHAPEWELLS,
	additionalQueries: ['comments', 'tags', 'isTracked'],
	maxTableHeight: 'calc(60vh - 200px)',
	getVariables: tableMeta => {
		const { customLayer } = tableMeta?.customProps || {};

		if (!customLayer) {
			return null;
		}

		const polygon = getPolygonString(customLayer?.shape);

		return {
			pagination: {
				first: 10000,
				after: null,
			},
			sort: {},
			filters: [],
			search: '',
			polygon,
			shapeId: customLayer._id,
		};
	},
	getDataFromRes: res => res?.data?.paginatedShapeWells?.edges?.map(edge => edge.node) || [],
	getIdsFromRows: rows => rows?.map(row => row?.id) || [],
	CustomToolBar: PotentialWellToolbar,
	isClientSide: true,
	isSelectAllAllowed: true,
	isDeleteDisabled: true,
	isExportDisabled: true,
	enableFacetedValues: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'API',
			id: 'api',
			name: 'api',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Well Name',
			id: 'wellName',
			name: 'wellName',
		},

		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Lease Number',
			id: 'leaseId',
			name: 'leaseId',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Lease Name',
			id: 'lease',
			name: 'lease',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Operator',
			id: 'operator',
			name: 'operator',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Type',
			id: 'wellType',
			name: 'wellType',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Profile',
			id: 'wellBoreProfile',
			name: 'wellBoreProfile',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Status',
			id: 'wellStatus',
			name: 'wellStatus',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Global Well',
			id: 'globalWell',
			name: 'globalWell',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const id = row.getValue('id');
				let tags = row?.original?.tags;

				const Controller = tableController('PotentialWellsTable');
				const { stateValues } = Controller.useState(['tagsList']);

				tags = stateValues.tagsList?.find(tag => tag._id === id)?.tags || tags;

				return (
					<TagCell id={id} targetSourceId={id} tags={tags} targetLabel={'well'} tableKey={'PotentialWellsTable'} />
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('id');

				let value = renderedCellValue?.length || 0;

				const Controller = tableController('PotentialWellsTable');
				const { stateValues } = Controller.useState(['commentsCounter']);

				value = stateValues.commentsCounter?.find(counter => counter._id === id)?.total || value;

				return <CommentCell id={id} value={value} targetLabel={'well'} tableKey={'PotentialWellsTable'} />;
			},
		},
		{
			...CommonSchema.IS_TRACKED,
			Cell: ({ row }) => {
				const id = row.getValue('id');

				const Controller = tableController('PotentialWellsTable');
				const { stateValues } = Controller.useState(['isTrackedList']);

				return <IsTracked id={id} targetLabel={'well'} isTracked={!!stateValues.isTrackedList?.includes(id)} />;
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'coordinates',
			id: 'coordinates',
			header: '',
			size: 70,
			Cell: ({ row }) => {
				const id = row.getValue('id');
				return <FlyToMap id={id} type="wells" disabled={!id} />;
			},
		},
	],
};

export default PotentialWellsMeta;
