
const UnitTractHeadCells = [
  {
    name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
  },
  {
    name: "state", label: "State", esKey: 'state.keyword', options: { sort: true, filter: true }, style: { maxWidth: 70 }
  },
  {
    name: "county", label: "County", esKey: 'county.keyword', options: { sort: true, filter: true }
  },
  {
    name: "name", label: "Tract Name", esKey: 'name.keyword', options: { sort: true, filter: true }, style: { minWidth: 200, maxWidth: 300 }
  },
  {
    name: "meridian", label: "Meridian", esKey: 'meridian.keyword', options: { sort: true, filter: true }
  },
  {
    name: "township", label: "Township", esKey: 'township.keyword', options: { sort: true, filter: true }
  },
  {
    name: "range", label: "Range", esKey: 'range.keyword', options: { sort: true, filter: true }
  },
  {
    name: "section", label: "Section", esKey: 'section.keyword', options: { sort: true, filter: true }
  },
  {
    name: "altSurvey", label: "Alt Survey", esKey: 'altSurvey.keyword', options: { sort: true, filter: true }
  },
  {
    name: "legalDescription", label: "Full Legal Description", esKey: 'legalDescription.keyword', options: { sort: true, filter: true }
  },
  {
    name: "shapeArea", label: "Tract Calc. Acres", esKey: 'shapeArea', options: { sort: true, filter: true }
  },
  {
    name: "sdGrossAcres", label: "Tract Gross Acres", esKey: 'sdGrossAcres', options: { sort: true, filter: true }
  },
  {
    name: "uAcres", label: "Unit Acres", esKey: 'uAcres', options: { sort: true, filter: true }
  },
];

export default UnitTractHeadCells;