
const RevenueStatementHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
    {
        name: "number", label: "Property Code", esKey: 'number.keyword', options: { sort: true, filter: true }
    },
    {
        name: "name", label: "Property Name", esKey: 'name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "state", label: "State", esKey: 'state.keyword', options: { sort: true, filter: true }
    },
    {
        name: "county", label: "County", esKey: 'county.keyword', options: { sort: true, filter: true }
    },
    {
        name: "date", label: "Sales Date", esKey: 'date.keyword', options: { sort: true, filter: true }
    },
    {
        name: "product", label: "Product", esKey: 'product.keyword', options: { sort: true, filter: true }
    },
    {
        name: "disbursement", label: "Decimal Interest", esKey: 'disbursement.keyword', options: { sort: true, filter: true }
    },
    {
        name: "interestType", label: "Type", esKey: 'interestType.keyword', options: { sort: true, filter: true }
    },
    {
        name: "price", label: "Avg Price", esKey: 'price.keyword', options: { sort: true, filter: true }
    },
    {
        name: "grossOwnerVolume", label: "Sales Vol", esKey: 'grossOwnerVolume.keyword', options: { sort: true, filter: true }
    },
    {
        name: "grossOwnerValue", label: "Gross Rev", esKey: 'grossOwnerValue.keyword', options: { sort: true, filter: true }
    },
    {
        name: "ownerTax", label: "Severence", esKey: 'ownerTax.keyword', options: { sort: true, filter: true }
    },
    {
        name: "ownerDeducts", label: "Deduct Amt", esKey: 'ownerDeducts.keyword', options: { sort: true, filter: true }
    },
    {
        name: "deductType", label: "Deduct Cd", esKey: 'deductType.keyword', options: { sort: true, filter: true }
    },
    {
        name: "netOwnerValue", label: "Owner Net Rev", esKey: 'netOwnerValue.keyword', options: { sort: true, filter: true }
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