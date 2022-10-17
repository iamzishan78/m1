import globalSettings from "GlobalSettings";
import vf_number from "components/Shared/valueformatters/vf_number";

const wellsColumnHeaders = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "wellData.wellName.keyword",
    options: {
      ...globalSettings.muiGridInfScrollOptions,
      ignoreGlobal: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "api",
    label: "API",
    esKey: "wellData.api.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "internalID",
    label: "Internal ID",
    esKey: "properties.internalID.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : null}</p>,
    },
  },
  {
    name: "propertiesNames",
    label: "Property Name",
    esKey: "properties.name.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : null}</p>,
    },
  },
  {
    name: "operator",
    label: "Operator",
    esKey: "wellData.operator.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "wellType",
    label: "Well Type",
    esKey: "wellData.wellType.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "wellBoreProfile",
    label: "Well Profile",
    esKey: "wellData.wellBoreProfile.keyword",
    options: {
      display: true,
      filter: true,
    },
  },
  {
    name: "wellStatus",
    label: "Well Status",
    esKey: "wellData.wellStatus.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "basin",
    label: "Basin",
    esKey: "wellData.basin.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "field",
    label: "Field",
    esKey: "wellData.field.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "state",
    label: "State",
    esKey: "wellData.state.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "county",
    label: "County",
    esKey: "wellData.county.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "GrId1",
    label: "Survey",
    esKey: "wellData.GrId1.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "GrId2",
    label: "Block/Twsp",
    esKey: "wellData.GrId2.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "GrId3",
    label: "Sec/Range",
    esKey: "wellData.GrId3.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "GrId4",
    label: "Abstract/Sec",
    esKey: "wellData.GrId4.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "permitApprovedDate",
    label: "Permit Date",
    esKey: "wellData.permitApprovedDate.keyword",
    options: {
      sort: true,
      filter: true,
      custom: {
        key_as_string: true,
        isDate: true,
      },
    },
  },
  {
    name: "spudDate",
    label: "Spud Date",
    esKey: "wellData.spudDate.keyword",
    options: {
      sort: true,
      filter: true,
      custom: {
        key_as_string: true,
        isDate: true,
      },
    },
  },
  {
    name: "completionDate",
    label: "Completion Date",
    esKey: "wellData.completionDate.keyword",
    options: {
      sort: true,
      filter: true,
      custom: {
        key_as_string: true,
        isDate: true,
      },
    },
  },
  // firstProdDate
  {
    name: "firstProdDate",
    label: "First Prod Date",
    esKey: "wellData.FirstProdDate.keyword",
    options: {
      sort: true,
      filter: true,
      custom: {
        key_as_string: true,
        isDate: true,
      },
    },
  },
  {
    name: "measuredDepth",
    label: "Measured Depth",
    esKey: "wellData.measuredDepth.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value ? vf_number(Math.floor(value)) : null}</p>,
    },
  },
  {
    name: "trueVerticalDepth",
    label: "TVD",
    esKey: "wellData.trueVerticalDepth.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value ? vf_number(Math.floor(value)) : null}</p>,
    },
  },
  {
    name: "lateralLength",
    label: "Lateral Length",
    esKey: "wellData.lateralLength.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value ? vf_number(Math.floor(value)) : null}</p>,
    },
  },
  {
    name: "primaryFormation",
    label: "Formation",
    esKey: "wellData.primaryFormation.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "status",
    label: "Pay Status",
    esKey: "properties.status.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : null}</p>,
    },
  },
  {
    name: "divOrderStatus",
    label: "DO Status",
    esKey: "properties.divOrderStatus.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : null}</p>,
    },
  },
  {
    name: "costFree",
    label: "Cost Free",
    esKey: "properties.costFree.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "internalCompany",
    label: "Internal Company",
    esKey: "properties.internalCompany.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : null}</p>,
    },
  },
  {
    name: "acquisitionID",
    label: "Acquisition",
    esKey: "properties.acquisitionID.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : null}</p>,
    },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "properties.prospectID.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : null}</p>,
    },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
];

export default wellsColumnHeaders;
