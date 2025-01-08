/* eslint-disable react/prop-types */
import React from 'react';

import CheckIcon from '@material-ui/icons/LocalAtm';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import { slidoutState } from 'hookstate/initialStates';
import { slidoutStateController } from 'hookstate/slidoutStateController';

import { getTruncateText } from '../utils/helper';

const esIndex = 'activities_flat';

const onClickedRow = selectedRow => {
	const formattedActivity = {
		start: new Date(selectedRow.dateTime),
		end: new Date(selectedRow.endDateTime ? selectedRow.endDateTime : selectedRow.dateTime),
		...selectedRow,
	};
	slidoutStateController.showSlideout();
	slidoutState.selectedActivityId.set(selectedRow._id);
	slidoutState.selectedActivity.set(formattedActivity);

	if (window.location.pathname.startsWith('/calendar/obligations')) {
		window.history.pushState('', '', `/calendar/obligations/${selectedRow._id}`);
	}
};

const statusOptions = {
	notYetReviewed: 'Not Yet Reviewed',
	inProgress: 'In Progress',
	reviewCompleted: 'Review Completed',
};

const ObligationsMeta = {
	esIndex,
	onClickedRow,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 290px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
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
			name: 'name.keyword',
			id: 'name',
			header: 'Name',
			Cell: ({ renderedCellValue }) => {
				return getTruncateText(renderedCellValue);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'type.keyword',
			id: 'type',
			header: 'Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dateTime',
			id: 'dateTime',
			header: 'Start Date',
			simple: true,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.dateTime)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'endDateTime',
			id: 'endDateTime',
			header: 'End Date',
			simple: true,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.endDateTime)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'owner.name.keyword',
			id: 'owner.name',
			header: 'Activity Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'frequency.keyword',
			id: 'frequency',
			header: 'Frequency',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'applicable.keyword',
			id: 'applicable',
			header: 'Applicable',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'value.keyword',
			id: 'value',
			header: 'Value',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'responsibleParty.keyword',
			id: 'responsibleParty',
			header: 'Responsible Party',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			id: 'status',
			header: 'Status',
			Cell: ({ row }) => {
				return <>{statusOptions[row?.original?.status] || row?.original?.status}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'isClosed',
			esKey: 'isClosed',
			id: 'isClosed',
			header: 'Completed?',
			type: 'boolean',
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			Cell: ({ renderedCellValue }) => {
				return renderedCellValue === 'true' ? (
					<div style={{ textAlign: 'center' }}>
						<CheckIcon id="checkIcon" />
					</div>
				) : (
					<div style={{ textAlign: 'center' }}>--</div>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			enableColumnFilter: false,
			enableSorting: false,
			isExport: false,
			name: 'notes',
			id: 'notes',
			header: 'Notes',
			Cell: ({ renderedCellValue }) => {
				return getTruncateText(renderedCellValue);
			},
		},
	],
};

export default ObligationsMeta;
