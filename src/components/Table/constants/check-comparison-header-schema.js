import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { GlobalStickyStyles } from "GlobalSettings";
import { ErrorOutline } from "@material-ui/icons";

const RevenueStatementHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },

  {
    /// this is the control column for properties
    name: "checkNumber",
    label: "Check Number",
    esKey: "property.checkNumber.keyword",
    options: {
      ...GlobalStickyStyles({
        setCellProps: {
          left: "124px",
          maxWidth: "300px",
        },
        setCellHeaderProps: {
          left: "124px",
          mixWidth: "300px",
          paddingLeft: "0px",
        },
      }),
      sort: true,
      filter: false,
      viewColumns: false,

      customRender: (value, tableMeta) => {
        const interestAmount = tableMeta?.rowData[10];
        const decimalInterest = tableMeta.rowData[29];
        const showMismatchedFlag = interestAmount && decimalInterest && interestAmount !== decimalInterest;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ColumnWithLink
              value={
                value?.split("_")?.[0]
                  ? tableMeta?.rowData[2]
                    ? `${value?.split("_")?.[0]} - ${tableMeta?.rowData[2]}`
                    : value
                  : tableMeta?.rowData[2]
              }
              link={`/revenue/statement/details/${tableMeta.rowData[30]}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            {showMismatchedFlag && (
              <div style={{ marginLeft: "15px", cursor: "pointer" }}>
                <ErrorOutline
                  style={{
                    width: "17px",
                    height: "17px",
                    color: "red",
                  }}
                />
              </div>
            )}
          </div>
        );
      },
    },
  },
  {
    name: "number",
    label: "Operator Prop #",
    esKey: "property.number.keyword",
    options: { sort: true, filter: true, style: { minWidth: 250 } },
  },
  {
    name: "accRefID",
    label: "Accounting Ref ID",
    esKey: "property.internalID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "companyID",
    label: "Company ID",
    esKey: "property.internalID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "prospectID",
    label: "Prospect ID",
    esKey: "property.prospectID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "acquisitionID",
    label: "Acquisition ID",
    esKey: "property.acquisitionID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "operator",
    label: "Operator",
    esKey: "property.operator.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "purchaser",
    label: "Purchaser Name",
    esKey: "property.purchaser.name.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "interestType",
    label: "Interest Type",
    esKey: "property.interest.interestType.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "interestAmount",
    label: "Interest Amount",
    esKey: "property.interest.interestAmount",
    options: { sort: true, filter: true },
  },
  {
    name: "effectiveDate",
    label: "Effective Date",
    esKey: "property.interest.effectiveDate",
    custom: { key_as_string: true, isDate: true },
    options: { sort: true, filter: true },
  },
  {
    name: "endDate",
    label: "End Date",
    esKey: "property.interest.endDate",
    custom: { key_as_string: true, isDate: true },
    options: { sort: true, filter: true },
  },
  {
    name: "interestStatus",
    label: "status",
    esKey: "property.interest.status.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "costFree",
    label: "Cost Free",
    esKey: "property.interest.costFree.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "wellApiNumber",
    label: "Well API",
    esKey: "wells.apiNumber.keyword",
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "wells.wellName.keyword",
  },
  {
    name: "checkDate",
    label: "Check Date",
    esKey: "check.checkDate",
    custom: { key_as_string: true, isDate: true },
    options: { sort: true, filter: true },
  },
  {
    name: "ownerNumber",
    label: "Owner Number",
    esKey: "property.ownerNumber.keyword",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "_owner",
    label: "Owner",
    esKey: "property._owner.name.keyword",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "depositDate",
    label: "Deposit Date",
    esKey: "check.depositDate",
    custom: { key_as_string: true, isDate: true },
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "checkAmount",
    label: "Check Amount",
    esKey: "check.checkAmount",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "source",
    label: "Source",
    esKey: "check.source.keyword",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "sourceId",
    label: "Source Id",
    esKey: "check.sourceId.keyword",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "propertyName",
    label: "Property Name",
    esKey: "property.name.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "state",
    label: "State",
    esKey: "property.state.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "county",
    label: "County",
    esKey: "property.county.keyword",
    options: { sort: true, filter: true },
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
    esKey: "disbursement",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "checkId",
    label: "Check Id",
    esKey: "check._id.keyword",
    options: { display: false, sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "differnce",
    label: "Difference",
    esKey: "differnce",
    options: { sort: true, filter: true },
  },
  {
    name: "percentageDifference",
    label: "% Difference",
    esKey: "percentageDifference",
    options: { sort: true, filter: true },
  },
  {
    name: "potentialGainLoss",
    label: "Potential Gain/Loss",
    esKey: "potentialGainLoss",
    options: { sort: true, filter: true },
  },
  {
    name: "purchaserNumber",
    label: "Purchaser Prop #",
    esKey: "property.purchaserNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "status",
    label: "Pay Status",
    esKey: "property.status.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "price",
    label: "Avg Price",
    esKey: "price",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "grossPropertyVolume",
    label: "Prop Gross Volume",
    esKey: "grossPropertyVolume",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "grossPropertyValue",
    label: "Prop Gross Revenue",
    esKey: "grossPropertyValue",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "grossOwnerVolume",
    label: "Gross Owner Volume",
    esKey: "grossOwnerVolume",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "grossOwnerValue",
    label: "Owner Gross Revenue",
    esKey: "grossOwnerValue",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "ownerTax",
    label: "Owner Tax Amt",
    esKey: "ownerTax",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "taxType",
    label: "Tax Type",
    esKey: "taxType.keyword",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "ownerDeducts",
    label: "Deduct Amt",
    esKey: "ownerDeducts",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "deductType",
    label: "Deduct Cd",
    esKey: "deductType.keyword",
    options: { sort: true, filter: true }, //not mentioned in the ticket
  },
  {
    name: "netOwnerValue",
    label: "Owner Net Rev",
    esKey: "netOwnerValue",
    options: { sort: true, filter: true },
  },
  {
    name: "propertyId",
    options: { filter: false, display: false, sort: false, viewColumns: false }, //not mentioned in the ticket
  },
];

export default RevenueStatementHeadCells;
