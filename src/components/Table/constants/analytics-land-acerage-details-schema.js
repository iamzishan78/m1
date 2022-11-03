const AcerageSummaryHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "agreementId",
    label: "Agreement #",
    esKey: "agreement.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agreementType",
    label: "Agreement Type",
    esKey: "agreementType.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agreementSubType",
    label: "Agreement Subtype",
    esKey: "agreementSubType.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "rights",
    label: "Rights",
    esKey: "rights.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "state",
    label: "State",
    esKey: "state.keyword",
    options: { sort: true, filter: true, display: true },
  },

  {
    name: "county",
    label: "County",
    esKey: "county.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "tractName",
    label: "Tract Name",
    esKey: "tractName.keyword",
    options: { sort: true, filter: true },
  },

  {
    name: "tractStatus",
    label: "Tract Status",
    esKey: "tractStatus.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "110px", maxWidth: "110px" } }),
    },
  },
  {
    name: "reportGross",
    label: "Report Gross",
    esKey: "reportGross.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "250px", maxWidth: "250px" } }),
    },
  },
  {
    name: "gross",
    label: "Gross",
    esKey: "gross.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "225px" } }),
    },
  },
  {
    name: "net",
    label: "Net",
    esKey: "net.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "coNet",
    label: "Co. Net",
    esKey: "coNet.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "nra",
    label: "NRA",
    esKey: "nra.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "acquisitionID",
    label: "Acqusition",
    esKey: "acquisitionID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "prospectID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "internalCompany",
    label: "Internal Company",
    esKey: "internalCompany.keyword",
    options: { sort: true, filter: true },
  },
];

export default AcerageSummaryHeadCells;
