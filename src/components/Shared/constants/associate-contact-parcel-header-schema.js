const AssociateContactWellHeadCells = [
  {
    name: "_id",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      empty: false,
      viewColumns: false,
    },
  },
  { 
    name: "name", 
    label: "Owner Name",
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
  { name: "parcelName", label: "Parcel Name" },
  { name: "state", label: "State" },
  { name: "county", label: "County" },
  { name: "survey", label: "Survey / Meridian" },
  { name: "block", label: "Block / Township" },
  { name: "section", label: "Section / Range" },
  { name: "abstract", label: "Abstract / Section" },
  { name: "grantee", label: "Alternate Survey" },
  { name: "qtr_calls", label: "QTR Calls" },
  { name: "qtr", label: "QTR", 
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
  { name: "surface_interest", label: "Surface Interest" },
  { name: "mineral_interest", label: "Mineral Interest" },
  { name: "royalty_interest", label: "Royalty Interest" },
  { name: "orri", label: "ORRI" },
  { name: "record_title", label: "Record Title" },
  { name: "operating_rights", label: "Operating Rights" },
  { name: "nri", label: "NRI" },
  { name: "net_acres", label: "Net Acres" },
  { name: "nra", label: "NRA", editable: true, options:{ setCellProps: () => ({ style: { maxWidth: "70px"}})} },
  { name: "depthFrom", label: "Depth From" },
  { name: "depthTo", label: "Depth To" },

  {
    name: "parcelId",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      empty: false,
      viewColumns: false,
    },
  },
  {
    name: "tags",
    label: "Tags ",
    options: {
      sort: false,
      filter: false,
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
      sort: false,
      filter: false,
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
    name: "detailCard",
    label: " ",
    options: {
      filter: false,
      sort: false,
      searchable: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
];

export default AssociateContactWellHeadCells;
