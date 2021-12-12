
const RevenueStatementHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
    {
        name: "property", label: "Property Code", esKey: 'property.number.keyword', options: { sort: true, filter: true }
    },
    {
        name: "property", label: "Property Name", esKey: 'property.name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "property", label: "State", esKey: 'property.state.keyword', options: { sort: true, filter: true }
    },
    {
        name: "property", label: "Country", esKey: 'property.county.keyword', options: { sort: true, filter: true }
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
        name: "grossPropertyVolume", label: "Sales Vol", esKey: 'grossPropertyVolume.keyword', options: { sort: true, filter: true }
    },
    {
        name: "grossPropertyValue", label: "Gross Rev", esKey: 'grossPropertyValue.keyword', options: { sort: true, filter: true }
    },
    {
        name: "grossOwnerValue", label: "Severence", esKey: 'grossOwnerValue.keyword', options: { sort: true, filter: true }
    },
    {
        name: "netPropertyValue", label: "Deduct Amt", esKey: 'netPropertyValue.keyword', options: { sort: true, filter: true }
    },
    {
        name: "netPropertyValue", label: "Deduct Cd", esKey: 'netPropertyValue.keyword', options: { sort: true, filter: true }
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