const AcerageSummaryHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "number",
    label: "Agreement #",
    esKey: "number.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "lessor",
    label: "Lessor/Grantor",
    esKey: "lessor.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "lessee",
    label: "Lessee/Grantee",
    esKey: "lesse.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agmtDate",
    label: "Agmt Date",
    esKey: "acquisition.keyword",
    options: { sort: true, filter: true, display: true },
    custom: {
      isDate: true,
    },
  },
  {
    name: "efftvDate",
    label: "Efftv Date",
    esKey: "efftvDate.keyword",
    options: { sort: true, filter: true, display: true },
    custom: {
      isDate: true,
    },
  },

  {
    name: "tractName",
    label: "Tract Name",
    esKey: "tractNamedevelopedNet.keyword",
    options: { sort: true, filter: true },
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
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "block",
    label: "Block/Twsp",
    esKey: "block.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "sec",
    label: "Sec/Range",
    esKey: "sec.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "abstract",
    label: "Abstract/Sec",
    esKey: "abstract.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "legalDescription",
    label: "Legal Description",
    esKey: "legalDescription.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "recDate",
    label: "Rec Date",
    esKey: "recDate.keyword",
    options: { sort: true, filter: true },
    custom: {
      isDate: true,
    },
  },
  {
    name: "book",
    label: "Book",
    esKey: "book.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "page",
    label: "Page",
    esKey: "page.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "instrumentNumber",
    label: "Instrument #",
    esKey: "instrumentNumber.keyword",
    options: { sort: true, filter: true },
  },
];

export default AcerageSummaryHeadCells;
