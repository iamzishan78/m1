import vf_currency from "../valueformatters/vf_currency";

const AssociateContactWellHeadCells = [
  {
    name: "wellId",
    options: {
      display: false,
      filter: true,
      searchable: true,
      sort: true,
      download: false,
      print: false,
      empty: true,
      viewColumns: true,
      rowsPerPage: 5,
      rowsPerPageOptions: [5, 25, 100]
    },
  },
  { name: "wellName", label: "Well" },
  { name: "apiNumber", label: "API" },
  {
    name: "propertyName", label: "Property Name", options: {
      // setCellProps: () => ({ style: { minWidth: "200px" } })
    }
  },
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
  {
    name: "value", label: "Tax Value", options: {
      customBodyRender: (value) => {
        if (value) {
          return vf_currency(value)
        }
        return value;
      }
    }
  },
  {
    name: "nra", label: "NRA", options: {
      customBodyRender: (value) => {
        let nra = value;
        if (nra && nra.toString().split('.').length > 0 && nra.toString().split('.')[1].length > 6) {
          return nra.toFixed(6)
        }
        return nra;
      }
    }
  },
  { name: "year", label: "Year", options: { display: false } },
  { name: "globalLod", label: "Global LOD", options: { display: false } },
];

export default AssociateContactWellHeadCells;