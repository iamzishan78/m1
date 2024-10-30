import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import Analytics from 'components/Shared/svgIcons/analytics';
import { formatDateTime,formatDate } from 'components/Shared/functions';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import ActivityAnalyticsToolBar from 'components/MRTTable/TablesOverride/ActivityAnalytics/ActivityAnalyticsToolBar';

const esIndex = 'activities_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('ActivityTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'activitydetailmodal',
			selectedRow,
		},
	});
};

const ActivityMeta = {
    esIndex,
    pageSize: 50,
    pagination: {
        pageIndex: 0,
        pageSize: 50,
    },
    search: {
        fields: ["name", "_all"]
    },
    maxTableHeight: 'calc(100vh - 600px)',
    isDeleteDisabled: true, // Disable delete functionality
    isNotBreadcrumbView: true, // Flag to determine whether to display a simple Typography or a Breadcrumbs component. If true, Typography is rendered; if false, Breadcrumbs is rendered.
    gridViewSettings: {
        label: 'Activities',
        Icon: "none",
        cssOverride: {
            top: '138px',
            left: '40px',
            marginLeft: '-9px',
        },
    },
    isInFiniteScroll: true,
    columnVirtualization: true,
    CustomToolBar: ActivityAnalyticsToolBar,
    onClickedRow,
    defaultSort: { field: "lastUpdateAt", order: "desc" },
    TableSchema: [
        {
            ...CommonSchema.MONGO_ID,
            name: '_id',
            accessorKey: '_id',
        },
        {
            ...CommonSchema.INITAIL_PINNED,
            name: 'name.keyword',
            accessorKey: 'name',
            header: "Activity Name",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'type.keyword',
            accessorKey: 'type',
            header: "Activity Type",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'dateTime',
            id: 'dateTime',
            accessorFn: row => row?.dateTime,
            header: "Start Date",
            isHiddenFieldExport: true,
            type: 'date',
            simple: true,
            isSearchField: false,
            Cell: ({ row }) => {
                return <>{formatDateTime(row?.original?.dateTime)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'endDateTime',
            accessorFn: row => row?.endDateTime,
            id: 'endDateTime',
            header: "End Date",
            isHiddenFieldExport: true,
            type: 'dateTime',
            simple: true,
            isSearchField: false,
            Cell: ({ row }) => {
                return <>{formatDateTime(row?.original?.endDateTime)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'outcome.keyword',
            accessorKey: 'outcome',
            header: "Outcome",
            isHiddenFieldExport: true,
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
            accessorKey: 'contactName',
            header: "Contact Name",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'ownerName.keyword',
            accessorKey: 'ownerName',
            header: "Activity Owner",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'notes',
            accessorKey: 'notes',
            header: "Notes",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
			name: 'createBy.name.keyword',
			accessorFn: row => row?.createBy?.name,
			id: 'createBy.name',
			header: 'Created By',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'createAt',
            accessorFn: row => row?.createAt,
            accessorKey: 'createAt',
            header: "Created Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.createAt)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
			name: 'lastUpdateBy.name.keyword',
			accessorFn: row => row?.lastUpdateBy?.name,
			id: 'lastUpdateBy.name',
			header: 'Last Updated By',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'lastUpdateAt',
            accessorFn: row => row?.lastUpdateAt,
            accessorKey: 'lastUpdateAt',
            header: "Last Updated Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.lastUpdateAt)}</>
            },
        },
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'isClosed',
			accessorKey: 'isClosed',
			header: 'Completed?',
			isSearchField: false,
			type: "boolean",
			Cell: ({ row }) => {
				const isClosed = [true, 'true', 'True'].includes(row.getValue('isClosed'));

				return <>{isClosed ? 'Completed' : 'Not Completed'}</>;
			},
		},

    ]
}
export default ActivityMeta;