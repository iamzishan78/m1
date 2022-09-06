const ownersColumnHeaders = [
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
    name: "OwnerName",
    label: "Name",
    esKey: "ownerName.keyword",
    options: {
      setCellProps: () => ({
        style: {
          minWidth: "350px",
          maxWidth: "350px",
          whiteSpace: "nowrap",
          position: "sticky",
          left: "77px",
          zIndex: 200,
          boxShadow: 'inset -1px 0px 0px 0px lightgrey',
          padding: '0px 25px 0px 0px',
        }
      }),

      // styling props applied to the column header cell
      setCellHeaderProps: () => ({
        style: {
          position: "sticky",
          paddingLeft: '27px',
          zIndex: 201,
          left: "77px",
        }
      }),
      ignoreGlobal: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "OwnerType",
    label: "Owner Type",
    esKey: "ownerType.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "StreetAddress",
    label: "Street Address",
    esKey: "streetAddress.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "City",
    label: "City",
    esKey: "city.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "State",
    label: "State",
    esKey: "state.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "Zip",
    label: "Zip Code",
    esKey: "zip.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  // {
  //   name: "wellCount",
  //   label: "Interest Count",
  //   esKey: "wellCount",
  //   options: {
  //     sort: true,
  //     filter: true,
  //   },
  // },
  // {
  //   name: "tags",
  //   label: "Tags ",
  //   options: {
  //     filter: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     filterOptions: {
  //       names: [],
  //       logic(rowVal, pickedTags) {
  //         let containIts = true;
  //         pickedTags.map((pickedTag) => {
  //           if (rowVal[0].indexOf(pickedTag) === -1) {
  //             containIts = false;
  //           }
  //         });
  //         return !containIts;
  //       },
  //     },
  //   },
  // },
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
  //     searchable: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //     filterOptions: {
  //       names: ["Tracked", "Untracked"],
  //       logic(tracked, filterVal) {
  //         return !(
  //           (filterVal.indexOf("Tracked") >= 0 && tracked) ||
  //           (filterVal.indexOf("Untracked") >= 0 && !tracked)
  //         );
  //       },
  //     },
  //     filterType: "dropdown",
  //   },
  // },
  // {
  //   name: "detailCard",
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

export default ownersColumnHeaders;
