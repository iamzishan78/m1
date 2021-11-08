
const UnitTractHeadCells = [
  {
    name: "_id", options: { filter: false, display: false, sort: false }
  },
  {
    name: "state", label: "State", esKey: 'state.keyword', options: { sort: true, filter: true }
  },
  {
    name: "county", label: "County", esKey: 'county.keyword', options: { sort: true, filter: true }
  },
  {
    name: "name", label: "Tract Name", esKey: 'name.keyword', options: { sort: true, filter: true }
  },
  {
    name: "block", label: "Block", esKey: 'block.keyword', options: { sort: true, filter: true }
  },
  {
    name: "section", label: "Section", esKey: 'section.keyword', options: { sort: true, filter: true }
  },
  {
    name: "abstract", label: "Abstract", esKey: 'abstract.keyword', options: { sort: true, filter: true }
  },
  {
    name: "altSurvey", label: "Alt Survey", esKey: 'altSurvey.keyword', options: { sort: true, filter: true }
  },
  { name: "qtr", esKey: '', label: "QTR1", options: { filter: true, customBodyRender: (value) => value && value[0] ? value[0] : 'N/A' } },
  { name: "qtr", esKey: '', label: "QTR2", options: { filter: true, customBodyRender: (value) => value && value[1] ? value[1] : 'N/A' } },
  { name: "qtr", esKey: '', label: "QTR3", options: { filter: true, customBodyRender: (value) => value && value[2] ? value[2] : 'N/A' } },
  { name: "qtr", esKey: '', label: "QTR4", options: { filter: true, customBodyRender: (value) => value && value[3] ? value[3] : 'N/A' } },
  {
    name: "shapeArea", label: "Calc. Acres", esKey: 'shapeArea', options: { sort: true, filter: true }
  },
  {
    name: "uAcres", label: "Unit. Acres", esKey: 'uAcres', options: { sort: true, filter: true }
  },
];

export default UnitTractHeadCells;