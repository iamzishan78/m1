import { GlobalStickyStyles } from "GlobalSettings";

const UnitOwnersTractHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "tractName",
    label: "Tract Name",
    esKey: "tract.tractName.keyword",
    options: {
      ...GlobalStickyStyles({
        setCellProps: {
          maxWidth: "250px",
        },
        setCellHeaderProps: {
          paddingLeft: '24px',
        }
      }),
      sort: true,
      filter: true,
    },
    style: {
      minWidth: 200,
      maxWidth: 300,
    },
  },
  {
    name: "state",
    label: "State",
    esKey: "tract.state.keyword",
    options: {
      sort: true, filter: true,
    },
    style: { maxWidth: 80 },
  },
  {
    name: "county",
    label: "County",
    esKey: "tract.county.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "SurveyMeridian", label: "Survey/ Meridian", esKey: [
      'tract.rurvey.keyword',
      'tract.meridian.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
      sort: true,
      filter: true
    }
  },
  // {
  //   name: "meridian",
  //   label: "Meridian",
  //   esKey: "tract.meridian.keyword",
  //   options: { sort: true, filter: true },
  // },

  {
    name: "BlockTownship", label: "Block/ Township", esKey: [
      'tract.block.keyword',
      'tract.township.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Block?.Township?",
      sort: true,
      filter: true
    }
  },

  // {
  //   name: "township",
  //   label: "Township",
  //   esKey: "tract.township.keyword",
  //   options: { sort: true, filter: true },
  // },

  {
    name: "SectionRange", label: "Section/ Range", esKey: [
      'tract.section.keyword',
      'tract.range.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Section?.Range?",
      sort: true,
      filter: true
    }
  },

  // {
  //   name: "section",
  //   label: "Section",
  //   esKey: "tract.section.keyword",
  //   options: { sort: true, filter: true },
  // },

  {
    name: "AbstractSection", label: "Abstract/ Section", esKey: [
      'tract.abstract.keyword',
      'tract.section.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
      sort: true,
      filter: true
    }
  },

  // {
  //   name: "range",
  //   label: "Range",
  //   esKey: "tract.range.keyword",
  //   options: { sort: true, filter: true },
  // },
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
  { name: "working_interest", esKey: "working_interest", type: "number", label: "WI", options: { filter: true } },
  {
    name: "sdGrossAcres",
    label: "Gross Acres",
    esKey: "tract.sdGrossAcres",
    options: { sort: true, filter: true },
  },
  { name: "net_acres", esKey: "net_acres", label: "Net Acres", type: "number", options: { filter: true } },
  { name: "company_net_acres", esKey: "company_net_acres", label: "Co Net Acres", type: "number", options: { filter: true } },
  { name: "nra", esKey: "nra", label: "NRA", type: "number", options: { filter: true } },
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
  { name: "tractStatus", esKey: "tractStatus.keyword", label: "Tract Status", editable: true, options: { filter: true } },
  { name: "mapStatus", esKey: "mapStatus.keyword", label: "Map Status", editable: true, options: { filter: true } },
  { name: "countAcres", esKey: "countAcres.keyword", label: "Count Acres", options: { filter: true } },
];

UnitOwnersTractHeadCells.forEach((cell) => {
  if (!cell.options.setCellProps && cell.options.display !== false) {
    cell.options.setCellProps = () => ({
      style: {
        minWidth: "initial",
        maxWidth: "initial",
      }
    })
  }
})

export default UnitOwnersTractHeadCells;
