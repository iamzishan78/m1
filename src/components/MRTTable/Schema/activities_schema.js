/* eslint-disable react/prop-types */
import React from 'react';

import CheckIcon from '@material-ui/icons/Check';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { activityType } from 'components/MRTTable/utils/enums';
import { formatDate } from 'components/Shared/functions';

import { slidoutState } from 'hookstate/initialStates';
import { slidoutStateController } from 'hookstate/slidoutStateController';

import { getTruncateText } from '../utils/helper';

const esIndex = 'activities_flat';

const onClickedRow = selectedRow => {
	const formattedActivity = {
		...selectedRow,
		start: new Date(selectedRow.dateTime),
		end: new Date(selectedRow.endDateTime ? selectedRow.endDateTime : selectedRow.dateTime),
		isClosed: selectedRow?.isClosed === 'true' || selectedRow?.isClosed === true,
	};

	slidoutStateController.showSlideout();
	slidoutState.selectedActivityId.set(selectedRow._id);
	slidoutState.selectedActivity.set(formattedActivity);

	if (window.location.pathname.startsWith('/calendar/activities')) {
		window.history.pushState('', '', `/calendar/activities/${selectedRow._id}`);
	}
};

const ActivitiesMeta = {
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
	defaultSort: { field: 'lastUpdateAt', order: 'desc' },
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
		},
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorFn: row => row?.name,
			id: 'name',
			header: 'Name',
			Cell: ({ renderedCellValue }) => {
				return getTruncateText(renderedCellValue);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'type.keyword',
			accessorFn: row => row?.type,
			id: 'type',
			header: 'Type',
			Cell: ({ row }) => {
				const value = row?.original?.type || null;
				return activityType[value] || value;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dateTime',
			accessorFn: row => row?.dateTime,
			id: 'dateTime',
			header: 'Start Date',
			simple: true,
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return formatDate(row?.original?.dateTime);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'endDateTime',
			accessorFn: row => row?.endDateTime,
			id: 'endDateTime',
			header: 'End Date',
			simple: true,
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return formatDate(row?.original?.endDateTime);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'outcome.keyword',
			accessorFn: row => row?.outcome,
			id: 'outcome',
			header: 'Outcome',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deal.name.keyword',
			accessorFn: row => row?.deal?.name,
			id: 'deal.name',
			header: 'Deal Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactName.keyword',
			accessorFn: row => row?.contactName,
			id: 'contactName',
			header: 'Contact Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'owner.name.keyword',
			accessorFn: row => row?.owner?.name,
			id: 'owner.name',
			header: 'Activity Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			enableColumnFilter: false,
			isExport: false,
			enableSorting: false,
			name: 'notes.keyword',
			accessorFn: row => row?.notes,
			id: 'notes',
			header: 'Notes',
			Cell: ({ renderedCellValue }) => {
				return getTruncateText(renderedCellValue);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'isClosed',
			esKey: 'isClosed',
			accessorFn: row => row?.isClosed,
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
		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,
	],
};

export default ActivitiesMeta;
