
/* props is just a style object*/

import ColumnWithLink from "components/Common/MRTable/ColumnWithLink";

const PaymentsHeadCells = [
    {
        name: "_id",
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
        name: "name",
        label: "Billing Party Name",
        esKey: 'billingParties.name.keyword',
        options: {
            filter: true,
            customRender: (value, tableMeta) => {
                const userId = tableMeta.rowData[0];
                return <ColumnWithLink link={`/contact/details/${userId}`} value={value} />
            },
        },
    },

    {
        name: "address",
        label: "Billing Party Address",
        esKey: 'billingParties.address.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "allocation",
        label: "Billing Party Allocation",
        esKey: 'billingParties.allocation.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "amount",
        label: "Billing Party Amount",
        esKey: 'billingParties.amount.keyword',
        options: {
            filter: true
        },
    },
    {
        name: "status",
        label: "Status",
        esKey: 'billingParties.status.keyword',
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



