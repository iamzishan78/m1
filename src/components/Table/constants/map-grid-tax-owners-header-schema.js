import { GlobalStickyStyles } from "GlobalSettings";

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

      ...GlobalStickyStyles({
        setCellProps: {
          maxWidth: "350px",
        },
        setCellHeaderProps: {
          paddingLeft: '27px',
        }
      }),
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
