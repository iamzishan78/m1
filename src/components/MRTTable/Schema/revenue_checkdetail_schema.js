import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import Analytics from 'components/Shared/svgIcons/analytics';
import { formatDateTime, formatDate } from 'components/Shared/functions';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';

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
    maxTableHeight: 'calc(100vh - 330px)',
    gridViewSettings: {
        label: 'Check Details',
        Icon: 'none',
        cssOverride: {
            top: '138px',
            left: '40px',
            marginLeft: '-25px',
        },
    },
    isNotBreadcrumbView: true, // Flag to determine whether to display a simple Typography or a Breadcrumbs component. If true, Typography is rendered; if false, Breadcrumbs is rendered.
    isDeleteDisabled: true,
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
            accessorKey: "check.checkNumber",
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
            accessorKey: "property.name",
            header: 'Property',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.payor.name.keyword',
            accessorKey: "check.payor.name",
            header: 'Payor',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.checkDate',
            accessorKey: "check.checkDate",
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
            accessorKey: "property.ownerNumber",
            header: 'Owner Number',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'property._owner.name.keyword',
            accessorKey: "property._owner.name",
            header: 'Owner',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'check.depositDate',
            accessorKey: 'check.depositDate',
            header: "Deposit Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.check?.depositDate)}</>
            },
        },
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkAmount',
			accessorKey: 'check.checkAmount',
			header: 'Check Amount',
			Cell: ({ renderedCellValue }) => <>{vf_currency_to_fixed(renderedCellValue)}</>,
		},

        {
			...CommonSchema.COMMON_COLUMN,
			name: 'check.source.keyword',
            accessorKey: 'check.source',
			header: 'Source',
		},

        {
			...CommonSchema.COMMON_COLUMN,
			name: 'check.sourceId.keyword',
            accessorKey: 'check.sourceId',
			header: 'Source Id',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'property.number.keyword',
            accessorKey: 'property.number',
			header: 'Payor Property #',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'property.state.keyword',
            accessorKey: 'property.state',
			header: 'State',
		},

        {
			...CommonSchema.COMMON_COLUMN,
			name: 'property.county.keyword',
            accessorKey: 'property.county',
			header: 'County',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'product.keyword',
            accessorKey: 'product',
			header: 'Product',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'date',
            accessorKey: 'date',
			header: 'Sales Date',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'disbursement',
            accessorKey: 'disbursement',
			header: 'Decimal Interest',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'interestType.keyword',
            accessorKey: 'interestType',
			header: 'Type',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'price',
            accessorKey: 'price',
			header: 'Avg Price',
		},
        {
			...CommonSchema.COMMON_COLUMN,
            name: "grossPropertyVolume",
            accessorKey: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyValue',
            accessorKey: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerVolume',
            accessorKey: 'grossOwnerVolume',
			header: 'Gross Owner Volume',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerValue',
            accessorKey: 'grossOwnerValue',
			header: 'Owner Gross Revenue',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerTax',
            accessorKey: 'ownerTax',
			header: 'Owner Tax Amt',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'taxType.keyword',
            accessorKey: 'taxType',
			header: 'Tax Type',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerDeducts',
            accessorKey: 'ownerDeducts',
			header: 'Deduct Amt',
		},
        {
			...CommonSchema.COMMON_COLUMN,
			name: 'netOwnerValue',
            accessorKey: 'netOwnerValue',
			header: 'Owner Net Rev',
		},
        {
			...CommonSchema.HIDDEN,
			name: 'propertyId',
			accessorKey: 'propertyId',
		},
    ]
}
export default RevenueCheckDetailMeta;