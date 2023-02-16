import { GlobalStickyStyles } from "GlobalSettings";
import moment from "moment";

import vf_number from "components/Shared/valueformatters/vf_number";
import { statusData } from "components/Table/Revenue/RevenuePropertiesTable";
import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";

const dateCustomRender = (value) =>
  value ? (moment(new Date(value)).format("MM/DD/YYYY") === "Invalid date" ? "" : moment(new Date(value)).format("MM/DD/YYYY")) : "";

const wellsColumnHeaders = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "WellName",
    label: "Well Name",
    esKey: "wellData.wellName.keyword",
    options: {
      ...GlobalStickyStyles({
        setCellProps: {
          left: '138px',
        },
        setCellHeaderProps: {
          left: '138px',
        }
      }),
      sort: true,
      filter: true,
      customRender: (value, tableMeta) => {
        const globalWellId = tableMeta.rowData[0];

        return <ColumnWithLink value={value} link={`/land/well/details/${globalWellId}`} />;
      },
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
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
    },
  },
  {
    name: "propertiesNames",
    label: "Property Name",
    esKey: "properties.name.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
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
    name: "Field",
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
    name: "PermitDate",
    label: "Permit Date",
    esKey: "wellData.PermitDate",
    options: {
      customRender: dateCustomRender,
      sort: true,
      filter: true,
      custom: {
        key_as_string: true,
        isDate: true,
      },
    },
  },
  {
    name: "SpudDate",
    label: "Spud Date",
    esKey: "wellData.SpudDate",
    options: {
      customRender: dateCustomRender,
      sort: true,
      filter: true,
      custom: {
        key_as_string: true,
        isDate: true,
      },
    },
  },
  {
    name: "CompletionDate",

    label: "Completion Date",
    esKey: "wellData.CompletionDate",
    options: {
      customRender: dateCustomRender,
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
    esKey: "wellData.FirstProdDate",
    options: {
      customRender: dateCustomRender,
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
    esKey: "wellData.measuredDepth",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value ? vf_number(Math.floor(value)) : "--"}</p>,
    },
  },
  {
    name: "trueVerticalDepth",
    label: "TVD",
    esKey: "wellData.trueVerticalDepth.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value ? vf_number(Math.floor(value)) : "--"}</p>,
    },
  },
  {
    name: "lateralLength",
    label: "Lateral Length",
    esKey: "wellData.lateralLength.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value ? vf_number(Math.floor(value)) : "--"}</p>,
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
      customRender: (values) => (
        <p>{values?.length ? values.map((value) => statusData.find((sd) => sd.value === value)?.label).join(", ") : "--"}</p>
      ),
    },
  },
  {
    name: "divOrderStatus",
    label: "DO Status",
    esKey: "properties.divOrderStatus.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
    },
  },
  {
    name: "interestType",
    label: "Interest Type",
    esKey: "properties.interestType.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
    },
  },
  {
    name: "interestAmount",
    label: "Interest Amount",
    esKey: "properties.interestAmount.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
    },
  },
  {
    name: "effectiveDate",
    label: "Effective Date",
    esKey: "properties.effectiveDate",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
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
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
    },
  },
  {
    name: "acquisitionID",
    label: "Acquisition",
    esKey: "properties.acquisitionID.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
    },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "properties.prospectID.keyword",
    options: {
      sort: true,
      filter: true,
      customRender: (value) => <p>{value?.length ? value.join(", ") : "--"}</p>,
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
