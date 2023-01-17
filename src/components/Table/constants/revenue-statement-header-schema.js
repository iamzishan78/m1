import { GlobalStickyStyles } from "GlobalSettings";
import { useHistory } from "react-router-dom";
import vf_currency from "components/Shared/valueformatters/vf_currency";

const styles = {
  width: "fit-content",
  fontWeight: 600,
  color: "#17aadd",
  cursor: "pointer",
};

const ComponentPropertyName = ({ value, tableMeta }) => {
  const history = useHistory();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
      // style={{borderRight: 'solid red'}}
    >
      <a
        href={`/revenue/statement/details/${tableMeta.rowData[0]}`}
        onClick={(e) => {
          e.stopPropagation();
          history.push(`/revenue/statement/details/${tableMeta.rowData[0]}`);
        }}
        style={styles}
      >
        {(value ? `${value}- ${tableMeta?.rowData[2]}` : tableMeta?.rowData[2]) || "NA"}
      </a>
    </div>
  );
};

const RevenueStatementHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },

  {
    name: "checkNumber",
    label: "Check Number",
    esKey: "checkNumber.keyword",
    options: {
      ...GlobalStickyStyles({
        setCellProps: {
          left: "108px",
        },
        setCellHeaderProps: {
          left: "108px",
        },
      }),
      customRender: (value, tableMeta) => <ComponentPropertyName value={value} tableMeta={tableMeta} />,
      sort: true,
      filter: true,
    },
  },
  {
    name: "purchaserName",
    label: "Purchaser Name",
    esKey: "payor.name.keyword",
    options: {
      display: false,
    },
  },
  {
    name: "checkAmount",
    label: "Check Amount",
    esKey: "checkAmount",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => {
        return value ? <p>{value ? `${vf_currency(value?.toFixed(2))}` : ""}</p> : <p style={{ color: "#898989b0" }}>N/A</p>;
      },
    },
  },
  {
    name: "checkDate",
    label: "Check Date",
    esKey: "checkDate",
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },
  {
    name: "depositDate",
    label: "Deposit Date",
    esKey: "depositDate",
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },
  {
    name: "lines",
    label: "Lines",
    esKey: "checkDetail.lines",
  },
  {
    name: "source",
    label: "Source",
    esKey: "source.keyword",
  },
  {
    name: "sourceId",
    label: "Check ID",
    esKey: "sourceId.keyword",
  },
  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: {
      ignoreGlobal: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      dbName: "comments.comment",
      ignoreGlobal: true,
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "isAmountValidated",
    label: "Validation",
    esKey: "isAmountValidated",
    options: {
      ignoreGlobal: true,
      customHeadLabelRender: () => (
        <>
          <div> </div>
        </>
      ),
      display: true,
      sort: false,
      filter: false,
      viewColumns: false,
    },
    custom: {
      key_as_string: true,
      formatedFilterOptions: [
        {
          label: "Validated",
          value: "true",
        },
        {
          label: "Potential Issues",
          value: "false",
        },
      ],
    },
  },
];

export default RevenueStatementHeadCells;
