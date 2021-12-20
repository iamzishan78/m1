const ownersColumnHeaders = [
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
    name: "OwnerName",
    label: "Name",
  },
  {
    name: "OwnerType",
    label: "Owner Type",
  },
  {
    name: "StreetAddress",
    label: "Street Address",
  },
  {
    name: "City",
    label: "City",
  },
  {
    name: "State",
    label: "State",
  },
  {
    name: "Zip",
    label: "Zip Code",
  },

  // {
  //   name: "FullAddress",
  //   label: "Address",
  // },
];

export default ownersColumnHeaders;
