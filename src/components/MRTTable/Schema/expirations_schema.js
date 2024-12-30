import CheckIcon from '@material-ui/icons/Check';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import { tableGlobalController } from 'hookstate/tableController';

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
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dateTime',
			accessorFn: row => row?.dateTime,
			id: 'dateTime',
			header: 'Start Date',
			simple: true,
			type: 'date',
			Cell: ({ renderedCellValue, row }) => {
				return <>{formatDate(row?.original?.dateTime)}</>;
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
			Cell: ({ renderedCellValue, row }) => {
				return <>{formatDate(row?.original?.endDateTime)}</>;
			},
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
		{
			...CommonSchema.COMMON_COLUMN,
			enableColumnFilter: false,
			isExport: false,
			enableSorting: false,
			name: 'notes',
			accessorFn: row => row?.notes,
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
