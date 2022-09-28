import globalSettings from "GlobalSettings";

const wellsColumnHeaders = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "wellData.wellName.keyword",
    options: {
      ...globalSettings.muiGridInfScrollOptions,
      sort: true,
      filter: true,
    },
  },
  {
    name: "api",
    label: "API",
    esKey: "wellData.api.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "state",
    label: "State",
    esKey: "wellData.state.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "county",
    label: "County",
    esKey: "wellData.county.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "wellType",
    label: "Well Type",
    esKey: "wellData.wellType.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "wellStatus",
    label: "Well Status",
    esKey: "wellData.wellStatus.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "operator",
    label: "Operator Name",
    esKey: "wellData.operator.keyword",
    options: {
      display: true,
      filter: true,
    },
  },
  {
    name: "wellBoreProfile",
    label: "Well Profile",
    esKey: "wellData.wellBoreProfile.keyword",
    options: {
      display: true,
      filter: true,
    },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
];

export default wellsColumnHeaders;
