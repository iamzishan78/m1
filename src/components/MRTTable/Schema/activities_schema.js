import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import CheckIcon from '@material-ui/icons/Check';
import { getTruncateText } from '../utils/helper';
import { activityType } from 'components/MRTTable/utils/enums';
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
    defaultSort: { field: "lastUpdateAt", order: "desc" },
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
            name: "name.keyword",
            accessorFn: row => row?.name,
            id: "name",
            header: "Name",
            Cell: ({ renderedCellValue }) => {
                return getTruncateText(renderedCellValue)
            }
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "type.keyword",
            accessorFn: row => row?.type,
            id: "type",
            header: "Type",
            type: "defaultFiltersOptions",
            defaultFilterOptions: [
                { label: "All", value: "all" },
                { label: "Call", value: "call" },
                { label: "Meeting", value: "meeting" },
                { label: "Task", value: "task" },
                { label: "Deadline", value: "deadline" },
                { label: "Email", value: "email" },
                { label: "Text Message", value: "text_message" },
                { label: "Mailer", value: "mailer" },
            ],
            Cell: ({ row }) => {
                const value = row?.original?.type
                return <>{activityType[value] || row?.original?.type}</>
            }
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "dateTime",
            accessorFn: row => row?.dateTime,
            id: "dateTime",
            header: "Start Date",
            simple: true,
            type: 'date',
            isSearchField: false,
            Cell: ({ renderedCellValue, row }) => {
                return <>{formatDate(row?.original?.dateTime)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "endDateTime",
            accessorFn: row => row?.endDateTime,
            id: "endDateTime",
            header: "End Date",
            simple: true,
            type: 'date',
            isSearchField: false,
            Cell: ({ renderedCellValue, row }) => {
                return <>{formatDate(row?.original?.endDateTime)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "outcome.keyword",
            accessorFn: row => row?.outcome,
            id: "outcome",
            header: "Outcome",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "deal.name.keyword",
            accessorFn: row => row?.deal?.name,
            id: "deal.name",
            header: "Deal Name",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "contactName.keyword",
            accessorFn: row => row?.contactName,
            id: "contactName",
            header: "Contact Name",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "owner.name.keyword",
            accessorFn: row => row?.owner?.name,
            id: "owner.name",
            header: "Activity Owner",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            enableColumnFilter: false,
            isExport: false,
            enableSorting: false,
            name: "notes.keyword",
            accessorFn: row => row?.notes,
            id: "notes",
            header: "Notes",
            Cell: ({ renderedCellValue }) => {
                return getTruncateText(renderedCellValue)
            }
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "isClosed",
            esKey: "isClosed",
            accessorFn: row => row?.isClosed,
            id: "isClosed",
            header: "Completed?",
            type: "boolean",
            defaultFilterOptions: [
                { label: 'Y', value: true, type: "term" },
                { label: 'N', value: false, type: "term" }
            ],
            Cell: ({ renderedCellValue }) => {
                return (renderedCellValue === "true" ? <div style={{ textAlign: "center" }}>
                    <CheckIcon id="checkIcon" />
                </div> : <div style={{ textAlign: "center" }}>--</div>)
            }
        },
    ],
};

export default ActivitiesMeta;
