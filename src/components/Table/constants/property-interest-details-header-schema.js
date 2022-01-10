
const RevenueStatementHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
    {
        name: "ownerName", label: "Owner Name", esKey: 'propert.number.keyword', options: { sort: true, filter: true }
    },
    {
        name: "interestType", label: "Interest Type", esKey: 'property.name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "interestAmount", label: "Interest Amount", esKey: 'property.state.keyword', options: { sort: true, filter: true }
    },
    {
        name: "effectiveDate", label: "Effective Date", esKey: 'property.county.keyword', options: { sort: true, filter: true }
    },
    {
        name: "status", label: "Status", esKey: 'date', options: { sort: true, filter: true }
    },
    {
        name: "costFree", label: "Cost Free?", esKey: 'product.keyword', options: { sort: true, filter: true }
    },
    {
        name: "tags",
        label: "Tags",
        esKey: "tags.keyword",
        options: { sort: true, filter: true },
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
];

export default RevenueStatementHeadCells;