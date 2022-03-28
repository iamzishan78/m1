
export const RevenueStatementHeadCells = [
    {
        id: "property.number", title: "Property #", filterKey: 'property.number.keyword', sort: true, type: 'autocomplete', width: '180px'
    },
    {
        id: "property.name", title: "Property Name", filterKey: 'property.name.keyword', sort: true, width: '210px', disabled: true
    },
    {
        id: "property.state", title: "State", filterKey: 'property.state.keyword', sort: true, width: '100px', disabled: true
    },
    {
        id: "property.county", title: "County", filterKey: 'property.county.keyword', sort: true, width: '130px', disabled: true
    },
    {
        id: "date", title: "Sales Date", filterKey: 'date', sort: true, type: 'date', width: '180px'
    },
    {
        id: "product", title: "Product", filterKey: 'product.keyword', sort: true, type: 'autocomplete', width: '130px'
    },
    {
        id: "disbursement", title: "Decimal Interest", filterKey: 'disbursement', sort: true, width: '150px'
    },
    {
        id: "interestType", title: "Type", filterKey: 'interestType.keyword', sort: true, type: 'autocomplete', width: '100px'
    },
    {
        id: "price", title: "Avg Price", filterKey: 'price', sort: true, width: '100px'
    },
    {
        id: "grossOwnerVolume", title: "Sales Volume", filterKey: 'grossOwnerVolume', sort: true, width: '125px'
    },
    {
        id: "grossOwnerValue", title: "Gross Revenue", filterKey: 'grossOwnerValue', sort: true, width: '100px'
    },
    {
        id: "ownerTax", title: "Severance Tax", filterKey: 'ownerTax', sort: true, width: '100px'
    },
    {
        id: "ownerDeducts", title: "Deduct Amount", filterKey: 'ownerDeducts', sort: true, width: '100px'
    },
    {
        id: "deductType", title: "Deduct Code", filterKey: 'deductType.keyword', sort: true, type: 'autocomplete', width: '200px'
    },
    {
        id: "netOwnerValue", title: "Owner Net Revenue", filterKey: 'netOwnerValue', sort: true, width: '150px'
    },
    {
        id: "action", filterKey: 'action', title: "", type: 'action', width: '50px'
    }
];
