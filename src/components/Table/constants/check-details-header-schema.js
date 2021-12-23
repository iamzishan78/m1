
const RevenueStatementHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
    {
        name: "property", label: "Property Code", esKey: 'propert.number.keyword', options: { sort: true, filter: true }
    },
    {
        name: "property", label: "Property Name", esKey: 'property.name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "property", label: "State", esKey: 'property.state.keyword', options: { sort: true, filter: true }
    },
    {
        name: "property", label: "County", esKey: 'property.county.keyword', options: { sort: true, filter: true }
    },
    {
        name: "date", label: "Sales Date", esKey: 'date', options: { sort: true, filter: true }
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
        name: "price", label: "Avg Price", esKey: 'price', options: { sort: true, filter: true }
    },
    {
        name: "grossOwnerVolume", label: "Sales Vol", esKey: 'grossOwnerVolume', options: { sort: true, filter: true }
    },
    {
        name: "grossOwnerValue", label: "Gross Rev", esKey: 'grossOwnerValue', options: { sort: true, filter: true }
    },
    {
        name: "ownerTax", label: "Severence", esKey: 'ownerTax', options: { sort: true, filter: true }
    },
    {
        name: "ownerDeducts", label: "Deduct Amt", esKey: 'ownerDeducts', options: { sort: true, filter: true }
    },
    {
        name: "deductType", label: "Deduct Cd", esKey: 'deductType.keyword', options: { sort: true, filter: true }
    },
    {
        name: "netOwnerValue", label: "Owner Net Rev", esKey: 'netOwnerValue', options: { sort: true, filter: true }
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