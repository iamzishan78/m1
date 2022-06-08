import { history } from "store";
const RevenuePropertiesHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },

  {
    name: "number",
    label: "Property",
    esKey: "number.keyword",
    options: {
      customRender: (value, tableMeta) => {
        const splitNumber = value?.split("_");
        const styles = {
          minWidth: 150,
          fontWeight: 600,
          color: "#17aadd",
          cursor: "pointer",
        };
        return (
          <p
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/revenue/property/details/${tableMeta.rowData[0]}`);
            }}
            style={styles}
          >
            {/* {splitNumber?.[0]} */}
            {splitNumber?.[0] ? `${splitNumber?.[0]} - ${tableMeta?.rowData[2]}` : tableMeta?.rowData[2]}
          </p>
        );
      },
      sort: true,
      filter: true,
    },
  },
  {
    name: "name",
    label: "Property Name",
    esKey: "name.keyword",
    options: { sort: true, filter: true, display: false },
  },
  {
    name: "payorName",
    label: "Operator",
    esKey: "operator.name.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 150 },
  },
  {
    name: "state",
    label: "State",
    esKey: "state.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "county",
    label: "County",
    esKey: "county.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "source",
    label: "Source",
    esKey: "source.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "120px", maxWidth: "120px" } }),
    },
  },

  {
    name: "wellApiNumber",
    label: "Well API",
    esKey: "wells.apiNumber.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "110px", maxWidth: "110px" } }),
    },
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "wells.wellName.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "230px", maxWidth: "230px" } }),
    },
  },
  // {
  //   name: "type",
  //   label: "Type",
  //   esKey: "type.keyword",
  //   options: { sort: true, filter: true },
  // },
  // {
  //   name: "amount",
  //   label: "Decimal",
  //   esKey: "amount",
  //   options: { sort: true, filter: true },
  // },
  {
    name: "checkNumber",
    label: "Last Check #",
    esKey: "lastCheck.checkNumber.keyword",
    options: {
      customHeadLabelRender: () => (
        <>
          <div style={{ width: 120 }}>Last Check #</div>
        </>
      ),
      sort: true,
      filter: true,
    },
    style: { minWidth: 120 },
  },

  {
    name: "lastChecked",
    label: "Last Check Date",
    esKey: "lastCheck.checkDate",
    options: {
      customHeadLabelRender: () => (
        <>
          <div style={{ width: 120 }}>Last Check</div>
        </>
      ),
      sort: true,
      filter: true,
    },
    style: { minWidth: 120 },
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },

  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
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
    name: "status",
    label: "Status",
    esKey: "status.keyword",
    options: {
      customHeadLabelRender: () => (
        <>
          <div> </div>
        </>
      ),
      sort: true,
      filter: true,
    },
  },
];

export default RevenuePropertiesHeadCells;
