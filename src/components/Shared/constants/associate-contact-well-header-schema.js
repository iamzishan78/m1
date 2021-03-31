
const AssociateContactWellHeadCells = [
  {
    name: "wellId",
    options: {
      display: false,
      filter: true,
      searchable: true,
      sort: false,
      download: false,
      print: false,
      viewColumns: true,
    },
  },
  { name: "wellName", label: "Well" },
  { name: "apiNumber", label: "API" },
  { name: "leaseId", label: "Lease" },
  { name: "leaseAcres", label: "Lease Acres" },
  { name: "interestOwner", label: "Interest Owner" },
  {
    name: "entity",
    label: "Entity",
    options: {
      display: false
    }
  },
  { name: "type", label: "Type" },
  { name: "interest", label: "Interest" },
  { name: "value", label: "Tax Value" },
  { name: "nra", label: "NRA" },
  { name: "year", label: "Year", options: { display: false } },
  { name: "globalLod", label: "Global LOD", options: { display: false } },
];

export default AssociateContactWellHeadCells;