
/* props is just a style object*/

import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { GlobalStickyStyles } from "GlobalSettings";

const PaymentsHeadCells = [
    {
        name: "propertyId",
        options: {
            display: false,
            filter: false,
            searchable: false,
            sort: false,
            download: false,
            print: false,
            viewColumns: false,
        },
    },
    {
        name: "number", label: "Property #", esKey: 'number.keyword', options: { display: false, sort: false, filter: true, style: { minWidth: 250 }, }
    },
    {
        name: "name", label: "Property Name", esKey: 'name.keyword', options: { display: false, sort: false, filter: true }
    },
    {
        /// this is the control column for properties 
        name: "number",
        label: "Cost Center",
        esKey: 'property.number.keyword',
        options: {
            ...GlobalStickyStyles({
                setCellProps: {
                    left: "77px",
                    maxWidth: "300px"
                },
                setCellHeaderProps: {
                    left: "77px",
                    maxWidth: "300px",
                    paddingLeft: '25px',
                }
            }),
            sort: true, filter: false,

            customRender: (value, tableMeta) => {
                return <ColumnWithLink
                    value={value?.split("_")?.[0]
                        ? tableMeta?.rowData[1] ? `${value?.split("_")?.[0]} - ${tableMeta?.rowData[2] || ""}` : value
                        : tableMeta?.rowData[1] ? tableMeta?.rowData[1] : tableMeta?.rowData[2]}
                    link={`/revenue/property/details/${tableMeta.rowData[0]}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            },
        },
    },
    // {
    //   name: "costCenter",
    //   label: "Cost Center",
    //   esKey: 'costAllocation.costCenter.keyword',
    //   options: {
    //     filter: true
    //   },
    // },


    {
        name: "allocation",
        label: "Cost Allocation",
        esKey: 'costAllocation.allocation.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "amount",
        label: "Cost Allocation Amount",
        esKey: 'costAllocation.amount.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "commentsCounter",
        label: " ",
        options: {
            dbName: "comments.comment",
            ignoreGlobal: true,
            filter: false,
            searchable: false,
            sort: true,
            download: false,
            print: false,
            viewColumns: false,
        },
    },
];


export default PaymentsHeadCells;



