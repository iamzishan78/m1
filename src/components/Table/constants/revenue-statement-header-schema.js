const RevenueStatementHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },

    {
        name: "checkNumber", label: "Check Number", esKey: 'checkNumber.keyword', options: { sort: true, filter: true }
    },
    {
        name: "purchaserName", label: "Purchaser Name", esKey: 'payor.name', options: { sort: true, filter: true }
    },
    {
        name: "checkAmount", label: "Check Amount", esKey: 'checkAmount', options: { sort: true, filter: true }
    },
    {
        name: "checkDate", label: "Check Date", esKey: 'checkDate', options: { sort: true, filter: true }
    },
    {
        name: "depositDate", label: "Deposit Date", esKey: 'depositDate', options: { sort: true, filter: true }
    },
    {
        name: "lines", label: "Lines", esKey: 'checkDetail.lines', options: { sort: true, filter: true }
    },
    {
        name: "source", label: "Source", esKey: 'source.keyword', options: { sort: true, filter: true }
    },
    {
        name: "sourceId", label: "Check ID", esKey: 'sourceId.keyword', options: { sort: true, filter: true }
    },
    {
        name: "status", label: "Status", esKey: 'status.keyword', options: { sort: true, filter: true }
    },
    {
        name: "tags", label: "Tags", esKey: 'tags.keyword', options: { sort: true, filter: true }
    },
    {
        name: "commentsCounter",
        label: " ",
        options: {
            dbName: "comments.comment",
            filter: false,
            searchable: false,
            sort: true,
            download: false,
            print: false,
            viewColumns: false,
        },
    },
    {
        name: "validation", label: "Validation", esKey: 'validation.keyword', options: { sort: true, filter: true }
    },
];

export default RevenueStatementHeadCells;
