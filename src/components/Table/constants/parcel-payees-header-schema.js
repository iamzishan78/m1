
/* props is just a style object*/

import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";

const PaymentsHeadCells = [
    {
        name: "_id",
        esKey: '_id.keyword',
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
        name: "payeeName",
        label: "Payee Name",
        esKey: 'payments.payeeName.keyword',
        options: {
            filter: true,
            customRender: (value, tableMeta) => {
                const userId = tableMeta.rowData[0];
                return <ColumnWithLink link={`/contact/details/${userId}`} value={value} />
            },
        },
    },

    {
        name: "payeeAddress",
        label: "Payee Address",
        esKey: 'payments.payeeAddress.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "paymentAllocation",
        label: "Payment Allocation",
        esKey: 'payments.paymentAllocation.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "paymentAmount",
        label: "Payment Amount",
        esKey: 'payments.paymentAmount.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "status",
        label: "Status",
        esKey: 'payments.status.keyword',
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



