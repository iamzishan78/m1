const wellsColumnHeaders = [
  {
    name: "ApiNumber",
    label: "API",
  },
  {
    name: "WellName",
    label: "Well Name",
  },
  {
    name: "State",
    label: "State",
  },
  {
    name: "County",
    label: "County",
  },
  {
    name: "WellType",
    label: "Well Type",
  },
  {
    name: "WellStatus",
    label: "Well Status",
  },
  {
    name: "operator",
    label: "Operator Name",
    options:{
      display: false,
    }
  },
  {
    name: "wellBoreProfile",
    label: "Well Profile",
    options:{
      display: false,
    }
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
    label: " ",
    options: {
      searchable: false,
      download: false,
      print: false,
      viewColumns: false,
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
    name: "coordinates",
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

export default wellsColumnHeaders;
