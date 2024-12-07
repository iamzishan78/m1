import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import { getTruncateText } from '../utils/helper';
import { slidoutStateController } from 'hookstate/slidoutStateController';
import { slidoutState } from 'hookstate/initialStates';

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
			name: 'owner.name.keyword',
			accessorFn: row => row?.owner?.name,
			id: 'owner.name',
			header: 'Activity Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'frequency.keyword',
			accessorFn: row => row?.frequency,
			id: 'frequency',
			header: 'Frequency',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'applicable.keyword',
			accessorFn: row => row?.applicable,
			id: 'applicable',
			header: 'Applicable',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'value.keyword',
			accessorFn: row => row?.value,
			id: 'value',
			header: 'Value',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'responsibleParty.keyword',
			accessorFn: row => row?.responsibleParty,
			id: 'responsibleParty',
			header: 'Responsible Party',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			accessorFn: row => row?.status,
			id: 'status',
			header: 'Status',
			Cell: ({ renderedCellValue, row }) => {
				return <>{statusOptions[row?.original?.status] || row?.original?.status}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			enableColumnFilter: false,
			enableSorting: false,
			isExport: false,
			name: 'notes',
			accessorFn: row => row?.notes,
			id: 'notes',
			header: 'Notes',
			Cell: ({ renderedCellValue }) => {
				return getTruncateText(renderedCellValue);
			},
		},
	],
};

export default ObligationsMeta;
