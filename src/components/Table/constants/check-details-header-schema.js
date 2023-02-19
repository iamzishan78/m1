
import { GlobalStickyStyles } from "GlobalSettings";


const ComponentPropertyName = ({ value, tableMeta }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
            }}>
            <p >
                {value?.split("_")?.[0]
                    ? tableMeta?.rowData[2] ? `${value?.split("_")?.[0]} - ${tableMeta?.rowData[2]}` : value
                    : tableMeta?.rowData[2]}
            </p>
        </div>
    );
}

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
        label: "Property",
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
            sort: true, filter: false,

            customRender: (value, tableMeta) => <ComponentPropertyName value={value} tableMeta={tableMeta} />,
        },
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
        name: "grossOwnerVolume", label: "Owner Volume", esKey: 'grossOwnerVolume', options: { sort: true, filter: true }
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