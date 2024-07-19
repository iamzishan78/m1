import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import Analytics from 'components/Shared/svgIcons/analytics';
import { formatDateTime, formatDate } from 'components/Shared/functions';
import { tableController, tableGlobalController } from 'hookstate/tableController';

const esIndex = 'checkdetails_flat';

const RevenueCheckDetailMeta = {
    esIndex,
    pageSize: 50,
    pagination: {
        pageIndex: 0,
        pageSize: 50,
    },
    search: {
        fields: ["name^4", "_all"]
    },
    maxTableHeight: 'calc(100vh - 215px)',
    gridViewSettings: {
        label: 'Check Details',
        Icon: Analytics,
        cssOverride: {
            top: '138px',
            left: '40px',
            marginLeft: '-9px',
        },
    },
    isInFiniteScroll: true,
    // columnVirtualization: true,
    defaultSort: { field: "flatSyncAt", order: "desc" },
    TableSchema: [
        {
            ...CommonSchema.MONGO_ID,
            name: '_id',
            accessorKey: '_id',
        },
        {
            ...CommonSchema.INITAIL_PINNED,
            name: 'check.checkNumber.keyword',
            accessorFn: row => row?.check?.checkNumber,
            header: 'Check Number',
            Cell: ({ renderedCellValue, row }) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >

                    <ColumnWithLink
                        value={renderedCellValue?.split("_")?.[0]
                            ? row?.original?.check?.payor?.name ? `${renderedCellValue?.split("_")?.[0]} - ${row?.original?.check?.payor?.name}` : renderedCellValue
                            : row?.original?.check?.payor?.name}
                        link={`/revenue/statement/details/${row?.original?.check?._id}`}

                    />
                </div>
            ),
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'property.name.keyword',
            accessorFn: row => row?.property?.name,
            id: 'property.name',
            header: 'Property',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.payor.name.keyword',
            accessorFn: row => row?.check?.payor?.name,
            id: 'check.payor.name',
            header: 'Payor',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.checkDate',
            accessorFn: row => row?.check?.checkDate,
            accessorKey: 'check.checkDate',
            header: "Check Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.check?.checkDate)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'property.ownerNumber.keyword',
            accessorFn: row => row?.property?.ownerNumber,
            id: 'property.ownerNumber',
            header: 'Owner Number',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'property._owner.name.keyword',
            accessorFn: row => row?.property?._owner?.name,
            id: 'property._owner.name',
            header: 'Owner',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.depositDate',
            accessorFn: row => row?.check?.depositDate,
            accessorKey: 'check.depositDate',
            header: "Deposit Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.check?.depositDate)}</>
            },
        },
    ]
}
export default RevenueCheckDetailMeta;