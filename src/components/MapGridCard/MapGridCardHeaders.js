export const ownersColumnHeaders = [
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
    name: "ownershipType",
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

export const operatorsColumnHeaders = [
  {
    name: "Operator",
    label: "Operator",
  },
  {
    name: "StateCount",
    label: "# Active States",
  },
  {
    name: "BasinCount",
    label: "# Active Basins",
  },
  // {
  //   name: "TotalLeases",
  //   label: "Total Leases",
  // },
  {
    name: "TotalWellCount",
    label: "Total Wells",
  },
  {
    name: "GasWellCount",
    label: "Gas Wells",
  },
  {
    name: "OilWellCount",
    label: "Oil Wells",
  },
  {
    name: "ActiveWellCount",
    label: "Active Wells",
  },
  {
    name: "DUCWellCount",
    label: "DUCs",
  },
  {
    name: "PermitCount",
    label: "Active Permits",
  },
];

export const leasesColumnHeaders = [
  {
    name: "Lease",
    label: "Lease",
  },
  {
    name: "LeaseId",
    label: "Lease Number",
  },
  {
    name: "State",
    label: "State",
  },
  {
    name: "County",
    label: "County",
  },
  // {
  //   name: "Acreage",
  //   label: "Acreage",
  // },
  {
    name: "BasinCount",
    label: "Basin Count",
  },
  {
    name: "PlayCount",
    label: "Play Count",
  },
  {
    name: "FormationCount",
    label: "Formation Count",
  },
  {
    name: "OperatorCount",
    label: "Operator Count",
  },
  {
    name: "TotalWellCount",
    label: "Total Wells",
  },
  {
    name: "GasWellCount",
    label: "Gas Wells",
  },
  {
    name: "OilWellCount",
    label: "Oil Wells",
  },
  {
    name: "ActiveWellCount",
    label: "Active Wells",
  },
  {
    name: "DUCWellCount",
    label: "DUC Wells",
  },
  {
    name: "PermitCount",
    label: "Active Permits",
  },
];

export const locationsColumnHeaders = [
  {
    name: "Primary",
    label: "Location Name",
  },
  {
    name: "Secondary",
    label: "Location Address",
  },
];
