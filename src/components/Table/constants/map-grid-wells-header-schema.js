const wellsColumnHeaders = [
  {
    name: "Id",
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
    name: "ApiNumber",
    label: "API",
    esKey: "api.keyword",
    options: {
      setCellProps: () => ({
        style: {
          minWidth: "200px",
          maxWidth: "200px",
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
          paddingLeft: '35px',
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
    name: "WellName",
    label: "Well Name",
    esKey: "wellName.keyword",
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
    name: "County",
    label: "County",
    esKey: "county.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "WellType",
    label: "Well Type",
    esKey: "wellType.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "WellStatus",
    label: "Well Status",
    esKey: "wellStatus.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "operator",
    label: "Operator Name",
    esKey: "operator.keyword",
    options: {
      display: true,
      filter: true,
    }
  },
  {
    name: "wellBoreProfile",
    label: "Well Profile",
    esKey: "wellBoreProfile.keyword",
    options: {
      display: true,
      filter: true,
    }
  },
  {
    name: "globalWell",
    label: "Global  Well",
    esKey: "Id.keyword",
    options: {
      display: false,
      filter: false,
    }
  },
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
