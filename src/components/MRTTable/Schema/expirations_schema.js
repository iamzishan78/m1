import React from 'react';

import CheckIcon from '@material-ui/icons/Check';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import { tableGlobalController } from 'stateManagement/tableController';

import { getTruncateText } from '../utils/helper';

const esIndex = 'activities_flat';

const onClickedRow = selectedRow => {
	const formattedActivity = {
		start: new Date(selectedRow.dateTime),
		end: new Date(selectedRow.endDateTime ? selectedRow.endDateTime : selectedRow.dateTime),
		...selectedRow,
	};
	tableGlobalController.updateState({
		activityDialog: {
			type: 'activityDialog',
			selectedActivity: { ...formattedActivity },
		},
	});
};

const ExpirationsMeta = {
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
			...CommonSchema.STRING_COLUMN,
			name: 'type.keyword',
			id: 'type',
			header: 'Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
			name: 'deal.name.keyword',
			id: 'deal.name',
			header: 'Deal Name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'contactName.keyword',
			id: 'contactName',
			header: 'Contact Name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'owner.name.keyword',
			id: 'owner.name',
			header: 'Activity Owner',
		},
		{
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
			enableColumnFilter: false,
			isExport: false,
			enableSorting: false,
			name: 'notes',
			id: 'notes',
			header: 'Notes',
			Cell: ({ renderedCellValue }) => {
				return getTruncateText(renderedCellValue);
			},
		},
		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,
	],
};

export default ExpirationsMeta;
