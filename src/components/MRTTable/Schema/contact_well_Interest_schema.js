/* eslint-disable react/prop-types */
import React from 'react';

import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import WellInterestToolBar from 'components/MRTTable/TablesOverride/ContactDetailWellInterestTable/WellInterestToolbar';

import { tableController, tableGlobalController } from 'stateManagement/tableController';

const esIndex = 'wellinterests_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('ContactWellInterestTable');
	const { contactId } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addAndUpdateWell',
			contactId,
			activeWellInterest: selectedRow,
		},
	});
};

const ContactWellInterestMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 215px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	defaultSort: { field: '_ts', order: 'desc' },
	CustomToolBar: WellInterestToolBar,
	onClickedRow,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: 'wellId',
			id: 'wellId',
		},

		{
			...CommonSchema.STRING_COLUMN,
			header: 'API',
			name: 'well.apiNumber.keyword',
			id: 'well.apiNumber',
		},

		{
			...CommonSchema.STRING_COLUMN,
			header: 'Well Name',
			name: 'well.wellName.keyword',
			id: 'well.wellName',
		},

		{
			...CommonSchema.STRING_COLUMN,
			header: 'County',
			name: 'well.county.keyword',
			id: 'well.county',
		},

		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease',
			name: 'well.leaseDescription.keyword',
			id: 'well.leaseDescription',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'Lease Acres',
			name: 'well.leaseAcres',
			id: 'well.leaseAcres',
		},

		{
			...CommonSchema.STRING_COLUMN,
			header: 'Interest Owner',
			name: 'interestOwner.keyword',
			id: 'interestOwner',
		},

		{
			...CommonSchema.STRING_COLUMN,
			header: 'Type',
			name: 'type.keyword',
			id: 'type',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'Amount',
			name: 'interest.keyword',
			id: 'interest',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Tax Value',
			name: 'value',
			id: 'value',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'NRA',
			name: 'nra',
			id: 'nra',
		},

		{
			...CommonSchema.TAGS,
			enableSorting: false,
			enableColumnFilter: false,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('wellId');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'well'}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('wellId');
				return <CommentCell id={id} value={renderedCellValue?.length} targetLabel={'well'} />;
			},
		},
	],
};

export default ContactWellInterestMeta;
