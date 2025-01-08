/* eslint-disable react/prop-types */
import React from 'react';

import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import MapAddress from 'components/MRTTable/Common/TableCells/MapAddress';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import WellOwnersToolbar from 'components/MRTTable/TablesOverride/WellOwners/Toolbar';

import { WELLOWNERSQUERY } from 'graphQL/useQueryWellOwners';

import { tableController } from 'hookstate/tableController';

const WellOwnersMeta = {
	query: WELLOWNERSQUERY,
	additionalQueries: ['tags', 'isContact'],
	maxTableHeight: 'calc(50vh - 120px)',
	getVariables: tableMeta => {
		const { id, selectedYear } = tableMeta?.customProps || {};

		if (!(id || selectedYear)) {
			return null;
		}
		return { id, selectedYear };
	},
	getDataFromRes: res => res?.data?.wellOwners || [],
	getIdsFromRows: rows => rows?.map(row => row?.globalOwnerId) || [],
	CustomToolBar: WellOwnersToolbar,
	isClientSide: true,
	disableRowSelection: true,
	isSelectAllAllowed: true,
	isDeleteDisabled: true,
	isExportDisabled: true,
	enableFacetedValues: true,
	isInFiniteScroll: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			header: 'Global Owner Id',
			id: 'globalOwnerId',
			name: 'globalOwnerId',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Name',
			id: 'name',
			name: 'name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Entity',
			id: 'ownershipType',
			name: 'ownershipType',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Property Name',
			id: 'propertyName',
			name: 'propertyName',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Interest Type',
			id: 'interestType',
			name: 'interestType',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'Interest',
			id: 'ownershipPercentage',
			name: 'ownershipPercentage',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Appraised Value',
			id: 'appraisedValue',
			name: 'appraisedValue',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const Controller = tableController('WellOwnersTable');
				const { stateValues } = Controller.useState(['tagsList']);

				const tags = stateValues.tagsList?.find(tag => tag._id === row.original.globalOwnerId)?.tags || [];

				return (
					<TagCell
						id={row.original.globalOwnerId}
						targetSourceId={row.original.globalOwnerId}
						tags={tags}
						targetLabel={'well'}
						tableKey={'WellOwnersTable'}
					/>
				);
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'isContact',
			id: 'isContact',
			Cell: ({ row }) => {
				const Controller = tableController('WellOwnersTable');
				const { stateValues } = Controller.useState(['ownersWhoAreContact', 'data']);

				const contactOwner = stateValues.ownersWhoAreContact?.find(
					contact => contact?.globalOwner === row?.original?.globalOwnerId
				);
				return <IsContactCell contactId={contactOwner?.isContact || 'false'} rows={[row.original]} />;
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'address',
			id: 'address',
			Cell: ({ row }) => {
				return <MapAddress owner={row.original} id={row.original.globalOwnerId} />;
			},
		},
	],
};

export default WellOwnersMeta;
