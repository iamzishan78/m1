const AcerageSummaryHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "number",
    label: "API Number",
    esKey: "number.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "lessor",
    label: "Well Name",
    esKey: "lessor.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "lessee",
    label: "Internal ID",
    esKey: "lesse.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agmtDate",
    label: "Operator",
    esKey: "acquisition.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "efftvDate",
    label: "Well Type",
    esKey: "efftvDate.keyword",
    options: { sort: true, filter: true, display: true },
    custom: {
      isDate: true,
    },
  },

  {
    name: "tractName",
    label: "Well Profile",
    esKey: "tractNamedevelopedNet.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "state",
    label: "Well Status",
    esKey: "state.keyword",
    options: { sort: true, filter: true },
  },

  {
    name: "county",
    label: "Basin",
    esKey: "county.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "block",
    label: "Field",
    esKey: "block.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "sec",
    label: "State",
    esKey: "sec.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "abstract",
    label: "County",
    esKey: "abstract.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "legalDescription",
    label: "Survey",
    esKey: "legalDescription.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "recDate",
    label: "Block/Twsp",
    esKey: "recDate.keyword",
    options: { sort: true, filter: true },
    custom: {
      isDate: true,
    },
  },
  {
    name: "book",
    label: "Sec Range",
    esKey: "book.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "page",
    label: "Abstract/Sec",
    esKey: "page.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Spud Date",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Comp Date",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Comp Date",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "First Prod",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Measured Depth",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "TVD",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Lateral Length",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Formation",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Revenue Property",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "NRI",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Pay Status",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "DO Status ",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Cost Free",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Internal Company",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Acquisition",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Prospect",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Classification",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
];

export default AcerageSummaryHeadCells;
