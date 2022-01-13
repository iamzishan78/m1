import { history } from "store";

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
      sort: true, 
      filter: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          value ? 
          <p
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/revenue/statement/details?id=${tableMeta.rowData[0]}`);
            }}
            style={{ fontWeight: 600, color: "#17aadd", cursor: "pointer" }}
          >
            {value}
          </p> :
          <p style={{ color: '#898989b0' }}>N/A</p>
        );
      }, 
    },
  },
  {
    name: "purchaserName",
    label: "Purchaser Name",
    esKey: "payor.name.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 250 },
  },
  {
    name: "checkAmount",
    label: "Check Amount",
    esKey: "checkAmount",
    options: { 
      sort: true, 
      filter: true,               
      customBodyRender: (value) => {
        return value ? <p style={{ fontWeight: 600 }}>{ value ? `$${value}` : '' }</p> : <p style={{ color: '#898989b0' }}>N/A</p>;
      }, 
    },
  },
  {
    name: "checkDate",
    label: "Check Date",
    esKey: "checkDate",
    options: { sort: true, filter: true },
    custom:{
      key_as_string: true,
    }
  },
  {
    name: "depositDate",
    label: "Deposit Date",
    esKey: "depositDate",
    options: { sort: true, filter: true },
    custom:{
      key_as_string: true,
    }
  },
  {
    name: "lines",
    label: "Lines",
    esKey: "checkDetail.lines",
    options: { sort: true, filter: true },
  },
  {
    name: "source",
    label: "Source",
    esKey: "source.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "sourceId",
    label: "Check ID",
    esKey: "sourceId.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "status",
    label: "Status",
    esKey: "status.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "tags",
    label: "Tags",
    esKey: 'tags.tag.keyword',
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
  {
    name: "validation",
    label: " ",
    esKey: "validation.keyword",
    options: { sort: false, filter: false, viewColumns: false },
  },
  {
    name: "validation",
    label: "Validation",
    esKey: "validation.keyword",
    options: { display: false, sort: false, filter: true, viewColumns: false },
    custom:{
      filterOptions: [
        {
          key: "Validated",
        },
        {
          key: "Potential Issues",
        },
      ],
    }
  },
];

export default RevenueStatementHeadCells;
