
const UnitTractHeadCells = [
  {
    name: "_id",
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
    name: "state", label: "State", options: { sort: true, filter: true }
  },
  {
    name: "county", label: "County", esKey: '', options: { sort: true, filter: true }
  },
  {
    name: "shapeName", label: "Tract Name", esKey: '', options: { sort: true, filter: true }
  },
  {
    name: "block", label: "Block", esKey: '', options: { sort: true, filter: true }
  },
  {
    name: "section", label: "Section", esKey: '', options: { sort: true, filter: true }
  },
  {
    name: "abstract", label: "Abstract", esKey: '', options: { sort: true, filter: true }
  },
  {
    name: "altSurvey", label: "Alt Survey", esKey: '', options: { sort: true, filter: true }
  },
  { name: "qtr", esKey: '', label: "QTR1", options: { filter: true, customBodyRender: (value) => value && value[0] ? value[0] : 'N/A' } },
  { name: "qtr", esKey: '', label: "QTR2", options: { filter: true, customBodyRender: (value) => value && value[1] ? value[1] : 'N/A' } },
  { name: "qtr", esKey: '', label: "QTR3", options: { filter: true, customBodyRender: (value) => value && value[2] ? value[2] : 'N/A' } },
  { name: "qtr", esKey: '', label: "QTR4", options: { filter: true, customBodyRender: (value) => value && value[3] ? value[3] : 'N/A' } },
  {
    name: "shapeArea", label: "Calc. Acres", esKey: '', options: { sort: true, filter: true }
  },
  {
    name: "uAcres", label: "Unit. Acres", esKey: '', options: { sort: true, filter: true }
  },
];

export default UnitTractHeadCells;