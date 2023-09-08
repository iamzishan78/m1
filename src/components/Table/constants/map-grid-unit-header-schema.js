import CampaignNameField from "components/ContactDetailCard/components/FieldContent/CampaignNameField";
import { GlobalStickyStyles } from "GlobalSettings";

const unitsColumnHeaders = (isSnapGrid = false) => [
  {
    name: "id",
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
    name: "name",
    label: "Unit Name",
    esKey: "name.keyword",
    options: {
      ...GlobalStickyStyles({ setCellProps: { maxWidth: "500px" }, isSnapGrid }),
    },
  },
  {
    name: "uNumber",
    label: "Unit #",
    esKey: "shapeJson.properties.uNumber.keyword",
    options: {
      sort: true,
      filter: true,
      // setCellProps: () => ({ style: { minWidth: "125px" } }),
    },
  },
  {
    name: "State",
    label: "State",
    esKey: "shapeJson.properties.originalProperties.State.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "County",
    label: "County",
    esKey: "shapeJson.properties.originalProperties.County.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "SurveyMeridian", label: "Survey/ Meridian", esKey: [
      'shapeJson.properties.originalProperties.Survey.keyword',
      'shapeJson.properties.originalProperties.PrincipalMeridian.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
      sort: true,
      filter: true
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "BlockTownship", label: "Block/ Township", esKey: [
      'shapeJson.properties.originalProperties.Block.keyword',
      'shapeJson.properties.originalProperties.Township.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Block?.Township?",
      sort: true,
      filter: true
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "SectionRange", label: "Section/ Range", esKey: [
      'shapeJson.properties.originalProperties.Section.keyword',
      'shapeJson.properties.originalProperties.Range.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Section?.Range?",
      sort: true,
      filter: true
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "AbstractSection", label: "Abstract/ Section", esKey: [
      'shapeJson.properties.originalProperties.AbstractName.keyword',
      'shapeJson.properties.originalProperties.ShortName.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
      sort: true,
      filter: true
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "uAcres",
    label: "Unit Acres",
    esKey: "shapeJson.properties.uAcres.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "uStatus",
    label: "Unit Status",
    esKey: "shapeJson.properties.uStatus.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "uPrimaryOperator",
    label: "Current Operator",
    esKey: "shapeJson.properties.uPrimaryOperator.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "uUnitPricing",
    label: "Price/Acre",
    esKey: "shapeJson.properties.uUnitPricing.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "ownersCount",
    label: "Owner Count",
    esKey: "interestSummary.unitInterestCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "campaignName",
    label: "Campaign Name",
    esKey: "shapeJson.properties.campaignName.keyword",
    options: {
      customRender: (value) => {
        return <CampaignNameField value={value} fullWidth disabled />;
      },
      setCellProps: () => ({ style: { minWidth: "200px" } }),
      sort: true,
      filter: true,
    },
  },

  {
    name: "qualifier",
    label: "Qualifier",
    esKey: "shapeJson.properties.qualifier.name.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "125px" } }),
    },
  },
  {
    name: "reviewer",
    label: "Reviewer",
    esKey: "shapeJson.properties.reviewer.name.keyword",
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { minWidth: "125px" } }),
    },
  },
  //hiding temporarily until we get the chart fixed -kc 20220327
  // {
  //   name: "unitStatus",
  //   label: "Unit Status",
  //   options: {
  //     sort: true,
  //     filter: false,
  //   },
  // },
  {
    name: "lastUpdated",
    label: "Last Updated",
    esKey: "_ts",
    options: {
      sort: true,
      filter: true,
    },
    custom: {
      key_as_string: true,
      isDateTime: true,
    },
  },
  {
    name: "tags",
    label: "Tags ",
    esKey: 'tags.tag.keyword',
    options: {
      dbName: "tags.tag",
      sort: true,
      download: false,
      ignoreGlobal: true,
      print: false,
      filter: true,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      ignoreGlobal: true,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "coordinates",
    label: " ",
    options: {
      filter: false,
      ignoreGlobal: true,
      sort: false,
      searchable: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
];

export default unitsColumnHeaders
