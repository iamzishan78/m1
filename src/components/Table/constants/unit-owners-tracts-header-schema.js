import { vf_currency_to_fixed } from "components/Shared/valueformatters/vf_currency";
import { GlobalStickyStyles } from "GlobalSettings";

const getHeaders = ({ interestMapping, layerType, isTestcase }) => {
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
            left: "77px"
          },
          setCellHeaderProps: {
            paddingLeft: "24px",
            left: "77px"
          },
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
        sort: true,
        filter: true,
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
      name: "basin",
      label: "Basin",
      esKey: "tract.basin.keyword",
      options: { sort: true, filter: true },
    },
    {
      name: "field",
      label: "Field",
      esKey: "tract.field.keyword",
      options: { sort: true, filter: true },
    },
    {
      name: "SurveyMeridian",
      label: "Survey/ Meridian",
      esKey: ["tract.rurvey.keyword", "tract.meridian.keyword"],
      options: {
        dbName: "shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
        sort: true,
        filter: true,
      },
    },
    // {
    //   name: "meridian",
    //   label: "Meridian",
    //   esKey: "tract.meridian.keyword",
    //   options: { sort: true, filter: true },
    // },

    {
      name: "BlockTownship",
      label: "Block/ Township",
      esKey: ["tract.block.keyword", "tract.township.keyword"],
      options: {
        dbName: "shapeJson.properties.originalProperties.0?.Block?.Township?",
        sort: true,
        filter: true,
      },
    },

    // {
    //   name: "township",
    //   label: "Township",
    //   esKey: "tract.township.keyword",
    //   options: { sort: true, filter: true },
    // },

    {
      name: "SectionRange",
      label: "Section/ Range",
      esKey: ["tract.section.keyword", "tract.range.keyword"],
      options: {
        dbName: "shapeJson.properties.originalProperties.0?.Section?.Range?",
        sort: true,
        filter: true,
      },
    },

    // {
    //   name: "section",
    //   label: "Section",
    //   esKey: "tract.section.keyword",
    //   options: { sort: true, filter: true },
    // },

    {
      name: "AbstractSection",
      label: "Abstract/ Section",
      esKey: ["tract.abstract.keyword", "tract.section.keyword"],
      options: {
        dbName: "shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
        sort: true,
        filter: true,
      },
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
    ...(interestMapping?.['Mineral Interest']?.includes(layerType) ? [{ name: "mineral_interest", esKey: "mineral_interest", type: "number", label: "MI", options: { filter: true } }] : []),
    // ...(interestMapping?.['Lease Royalty Interest']?.includes(layerType) ? [{ name: "lease_royalty_interest", esKey: "lease_royalty_interest", type: "number", label: "Lease RI", options: { filter: true } }] : []),
    ...(
      (interestMapping?.['Royalty Interest']?.includes(layerType) || isTestcase)
        ? [
          {
            name: "royalty_interest",
            esKey: "royalty_interest",
            type: "number",
            label: "RI",
            options: { filter: true }
          }
        ]
        : []
    ),
    ...(interestMapping?.['Overriding Royalty Interest (ORRI)']?.includes(layerType) ? [{
      name: "orri",
      label: "ORRI",
      esKey: "orri",
      options: { sort: true, filter: true },
    }] : []),
    ...(interestMapping?.['Working Interest']?.includes(layerType) ? [{ name: "working_interest", esKey: "working_interest", type: "number", label: "WI", options: { filter: true } }] : []),
    {
      name: "sdGrossAcres",
      label: "Gross Acres",
      esKey: "tract.sdGrossAcres",
      options: { sort: true, filter: true },
    },
    { name: "net_acres", esKey: "net_acres", label: "Net Acres", type: "number", options: { filter: true } },
    { name: "company_net_acres", esKey: "company_net_acres", label: "Co Net Acres", type: "number", options: { filter: true } },
    { name: "nra", esKey: "nra", label: "NRA", type: "number", options: { filter: true } },
    { name: "acquisition_nra", esKey: "acquisition_nra", label: "Acquisition $/NRA", type: "number", options: { editable: false, filter: true, customRender: (value) => <p>{vf_currency_to_fixed(value, 2)}</p>, } },
    { name: "acquisition_cost", esKey: "acquisition_cost", label: "Acquisition Cost", type: "number", options: { filter: true, customRender: (value) => <p>{vf_currency_to_fixed(value, 2)}</p>, } },
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
    { name: "department", esKey: "tract.department.keyword", label: "Department", editable: true, options: { filter: true } },
    { name: "mapStatus", esKey: "mapStatus.keyword", label: "Map Status", editable: true, options: { filter: true } },
    { name: "countAcres", esKey: "countAcres.keyword", label: "Count Acres", options: { filter: true } },
    {
      name: "commentsCounter",
      label: " ",
      options: {
        dbName: "comments.comment",
        display: true,
        filter: false,
        searchable: false,
        sort: true,
        download: false,
        print: false,
        viewColumns: false,
      },
    },
  ];

  UnitOwnersTractHeadCells.forEach((cell) => {
    if (!cell.options.setCellProps && cell.options.display !== false) {
      cell.options.setCellProps = () => ({
        style: {
          minWidth: "initial",
          maxWidth: "initial",
        },
      });
    }
  });

  return UnitOwnersTractHeadCells
}

export default getHeaders;
