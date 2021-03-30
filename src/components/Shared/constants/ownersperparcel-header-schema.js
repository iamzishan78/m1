
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
  { name: "name", 
    label: "Name",
    options:{ setCellProps: () => ({ style: { minWidth: "270px"}})} 
  },
  {
    name: "entity",
    label: "Entity",
    editable: true,
    dropDownOptions: [
      "Corporation",
      "Educational Institution",
      "Governmental Body",
      "Individual",
      "Non Profit",
      "Religious Institution",
      "Trust",
      "Unknown",
    ],
    options:{ setCellProps: () => ({ style: { maxWidth: "185px"}})}
  },

  { name: "depthFrom", label: "Depth From", editabe: true },
  { name: "depthTo", label: "Depth To", editabe: true },

  {
    name: "type",
    label: "Type",
    editabe: true,
    dropDownOptions: [
      "Fee Interest",
      "Leasehold",
      "Mineral Interest",
      "Non-Executive Mineral Interest (NEMI)",
      "Overriding Royalty (ORRI)",
      "Royalty Interest (NPRI)",
      "Surface Rights",
      "Unknown",
      "Working Interest",
    ],
  },
  { name: "interest", label: "Interest", editable: true, options:{ setCellProps: () => ({ style: { maxWidth: "70px"}})}},
  { name: "nma", label: "NMA", editable: true, options:{ setCellProps: () => ({ style: { maxWidth: "70px"}})}},
  { name: "nra", label: "NRA", editable: true, options:{ setCellProps: () => ({ style: { maxWidth: "70px"}})} },
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
];

export default OwnersPerParcelHeadCells;
