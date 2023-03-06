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
      sort: true,
      filter: true,
      display: true,
      ...GlobalStickyStyles({
        setCellProps: {
          left: "77px",
          maxWidth: "492px",
        },
        setCellHeaderProps: {
          left: "77px",
          paddingLeft: "0px !important",
        },
      }),
    },
  },
  {
    name: "agreementName",
    label: "Agreement Name",
    esKey: "shape.shapeJson.properties.agreementName.keyword",
    options: {
      filter: false,
      display: false,
    },
  },
  {
    name: "agreementId",
    label: "Agreement Id",
    esKey: "shape._id",
    options: {
      filter: false,
      display: false,
    },
  },
  {
    name: "grantor",
    label: "Lessor/Grantor",
    esKey: "shape.shapeJson.properties.grantor.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "grantee",
    label: "Lessee/Grantee",
    esKey: "shape.shapeJson.properties.grantee.keyword",
    options: { sort: true, filter: true, display: true },
  },
  {
    name: "agreementDate",
    label: "Agmt Date",
    esKey: "shape.shapeJson.properties.agreementDate.keyword",
    options: { sort: true, filter: true, display: true, setCellProps: () => ({ style: { maxWidth: "150px" } }) },
    custom: {
      isDate: true,
    },
  },
  {
    name: "effectiveDate",
    label: "Efftv Date",
    esKey: "shape.shapeJson.properties.effectiveDate.keyword",
    options: { sort: true, filter: true, display: true, setCellProps: () => ({ style: { maxWidth: "150px" } }) },
    custom: {
      isDate: true,
    },
  },

  {
    name: "tractName",
    label: "Tract Name",
    esKey: "parcel.name.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "tractState",
    label: "State",
    esKey: [
      "parcel.shapeJson.properties.originalProperties.State.keyword",
      "parcel.shapeJson.properties.originalProperties.StateAbbreviation.keyword",
    ],
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { maxWidth: "150px" } }),
    },
    custom: {
      oRFilter: true,
    },
  },

  {
    name: "tractCounty",
    label: "County",
    esKey: "parcel.shapeJson.properties.originalProperties.County.keyword",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "blockTownship",
    label: "Block/Twsp",
    esKey: [
      "parcel.shapeJson.properties.originalProperties.Block.keyword",
      "parcel.shapeJson.properties.originalProperties.Township.keyword",
    ],
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { maxWidth: "150px" } }),
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "sectionRange",
    label: "Sec/Range",
    esKey: [
      "parcel.shapeJson.properties.originalProperties.Section.keyword",
      "parcel.shapeJson.properties.originalProperties.Range.keyword",
    ],
    options: {
      sort: true,
      filter: true,
      setCellProps: () => ({ style: { maxWidth: "150px" } }),
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "abstractSection",
    label: "Abstract/Sec",
    esKey: [
      "parcel.shapeJson.properties.originalProperties.AbstractName.keyword",
      "parcel.shapeJson.properties.originalProperties.ShortName.keyword",
    ],
    options: { sort: true, filter: true, setCellProps: () => ({ style: { maxWidth: "150px" } }) },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "legalDesctiption",
    label: "Legal Description",
    esKey: "shape.shapeJson.properties.legalDesctiption.keyword",
    options: { sort: true, filter: true, setCellProps: () => ({ style: { minWidth: "400px" } }) },
  },
  // {
  //   name: "recDate",
  //   label: "Rec Date",
  //   esKey: "recDate.keyword",
  //   options: { sort: true, filter: true },
  //   custom: {
  //     isDate: true,
  //   },
  // },
  // {
  //   name: "book",
  //   label: "Book",
  //   esKey: "book.keyword",
  //   options: { sort: true, filter: true },
  // },
  // {
  //   name: "page",
  //   label: "Page",
  //   esKey: "page.keyword",
  //   options: { sort: true, filter: true },
  // },
  // {
  //   name: "instrumentNumber",
  //   label: "Instrument #",
  //   esKey: "instrumentNumber.keyword",
  //   options: { sort: true, filter: true },
  // },
  {
    name: "internalCompany",
    label: "Internal Company",
    esKey: "shape.shapeJson.properties.internalCompany.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "shape.shapeJson.properties.prospectID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "acquisitionID",
    label: "Acquisition",
    esKey: "shape.shapeJson.properties.acquisitionID.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "recordedDate",
    label: "Rec Date",
    esKey: "shape.shapeJson.properties.recordedDate",
    options: { sort: true, filter: true },
  },
  {
    name: "recordedBook",
    label: "Book",
    esKey: "shape.shapeJson.properties.recordedBook",
    options: { sort: true, filter: true },
  },
  {
    name: "recordedPage",
    label: "Page",
    esKey: "shape.shapeJson.properties.recordedPage",
    options: { sort: true, filter: true },
  },
  {
    name: "recordedInstrumentNumber",
    label: "Instrument #",
    esKey: "shape.shapeJson.properties.recordedInstrumentNumber",
    options: { sort: true, filter: true },
  },
];

export default AcerageSummaryHeadCells;
