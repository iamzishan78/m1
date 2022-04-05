import { history } from "store";

const RevenueStatementHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "checkId",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "checkNumber",
    label: "Check #",
    esKey: "check.checkNumber.keyword",
    options: {
      customRender: (value, tableMeta) => {
        return (
          <p
            style={{
              fontWeight: 600,
              color: "#17aadd",
              cursor: "pointer",
              minWidth: "100px",
            }}
            onClick={(e) => {
                e.stopPropagation();
                history.push(`/revenue/statement/details/${tableMeta.rowData[1]}`);
            }}
          >
            {value}
          </p>
        );
      },
      sort: true,
      filter: true,
    },
  },
  {
    name: "purchaser",
    label: "Purchaser",
    esKey: "check.payor.name.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 210 }
  },
  {
    name: "number",
    label: "Property #",
    esKey: "property.number.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 150 }
  },
  {
    name: "name",
    label: "Property Name",
    esKey: "property.name.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 210 }
  },
  {
    name: "date",
    label: "Sales Date",
    esKey: "date",
    custom: { key_as_string: true, isDate: true },
    options: { sort: true, filter: true },
  },
  {
    name: "product",
    label: "Product",
    esKey: "product.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "disbursement",
    label: "Decimal Interest",
    esKey: "disbursement.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "interestType",
    label: "Type",
    esKey: "interestType.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "price",
    label: "Avg Price",
    esKey: "price",
    options: { sort: true, filter: true },
  },
  {
    name: "grossOwnerVolume",
    label: "Sales Vol",
    esKey: "grossOwnerVolume",
    options: { sort: true, filter: true },
  },
  {
    name: "grossOwnerValue",
    label: "Gross Rev",
    esKey: "grossOwnerValue",
    options: { sort: true, filter: true },
  },
  {
    name: "ownerTax",
    label: "Severance",
    esKey: "ownerTax",
    options: { sort: true, filter: true },
  },
  {
    name: "ownerDeducts",
    label: "Deduct Amt",
    esKey: "ownerDeducts",
    options: { sort: true, filter: true },
  },
  {
    name: "deductType",
    label: "Deduct Cd",
    esKey: "deductType.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "netOwnerValue",
    label: "Owner Net Rev",
    esKey: "netOwnerValue",
    options: { sort: true, filter: true },
  },
];

export default RevenueStatementHeadCells;
