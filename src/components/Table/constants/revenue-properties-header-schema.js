const RevenuePropertiesHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },

  {
    name: "propertyCode",
    label: "Property Code",
    esKey: "propertyCode.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "propertyName",
    label: "Property Name",
    esKey: "propertyName.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "payorName",
    label: "Payor Name",
    esKey: "payor.name.keyword",
    options: { sort: true, filter: true },
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
    esKey: "country.keyword",
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
    label: "Well Api#",
    esKey: "wellApiNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "wellName.keyword",
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
    label: "Amuount",
    esKey: "amount.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "checkNumber",
    label: "Check #",
    esKey: "checkNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "lastCheckDate",
    label: "Last Check Date",
    esKey: "lastCheckDate.keyword",
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
