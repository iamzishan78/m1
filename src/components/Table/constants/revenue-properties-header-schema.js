const RevenuePropertiesHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },

  {
    name: "number",
    label: "Property#",
    esKey: "number.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 150 }
  },
  {
    name: "name",
    label: "Property Name",
    esKey: "name.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "payorName",
    label: "Payor Name",
    esKey: "operator.name.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 150 }
  },
  {
    name: "state",
    label: "State",
    esKey: "state.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "country",
    label: "Country",
    esKey: "county.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "source",
    label: "Source",
    esKey: "source.keyword",
    options: { sort: true, filter: true },
  },

  {
    name: "wellApiNumber",
    label: "Well API",
    esKey: "well.apiNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "well.wellName.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "status",
    label: "Status",
    esKey: "status.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "type",
    label: "Type",
    esKey: "type.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "amount",
    label: "Decimal",
    esKey: "amount.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "checkNumber",
    label: "Check #",
    esKey: "lastCheck.checkNumber.keyword",
    options: { sort: true, filter: true },
    style: { minWidth: 100 }
  },
  {
    name: "lastChecked",
    label: "Last Check",
    esKey: "lastCheck.checkDate.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "tags",
    label: "Tags",
    esKey: "tags.keyword",
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
];

export default RevenuePropertiesHeadCells;
