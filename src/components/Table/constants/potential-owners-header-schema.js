/* props is just a style object*/

const SuggestedOwnersHeadCells = [
  /// appears this code is used for the track grid owners 
  {
    name: "id",
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
    name: "entity",
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
    name: "api", label: "Api Number",
    options: { setCellProps: () => ({ style: { minWidth: "200px" } }) }
  },
  {
    name: "wellName",
    label: "Well Name",
    options: { setCellProps: () => ({ style: { minWidth: "175px" } }) }
  },
  {
    name: "lease",
    label: "Lease",
    options: { setCellProps: () => ({ style: { minWidth: "175px" } }) }
  },
  {
    name: "leaseNumber",
    label: "Lease Number",
    options: { setCellProps: () => ({ style: { minWidth: "175px" } }) }
  },
  {
    name: "name", label: "Owner Name",
    options: { setCellProps: () => ({ style: { minWidth: "200px" } }) }
  },
  { name: "ownershipType", label: "Entity Type" },
  { name: "interestType", label: "Type" },
  {
    name: "ownershipPercentage",
    label: "Interest",
  },
  {
    name: "appraisedValue",
    label: "Tax Value",
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
  // {
  //   name: "isTracked",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     sort: false,
  //     searchable: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
  // {
  //   name: "coordinates",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     sort: false,
  //     searchable: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
];


export default SuggestedOwnersHeadCells;
