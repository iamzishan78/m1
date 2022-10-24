const AcerageSummaryHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
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
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "prospect",
    label: "Prospect",
    esKey: "prospect.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "acquisition",
    label: "Acquisition",
    esKey: "acquisition.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "developedReportGross",
    label: "Developed Report Gross",
    esKey: "developedReportGross.keyword",
    options: { sort: true, filter: true, display: true },
  },

  {
    name: "developedNet",
    label: "Developed Net",
    esKey: "developedNet.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "developedCoNet",
    label: "Developed Co. Net",
    esKey: "developedCoNet.keyword",
    options: { sort: true, filter: true },
  },

  {
    name: "unDevelopedReportGross",
    label: "Undeveloped Report Gross",
    esKey: "unDevelopedReportGross.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "110px", maxWidth: "110px" } }),
    },
  },
  {
    name: "unDevelopedNet",
    label: "Undeveloped Net",
    esKey: "unDevelopedNet.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "250px", maxWidth: "250px" } }),
    },
  },
  {
    name: "unDevelopedCoNet",
    label: "Undeveloped Co. Net",
    esKey: "unDevelopedCoNet.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "225px" } }),
    },
  },
  {
    name: "netRoyaltyAcres",
    label: "Net Royalty Acres",
    esKey: "netRoyaltyAcres.keyword",
    options: { sort: true, filter: true },
  },
];

export default AcerageSummaryHeadCells;
