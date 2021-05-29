
const ContactWellHeadCells = [
  {
    name: "wellId",
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
  { name: "wellName", label: "Well", options: {
    sort: false,
    filter: false,
  } },
  { name: "api", label: "API", options: {
    sort: false,
    filter: false,
  } },
  { name: "leaseId", label: "Lease Id", options: {
    display: false,
    filter: false,
    searchable: false,
    sort: false,
    download: false,
    print: false,
    viewColumns: false,
  } },
  { name: "lease", label: "Lease Name", options: {
    display: false,
    filter: false,
    searchable: false,
    sort: false,
    download: false,
    print: false,
    viewColumns: false,
  } },
  { name: "leaseDescription", label: "Lease", options: {
    sort: false,
    filter: false,
  } },
  { name: "leaseAcres", label: "Lease Acres", options: {
    sort: false,
    filter: false,
  } },
  { name: "interestOwner", label: "Interest Owner", options: {
    sort: false,
    filter: false,
  } },
  { name: "entity", label: "Entity", options: {
    display: false,
    filter: false,
    searchable: false,
    sort: false,
    download: false,
    print: false,
    viewColumns: false,
  } },
  { name: "type", label: "Type", options: {
    sort: false,
    filter: false,
  } },
  { name: "amount", label: "Amount", options: {
    sort: false,
    filter: false,
  } },
  { name: "taxValue", label: "Tax Value", options: {
    sort: false,
    filter: false,
  } },
  { name: "nra", label: "NRA", options: {
    sort: false,
    filter: false,
  } },
  { name: "year", label: "Year", options: {
    display: false,
    filter: false,
    searchable: false,
    sort: false,
    download: false,
    print: false,
    viewColumns: false,
  } },
  { name: "globalLod", label: "Global LOD", options: {
    display: false,
    filter: false,
    searchable: false,
    sort: false,
    download: false,
    print: false,
    viewColumns: false,
  } },
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
  { name: "isOverridden", label: "is Overridden", options: {
    display: false,
    filter: false,
    searchable: false,
    sort: false,
    download: false,
    print: false,
    viewColumns: false,
  } },
];

export default ContactWellHeadCells;