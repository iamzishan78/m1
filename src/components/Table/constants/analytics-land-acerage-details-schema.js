import { GlobalStickyStyles } from "GlobalSettings";
const AcerageSummaryHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "agreementNumber",
    label: "Agreement #",
    esKey: "shape.shapeJson.properties.agreementNumber.keyword",
    options: {
      ...GlobalStickyStyles({
        setCellProps: {
          left: '76.5px',
          maxWidth: "392px",
        },
        setCellHeaderProps: {
          left: '76.5px',
        }
      }),
      dbName: "shapeJson.properties.agreementNumber",
      isSnapGrid: false,
    },
  },
  {
    name: "agreementName",
    label: "Agreement Name",
    esKey: "shape.shapeJson.properties.agreementName.keyword",
    options: {
      dbName: "shape.shapeJson.properties.agreementName",
      display: false,
      viewColumns: true,
    },
  },
  {
    name: "layerSubType",
    label: "Agreement Type",
    esKey: "shape.shapeJson.properties.layerSubType.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agreementSubtype",
    label: "Agreement Subtype",
    esKey: "shape.shapeJson.properties.agreementSubtype.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "rightsType",
    label: "Rights",
    esKey: "shape.shapeJson.properties.rightsType.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agreementState", label: "State", esKey: [
      'shape.shapeJson.properties.originalProperties.State.keyword',
      'shape.shapeJson.properties.originalProperties.StateAbbreviation.keyword'
    ],
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agreementCounty",
    label: "County",
    esKey: "shape.shapeJson.properties.originalProperties.County.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "tractName",
    label: "Tract Name",
    esKey: "parcel.name.keyword",
    options: { sort: true, filter: true },
  },

  {
    name: "tractStatus",
    label: "Tract Status",
    esKey: "parcel.shapeJson.properties.tractStatus.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "reportGrossAcres",
    label: "Report Gross",
    esKey: "parcel.shapeJson.properties.reportGrossAcres.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "sdGrossAcres",
    label: "Gross",
    esKey: "parcel.shapeJson.properties.sdGrossAcres.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "netAcres",
    label: "Net",
    esKey: "parcel.shapeJson.properties.netAcres.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "companyNetAcres",
    label: "Co. Net",
    esKey: "parcel.shapeJson.properties.companyNetAcres.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "netRoyalty",
    label: "NRA",
    esKey: "parcel.shapeJson.properties.netRoyalty.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "acquisitionID",
    label: "Acqusition",
    esKey: "shape.shapeJson.properties.acquisitionID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "shape.shapeJson.properties.prospectID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "internalCompany",
    label: "Internal Company",
    esKey: "shape.shapeJson.properties.internalCompany.keyword",
    options: { sort: true, filter: true },
  },
];

export default AcerageSummaryHeadCells;
