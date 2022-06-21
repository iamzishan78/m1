const UnitOwnersTractHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "state",
    label: "State",
    esKey: "tract.state.keyword",
    options: { sort: true, filter: true },
    style: { maxWidth: 80 },
  },
  {
    name: "county",
    label: "County",
    esKey: "tract.county.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "tractName",
    label: "Tract Name",
    esKey: "tract.tractName.keyword",
    options: {
      sort: true,
      filter: true,
    },
    style: {
      minWidth: 200,
      maxWidth: 300,
    },
  },
  {
    name: "meridian",
    label: "Meridian",
    esKey: "tract.meridian.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "township",
    label: "Township",
    esKey: "tract.township.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "section",
    label: "Section",
    esKey: "tract.section.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "range",
    label: "Range",
    esKey: "tract.range.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "qtrQtrSelection",
    label: "QTR Calls",
    esKey: "tract.qtrQtrSelection.selectedQtr.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => {
        let qtrCalls = "";
        value?.selectedQtr?.forEach((qtrValue) => {
          qtrCalls += `${qtrValue} `;
        });
        return <p style={{ minWidth: 100 }}>{qtrCalls}</p>;
      },
    },
  },
  {
    name: "name",
    label: "Name",
    esKey: "contact.entityDetail.name.keyword",
    options: { sort: true, filter: true },
  },
  { name: "mineral_interest", esKey: "mineral_interest", type: "number", label: "MI", options: { filter: true } },
  { name: "royalty_interest", esKey: "royalty_interest", type: "number", label: "RI", options: { filter: true } },

  {
    name: "orri",
    label: "ORRI",
    esKey: "orri",
    options: { sort: true, filter: true },
  },
  {
    name: "sdGrossAcres",
    label: "Gross Acres",
    esKey: "tract.sdGrossAcres",
    options: { sort: true, filter: true },
  },
  { name: "net_acres", esKey: "net_acres", label: "Net Acres", type: "number", options: { filter: true } },
  {
    name: "depthFrom",
    label: "Depth From",
    esKey: "depthFrom.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "depthTo",
    label: "Depth To",
    esKey: "depthTo.keyword",
    options: { sort: true, filter: true },
  },
  { name: "countAcres", esKey: "countAcres.keyword", label: "Count Acres", options: { filter: true } },
  { name: "tractStatus", esKey: "tractStatus.keyword", label: "Tract Status", editable: true, options: { filter: true } },
  { name: "mapStatus", esKey: "mapStatus.keyword", label: "Map Staus", editable: true, options: { filter: true } },
];

export default UnitOwnersTractHeadCells;
