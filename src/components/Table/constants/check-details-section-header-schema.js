
import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { GlobalStickyStyles } from "GlobalSettings";

const RevenueStatementHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
    {
        name: "number", label: "Property #", esKey: 'property.number.keyword', options: { display: false, sort: false, filter: true, style: { minWidth: 250 }, }
    },
    {
        name: "name", label: "Property Name", esKey: 'property.name.keyword', options: { display: false, sort: false, filter: true }
    },
    {
        /// this is the control column for properties 
        name: "number",
        label: "Check Number",
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
                    paddingLeft: '0px',
                }
            }),
            sort: true, filter: false, viewColumns: false,

            customRender: (value, tableMeta) => {

                return <ColumnWithLink
                    value={value?.split("_")?.[0]
                        ? tableMeta?.rowData[2] ? `${value?.split("_")?.[0]} - ${tableMeta?.rowData[2]}` : value
                        : tableMeta?.rowData[2]}
                    link={`/revenue/property/details/${tableMeta.rowData[29]}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            },
        },
    },
    {
        name: "purchaser", label: "Purchaser", esKey: 'property.purchaser.name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "checkDate", label: "Check Date", esKey: 'checkDate', custom: { key_as_string: true, isDate: true }, options: { sort: true, filter: true }
    },
    {
        name: "ownerNumber", label: "Owner Number", esKey: 'property.ownerNumber.keyword', options: { sort: true, filter: true }
    },
    {
        name: "_owner", label: "Owner", esKey: 'property._owner.name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "depositDate", label: "Deposit Date", esKey: 'depositDate', custom: { key_as_string: true, isDate: true }, options: { sort: true, filter: true }
    },
    {
        name: "checkAmount", label: "Check Amount", esKey: 'check.checkAmount.keyword', options: { sort: true, filter: true }
    },
    {
        name: "source", label: "Source", esKey: 'check.source.keyword', options: { sort: true, filter: true }
    },
    {
        name: "sourceId", label: "Source Id", esKey: 'check.sourceId.keyword', options: { sort: true, filter: true }
    },
    {
        name: "propertyName", label: "Property", esKey: 'property.name.keyword', options: { sort: true, filter: true }
    },
    {
        name: "state", label: "State", esKey: 'property.state.keyword', options: { sort: true, filter: true }
    },
    {
        name: "county", label: "County", esKey: 'property.county.keyword', options: { sort: true, filter: true }
    },
    {
        name: "date", label: "Sales Date", esKey: 'date', custom: { key_as_string: true, isDate: true }, options: { sort: true, filter: true }
    },
    {
        name: "product", label: "Product", esKey: 'product.keyword', options: { sort: true, filter: true }
    },
    {
        name: "disbursement", label: "Decimal Interest", esKey: 'disbursement', options: { sort: true, filter: true }
    },
    {
        name: "interestType", label: "Type", esKey: 'interestType.keyword', options: { sort: true, filter: true }
    },

    {
        name: "price", label: "Avg Price", esKey: 'price', options: { sort: true, filter: true }
    },
    {
        name: "grossPropertyVolume", label: "Prop Gross Volume", esKey: 'grossPropertyVolume', options: { sort: true, filter: true }
    },
    {
        name: "grossPropertyValue", label: "Prop Gross Revenue", esKey: 'grossPropertyValue', options: { sort: true, filter: true }
    },
    {
        name: "grossOwnerVolume", label: "Gross Owner Volume", esKey: 'grossOwnerVolume', options: { sort: true, filter: true }
    },
    {
        name: "grossOwnerValue", label: "Owner Gross Revenue", esKey: 'grossOwnerValue', options: { sort: true, filter: true }
    },
    {
        name: "ownerTax", label: "Owner Tax Amt", esKey: 'ownerTax', options: { sort: true, filter: true }
    },
    {
        name: "taxType", label: "Tax Type", esKey: 'taxType', options: { sort: true, filter: true }
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
        name: "propertyId", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
];

export default RevenueStatementHeadCells;