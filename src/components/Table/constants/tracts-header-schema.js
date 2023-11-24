import { history } from "store";
import { GlobalStickyStyles } from "GlobalSettings";

import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";

const TractsHeadCells = (isSnapGrid = false) => [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    /// this is the control column for tracts
    name: "name",
    label: "Tract Name",
    esKey: "name.keyword",

    options: {
      ...GlobalStickyStyles({ isSnapGrid }),
      dbName: "name",

      customRender: (value, tableMeta) => {
        const splitNumber = typeof value === "string" ? value?.split("_") : value;

        return (
          <ColumnWithLink
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/map/parcels/${tableMeta.rowData[0]}`, { showTractsBreadcrumb: !isSnapGrid });
            }}
            value={splitNumber?.[0] ? `${splitNumber?.[0]} - ${tableMeta?.rowData[2]}` : tableMeta?.rowData[2]}
            link={`/map/parcels/${tableMeta.rowData[0]}`}
          />
        );
      },
    },
  },
  {
    name: "State",
    label: "State",
    esKey: "shapeJson.properties.originalProperties.State.keyword",
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.State",
      sort: true,
      filter: true,
    },
  },
  {
    name: "County",
    label: "County",
    esKey: "shapeJson.properties.originalProperties.County.keyword",
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.County",
    },
  },
  {
    name: "SurveyMeridian",
    label: "Survey/ Meridian",
    esKey: ["shapeJson.properties.originalProperties.Survey.keyword", "shapeJson.properties.originalProperties.PrincipalMeridian.keyword"],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
      sort: true,
      filter: true,
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "BlockTownship",
    label: "Block/ Township",
    esKey: ["shapeJson.properties.originalProperties.Block.keyword", "shapeJson.properties.originalProperties.Township.keyword"],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Block?.Township?",
      sort: true,
      filter: true,
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "SectionRange",
    label: "Section/ Range",
    esKey: ["shapeJson.properties.originalProperties.Section.keyword", "shapeJson.properties.originalProperties.Range.keyword"],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Section?.Range?",
      sort: true,
      filter: true,
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "AbstractSection",
    label: "Abstract/ Section",
    esKey: ["shapeJson.properties.originalProperties.AbstractName.keyword", "shapeJson.properties.originalProperties.ShortName.keyword"],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
      sort: true,
      filter: true,
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "GrossAcres",
    label: "Gross Acres",
    esKey: "shapeJson.properties.sdGrossAcres.keyword",
    options: {
      dbName: "shapeJson.properties.sdGrossAcres",
    },
  },
  {
    name: "CalcAcres",
    label: "Calc Acres",
    esKey: "shapeJson.properties.shapeArea.keyword",
    options: {
      dbName: "shapeJson.properties.shapeArea",
    },
  },
  {
    label: "Target Pricing (per NMA)",
    name: "uUnitPricingNMA",
    esKey: 'shapeJson.properties.uUnitPricingNMA',
    options: {
      dbName: "shapeJson.properties.uUnitPricingNMA",
      sort: true,
      filter: true,
    },
  },

  {
    label: "Max Pricing (per NMA)",
    name: "uMaxUnitPricingNMA",
    esKey: 'shapeJson.properties.uMaxUnitPricingNMA',
    options: {
      dbName: "shapeJson.properties.uMaxUnitPricingNMA",
      sort: true,
      filter: true,
    },
  },
  {
    label: "Target Pricing (per NRA)",
    name: "uUnitPricing",
    esKey: 'shapeJson.properties.uUnitPricing',
    options: {
      dbName: "shapeJson.properties.uUnitPricing",
      sort: true,
      filter: true,
    },
  },

  {
    label: "Max Pricing (per NRA)",
    name: "uMaxUnitPricing",
    esKey: 'shapeJson.properties.uMaxUnitPricing',
    options: {
      dbName: "shapeJson.properties.uMaxUnitPricing",
      sort: true,
      filter: true,
    },
  },
  // {
  //   name: "campaignName",
  //   label: "Campaign Name",
  //   esKey: "shapeJson.properties.campaignName.keyword",
  //   options: {
  //     customRender: (value) => {
  //       return <CampaignNameField value={value} fullWidth disabled />;
  //     },
  //     setCellProps: () => ({ style: { minWidth: "200px" } }),
  //     sort: true,
  //     filter: true,
  //     isMultiFilter: true,
  //   },
  // },
  {
    name: "campaignName",
    label: "Campaign Name",
    esKey: "shapeJson.properties.campaignName.keyword",
    options: {
      customRender: (value) => {
        return (typeof (value !== "string")  ) && value? value?.join(", ") : value;
      },
      setCellProps: () => ({ style: { minWidth: "200px" } }),
      sort: true,
      filter: true,
    },
  },
  {
    name: "department",
    label: "Department",
    esKey: "shapeJson.properties.department.keyword",
    options: {
      dbName: "shapeJson.properties.department",
      sort: true,
      filter: true,
    },
  },
  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: {
      ignoreGlobal: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      ignoreGlobal: true,
      dbName: "comments.comment",
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  // {
  //   name: "name-elasticsearch",
  //   esKey: "name.keyword",
  //   options: { filter: false, display: false, sort: false, viewColumns: false, forSearch: true },
  // },
  {
    name: "shapeLabel-elasticsearch",
    esKey: "shapeLabel.keyword",
    options: { filter: false, display: false, sort: false, viewColumns: false, forSearch: true },
  },
  {
    name: "state-elasticsearch",
    esKey: "state.keyword",
    options: { filter: false, display: false, sort: false, viewColumns: false, forSearch: true },
  },
  // {
  //   name: "approvalStatus",
  //   label: " ",
  //   esKey: "shapeJson.properties.approvalStatus.keyword",
  //   options: {
  //     dbName: "shapeJson.properties.approvalStatus",
  //     sort: true,
  //     filter: true,
  //     customRender: (value, tableMeta, updateValue) => {
  //       return (
  //         <div style={{ display: "flex", alignItems: "center" }}>
  //           {value?.toLowerCase() === "approved" ? (
  //             <CheckCircleIcon style={{ color: "forestgreen" }} />
  //           ) : (
  //             <WarningIcon style={{ color: "orange" }} />
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  // },
];

export default TractsHeadCells;
