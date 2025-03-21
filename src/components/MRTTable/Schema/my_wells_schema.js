import React from 'react';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import WellsToolbar from 'components/MRTTable/TablesOverride/MyWellsTable/WellsToolbar';
import { formatDate } from 'components/Shared/functions';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController, tableGlobalController } from 'stateManagement/tableController';

const esIndex = 'mywells_flat';

const MyWellsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	CustomToolBar: WellsToolbar,
	maxTableHeight: 'calc(100vh - 290px)',
	defaultSort: { field: 'lastUpdateAt', order: 'desc' },
	deletedKeys: {
		mainRecord: { key: 'wellData.Id' },
	},
	isInFiniteScroll: true,
	columnVirtualization: true,
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
			...CommonSchema.HIDDEN, // Added to allow search with this field too
			name: 'wellData.wellName',
			id: 'wellData?.WellName',
			hidden: true,
			isSearchField: true,
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'wellData.wellName.keyword',
			id: 'wellData.wellName',
			header: 'Well Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue}
						link={`/land/well/details/${row?.original?.wellData?.Id}?mongoWellId=${row?.original?._id}`}
						onClickForTestCase={() => {
							globalStateController.handleMyWellTestCase(row?.original?.wellData?.Id, row?.original?._id);
							tableGlobalController.updateState({
								addWellDialog: {
									type: 'addWell',
									showDialog: true,
								},
							});
						}}
					/>
				</div>
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.api.keyword',
			id: 'wellData.api',
			header: 'API',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'properties.internalID.keyword',
			id: 'properties.internalID',
			header: 'Internal ID',
			Cell: ({ row }) => {
				return <>{row?.original?.properties?.[0]?.internalID}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'properties.name.keyword',
			id: 'properties.name',
			header: 'Property Name',
			Cell: ({ row }) => {
				return <>{row?.original?.properties?.[0]?.name}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.operator.keyword',
			id: 'wellData.operator',
			header: 'Operator',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.wellType.keyword',
			id: 'wellData.wellType',
			header: 'Well Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.wellBoreProfile.keyword',
			id: 'wellData.wellBoreProfile',
			header: 'Well Profile',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.wellStatus.keyword',
			id: 'wellData.wellStatus',
			header: 'Well Status',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.basin.keyword',
			id: 'wellData.basin',
			header: 'Basin',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.field.keyword',
			id: 'wellData.field',
			header: 'Field',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.state.keyword',
			id: 'wellData.state',
			header: 'State',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.county.keyword',
			id: 'wellData.county',
			header: 'County',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.GrId1.keyword',
			id: 'wellData.GrId1',
			header: 'Survey',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.GrId2.keyword',
			id: 'wellData.GrId2',
			header: 'Block/Twsp',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.GrId3.keyword',
			id: 'wellData.GrId3',
			header: 'Sec/Range',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.GrId4.keyword',
			id: 'wellData.GrId4',
			header: 'Abstract/Sec',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.PermitDate',
			id: 'wellData.PermitDate',
			header: 'Permit Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.wellData?.PermitDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.SpudDate',
			id: 'wellData.SpudDate',
			header: 'Spud Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.wellData?.SpudDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.CompletionDate',
			id: 'wellData.CompletionDate',
			header: 'Completion Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.wellData?.CompletionDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.FirstProdDate',
			id: 'wellData.FirstProdDate',
			header: 'First Prod Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.wellData?.FirstProdDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.measuredDepth',
			id: 'wellData.measuredDepth',
			header: 'Measured Depth',
			isSearchField: false,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.TrueVerticalDepth.keyword',
			id: 'wellData.TrueVerticalDepth',
			header: 'TVD',
			isSearchField: false,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.lateralLength.keyword',
			id: 'wellData.lateralLength',
			header: 'Lateral Length',
			isSearchField: false,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wellData.primaryFormation.keyword',
			id: 'wellData.primaryFormation',
			header: 'Formation',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'properties.status.keyword',
			id: 'properties.status',
			header: 'Pay Status',
			Cell: ({ row }) => {
				return <>{row?.original?.properties?.[0]?.status}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'properties.divOrderStatus.keyword',
			id: 'properties.divOrderStatus',
			header: 'DO Status',
			Cell: ({ row }) => {
				return <>{row?.original?.properties?.[0]?.divOrderStatus}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'propertyDescriptor.interestType.keyword',
			id: 'propertyDescriptor.interestType',
			header: 'Interest Type',
			Cell: ({ row }) => {
				const value = row?.original?.propertyDescriptor;
				return <p>{value && value?.length > 0 ? (value.length > 1 ? 'MULTIPLE' : value[0]?.interestType) : ''}</p>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'propertyDescriptor.interestAmount.keyword',
			id: 'propertyDescriptor.interestAmount',
			header: 'Interest Amount',
			isSearchField: false,
			Cell: ({ row }) => {
				const value = row?.original?.propertyDescriptor;
				return <p>{value && value?.length > 0 ? (value.length > 1 ? 'MULTIPLE' : value[0]?.interestAmount) : ''}</p>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'propertyDescriptor.effectiveDate',
			id: 'propertyDescriptor.effectiveDate',
			header: 'Effective Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				const value = row?.original?.propertyDescriptor;
				return (
					<p>
						{value && value?.length > 0 ? (value.length > 1 ? 'MULTIPLE' : formatDate(value[0]?.effectiveDate)) : ''}
					</p>
				);
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'propertyDescriptor.costFree.keyword',
			id: 'propertyDescriptor.costFree',
			header: 'Cost Free',
			Cell: ({ row }) => {
				const value = row?.original?.propertyDescriptor;
				return <p>{value && value?.length > 0 ? (value.length > 1 ? 'MULTIPLE' : value[0]?.costFree) : ''}</p>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'properties.internalCompany.keyword',
			id: 'properties.internalCompany',
			header: 'Internal Company',
			Cell: ({ row }) => {
				return <>{row?.original?.properties?.[0]?.internalCompany}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'properties.acquisitionID.keyword',
			id: 'properties.acquisitionID',
			header: 'Acquisition',
			Cell: ({ row }) => {
				return <>{row?.original?.properties?.[0]?.acquisitionID}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'properties.prospectID.keyword',
			id: 'properties.prospectID',
			header: 'Prospect',
			Cell: ({ row }) => {
				return <>{row?.original?.properties?.[0]?.prospectID}</>;
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const { stateValues } = tableController('MyWellsTable').useState(['commentsCounter']);
				const comment = stateValues?.commentsCounter?.find(comment => comment._id === id);
				return <CommentCell id={id} value={comment?.total} targetLabel={'well'} />;
			},
		},
	],
};

export default MyWellsMeta;
