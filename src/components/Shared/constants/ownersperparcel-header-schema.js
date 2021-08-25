
const OwnersPerParcelHeadCells = [
  {
    name: "_id",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "ownerEntity",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "name",
    label: "Owner Name",
    options: { setCellProps: () => ({ style: { minWidth: "270px" } }) }
  },
  { name: "surface_interest", label: "Surface Interest" },
  { name: "mineral_interest", label: "Mineral Interest" },
  { name: "royalty_interest", label: "Royalty Interest" },
  { name: "orri", label: "ORRI" },
  { name: "unknown_interest", label: "Unknown Interest" },
  { name: "record_title", label: "Record Title" },
  { name: "operating_rights", label: "Operating Rights" },
  { name: "nri", label: "NRI" },
  { name: "net_acres", label: "Net Acres" },
  { name: "nra", label: "NRA", editable: true, options: { setCellProps: () => ({ style: { maxWidth: "70px" } }) } },
  { name: "depthFrom", label: "Depth From", editabe: true },
  { name: "depthTo", label: "Depth To", editabe: true },
  { name: "qtr_calls", label: "QTR Calls" },
  {
    name: "qtr", label: "QTR",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "tags",
    label: "Tags ",
    options: {
      sort: false,
      download: false,
      print: false,
      filterOptions: {
        names: [],
        logic(rowVal, pickedTags) {
          let containIts = true;
          pickedTags.map((pickedTag) => {
            if (rowVal[0].indexOf(pickedTag) === -1) {
              containIts = false;
            }
          });
          return !containIts;
        },
      },
    },
  },
  {
    name: "isContact",
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
  {
    name: "isTracked",
    label: "Track",
    options: {
      searchable: false,
      download: false,
      print: false,
      filterOptions: {
        names: ["Tracked", "Untracked"],
        logic(tracked, filterVal) {
          return !(
            (filterVal.indexOf("Tracked") >= 0 && tracked) ||
            (filterVal.indexOf("Untracked") >= 0 && !tracked)
          );
        },
      },
      filterType: "dropdown",
    },
  },
  {
    name: "isSuggested",
    label: " ",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "isOverridden",
    label: " ",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },

];

export default OwnersPerParcelHeadCells;

