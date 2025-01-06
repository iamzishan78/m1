/* eslint-disable react/prop-types */
import React from 'react';

import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import PotentialWellOwnersToolbar from 'components/MRTTable/TablesOverride/PotentialWellOwnersTable/PotentialWellOwnersToolbar';
import { getPolygonString } from 'components/Shared/functions';

import { SHAPE_WELL_OWNERS } from 'graphQL/useQueryPaginatedShapeWellOwners';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

const PotentialWellOwnersMeta = {
	query: SHAPE_WELL_OWNERS,
	additionalQueries: ['comments', 'tags', 'isContact'],
	maxTableHeight: 'calc(100vh - 440px)',
	getVariables: tableMeta => {
		const { customLayer, year, filterByWells } = tableMeta?.customProps || {};

		if (!customLayer) {
			return null;
		}

		const polygon = getPolygonString(customLayer?.shape);
		const user = globalStateController.getValue('user');

		return {
			pagination: {
				first: 10000,
				after: null,
			},
			sort: {},
			filters: [],
			search: '',
			selectedYear: `${year || ''}`,
			filterByWells: filterByWells ? customLayer._id : '',
			polygon,
			userId: user._id,
		};
	},
	getDataFromRes: res => res?.data?.paginatedShapeWellOwners?.edges?.map(edge => edge.node) || [],
	getIdsFromRows: rows => rows?.map(row => row?.id) || [],
	CustomToolBar: PotentialWellOwnersToolbar,
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
			...CommonSchema.HIDDEN,
			name: 'entity',
			id: 'entity',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Api Number',
			id: 'api',
			name: 'api',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Well Name',
			id: 'wellName',
			name: 'wellName',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease',
			id: 'lease',
			name: 'lease',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease Number',
			id: 'leaseNumber',
			name: 'leaseNumber',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Owner Name',
			id: 'name',
			name: 'name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Entity Type',
			id: 'ownershipType',
			name: 'ownershipType',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Owner Address',
			id: 'StreetAddress',
			name: 'StreetAddress',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'City',
			id: 'City',
			name: 'City',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'State',
			id: 'State',
			name: 'State',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Zip',
			id: 'Zip',
			name: 'Zip',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Type',
			id: 'interestType',
			name: 'interestType',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Interest',
			id: 'ownershipPercentage',
			name: 'ownershipPercentage',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Tax Value',
			id: 'appraisedValue',
			name: 'appraisedValue',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const id = row.getValue('id');
				let tags = row?.original?.tags;

				const Controller = tableController('PotentialWellOwnersTable');
				const { stateValues } = Controller.useState(['tagsList']);

				tags = stateValues.tagsList?.find(tag => tag._id === id)?.tags || tags;

				return (
					<TagCell id={id} targetSourceId={id} tags={tags} targetLabel={'well'} tableKey={'PotentialWellOwnersTable'} />
				);
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'isContact',
			id: 'isContact',
			Cell: ({ row }) => {
				return <IsContactCell contactId={'false'} rows={[row.original.node]} />;
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('id');

				let value = renderedCellValue?.length || 0;

				const Controller = tableController('PotentialWellOwnersTable');
				const { stateValues } = Controller.useState(['commentsCounter']);

				value = stateValues.commentsCounter?.find(counter => counter._id === id)?.total || value;

				return <CommentCell id={id} value={value} targetLabel={'well'} tableKey={'PotentialWellOwnersTable'} />;
			},
		},
	],
};

export default PotentialWellOwnersMeta;
