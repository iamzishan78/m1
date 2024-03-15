import { GlobalStickyStyles } from "GlobalSettings";
import { formatDate } from 'components/Shared/functions';

//value formatters
import vf_currency, { vf_currency_to_fixed } from "components/Shared/valueformatters/vf_currency";

const AgreementsHeadCells = (isSnapGrid = false) => [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    // this column is considered the grid "control"

    name: "agreementNumber",
    label: "Agreement",
    esKey: "shapeJson.properties.agreementNumber.keyword",
    options: {
      ...GlobalStickyStyles({
        setCellProps: {
          maxWidth: "492px",
        },
        isSnapGrid
      }),
      dbName: "shapeJson.properties.agreementNumber",
      isSnapGrid,
    },
  },
  //temp hide until we decide how we want this to work
  // {
  //   name: "agreementId",
  //   label: 'Agreement Id',
  //   esKey: "_id",
  //   options: { filter: false, display: true, sort: false, viewColumns: false },
  // },
  {
    name: "agreementName",
    label: "Agreement Name",
    esKey: "shapeJson.properties.agreementName.keyword",
    options: {
      setCellProps: () => ({
        style: {
          minWidth: "300px",
          maxWidth: "350px",
        },
      }),
      setCellHeaderProps: () => ({
        style: {
          paddingLeft: "0px",
        },
      }),
      dbName: "shapeJson.properties.agreementName",
      // ignoreGlobal: true,
      display: false,
      viewColumns: true,
    },
  },
  {
    name: "agreementType",
    label: "Type",
    esKey: "shapeJson.properties.agreementType.keyword",
    options: {
      dbName: "shapeJson.properties.agreementType",
    },
  },
  {
    name: "agreementSubtype",
    label: "Agreement Subtype",
    esKey: "shapeJson.properties.agreementSubtype.keyword",
    options: {
      dbName: "shapeJson.properties.agreementSubtype",
      display: true,
      viewColumns: true,
    },
  },
  {
    name: "State", label: "State", esKey: [
      'shapeJson.properties.originalProperties.State.keyword',
      'shapeJson.properties.originalProperties.StateAbbreviation.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.State?.StateAbbreviation?",
      sort: true,
      filter: true
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "County", label: "County", esKey: 'shapeJson.properties.originalProperties.County.keyword',
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.County",
    }
  },
  {
    name: "rightsType",
    label: "Rights",
    esKey: "shapeJson.properties.rightsType.keyword",
    options: {
      dbName: "shapeJson.properties.rightsType",
    },
  },
  {
    name: "grantor",
    label: "Grantor (Party 1)",
    esKey: "shapeJson.properties.grantor.keyword",
    options: {
      dbName: "shapeJson.properties.grantor",
    },
  },
  {
    name: "grantee",
    label: "Grantee (Party 2)",
    esKey: "shapeJson.properties.grantee.keyword",
    options: {
      dbName: "shapeJson.properties.grantee",
    },
  },
  {
    name: "agreementDate",
    label: "Agmt Date",
    esKey: "shapeJson.properties.agreementDate",
    options: {
      setCellProps: () => ({ style: { minWidth: "175px" } }),
      dbName: "shapeJson.properties.agreementDate",
      sort: true,
      filter: true,
    },
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },
  {
    name: "effectiveDate",
    label: "Efftv Date",
    esKey: "shapeJson.properties.effectiveDate.keyword",
    options: {
      dbName: "shapeJson.properties.effectiveDate.keyword",
    },
    custom: {
      isDate: true,
    },
  },
  {
    name: "agreementTerm",
    label: "Primary Term (Mo)",
    esKey: "shapeJson.properties.agreementTerm.keyword",
    options: {
      dbName: " shapeJson.properties.agreementTerm",
      sort: true,
      filter: true,
    },
  },
  {
    name: "expirationDate",
    label: "Exp Date",
    esKey: "shapeJson.properties.expirationDate.keyword",
    options: {
      dbName: "shapeJson.properties.expirationDate",
    },
    custom: {
      isDate: true,
    },
  },
  {
    name: "extensionTerm",
    label: "Extension Term (Mo)",
    esKey: "shapeJson.properties.extensionTerm.keyword",
    options: {
      dbName: " shapeJson.properties.extensionTerm",
      sort: true,
      filter: true,
    },
  },
  {
    name: "extensionDate",
    label: "Extension Exp Date",
    esKey: "shapeJson.properties.extensionDate.keyword",
    options: {
      dbName: "shapeJson.properties.extensionDate",
    },
    custom: {
      isDate: true,
    },
  },
  {
    name: "bounusPayment",
    label: "Bonus Payment",
    esKey: "shapeJson.properties.bounusPayment.keyword",
    options: {
      dbName: "shapeJson.properties.bounusPayment",
      filter: true, customRender: (value) => vf_currency(value),
    },
  },
  {
    name: "agmtRoyalty",
    label: "Agmt Royalty(%)",
    esKey: "shapeJson.properties.agmtRoyalty.keyword",
    options: {
      dbName: "shapeJson.properties.agmtRoyalty",
    },
  },
  {
    name: "agreementStatus",
    label: "Status",
    esKey: "shapeJson.properties.agreementStatus.keyword",
    options: {
      dbName: "shapeJson.properties.agreementStatus",
    },
  },
  {
    name: "reportGrossAcres",
    label: "Report Gross",
    esKey: "shapeJson.properties.reportGrossAcres.keyword",
    options: {
      dbName: "shapeJson.properties.reportGrossAcres",
    },
  },
  {
    name: "grossAcres",
    label: "Gross",
    esKey: "shapeJson.properties.grossAcres.keyword",
    options: {
      dbName: "shapeJson.properties.grossAcres",
    },
  },
  {
    name: "netAcres",
    label: "Net",
    esKey: "shapeJson.properties.netAcres.keyword",
    options: {
      dbName: "shapeJson.properties.netAcres",
    },
  },
  {
    name: "companyNetAcres",
    label: "Company Net",
    esKey: "shapeJson.properties.companyNetAcres.keyword",
    options: {
      dbName: "shapeJson.properties.companyNetAcres",
      sort: true,
      filter: true,
    },
  },
  {
    name: "netRoyalty",
    label: "NRA",
    esKey: "shapeJson.properties.netRoyalty.keyword",
    options: {
      dbName: "shapeJson.properties.netRoyalty",
      sort: true,
      filter: true,
    },
  },
  {
    name: "acquisitionID",
    label: "Acquisition ID",
    esKey: "shapeJson.properties.acquisitionID.keyword",
    options: {
      dbName: "shapeJson.properties.acquisitionID",
      sort: true,
      filter: true,
    },
  },
  {
    name: "acquisitionDate",
    label: "Acquisition Date",
    esKey: "shapeJson.properties.acquisitionDate",
    options: {
      setCellProps: () => ({ style: { minWidth: "175px" } }),
      dbName: "shapeJson.properties.acquisitionDate",
      sort: true,
      filter: true,
    },
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "shapeJson.properties.prospectID.keyword",
    options: {
      dbName: "shapeJson.properties.prospectID",
      sort: true,
      filter: true,
    },
  },
  // synced summary fields and grid fields
  {
    label: "Total Acquisition Cost",
    name: "totalAcquisitionCost",
    esKey: "shapeJson.properties.totalAcquisitionCost",
    options: {
      dbName: "shapeJson.properties.totalAcquisitionCost",
      sort: true,
      filter: true,
      // added a custom renderer for currency type field
      customRender: (value) => {
        return <p>{value ? `${vf_currency_to_fixed(value, 2)}` : ""}</p>;
      },
    },
  },
  {
    label: "Company ID",
    name: "internalCompany",
    esKey: "shapeJson.properties.internalCompany.keyword",
  },
  {
    label: "Description",
    name: "metaDescription",
    esKey: "shapeJson.properties.metaDescription.keyword",
    options: {
      sort: true,
      filter: true,
      display: true,
    },
  },
  {
    name: "recordedDate",
    label: "Recorded Date",
    esKey: "shapeJson.properties.recordedDate.keyword",
    options: {
      dbName: "shapeJson.properties.recordedDate",
      sort: true,
      filter: true,
      display: false,
    },
  },
  {
    name: "recordedBook",
    label: "Book",
    esKey: "shapeJson.properties.recordedBook.keyword",
    options: {
      dbName: "shapeJson.properties.recordedBook",
      sort: true,
      filter: true,
      display: false,
    },
  },
  {
    name: "recordedPage",
    label: "Page",
    esKey: "shapeJson.properties.recordedPage.keyword",
    options: {
      dbName: "shapeJson.properties.recordedPage",
      sort: true,
      filter: true,
      display: false,
    },
  },
  {
    name: "recordedInstrumentNumber",
    label: "Instrument #",
    esKey: "shapeJson.properties.recordedInstrumentNumber.keyword",
    options: {
      dbName: "shapeJson.properties.recordedInstrumentNumber",
      sort: true,
      filter: true,
      display: false,
    },
  },

  //hide for now until we determine if this is the best way to derive it kc 20220813
  // {
  //   name: "State",
  //   label: "State",
  //   esKey: "shapeJson.properties.originalProperties.State.keyword",
  //   options: {
  //     setCellProps: () => ({ style: { maxWidth: "50px" } }),
  //     dbName: "shapeJson.properties.originalProperties.State",
  //     sort: true,
  //     filter: true,
  //   },
  // },
  // {
  //   name: "County",
  //   label: "County",
  //   esKey: "shapeJson.properties.originalProperties.County.keyword",
  //   options: {
  //     dbName: "shapeJson.properties.originalProperties.County",
  //     sort: true,
  //     filter: true,
  //   },
  // },
  // {
  //   name: "legaldescription",
  //   label: "Legal Description ",
  //   esKey: "shapeJson.properties.legalDesctiption.keyword",
  //   options: {
  //     dbName: "shapeJson.properties.legalDesctiption",
  //     sort: true,
  //     filter: true,
  //   },
  // },
  {
    name: "layer",
    label: "Layer",
    options: {
      display: false,
      viewColumns: false,
    },
  },

  {
    name: "createBy",
    label: "Created By",
    esKey: "createBy",
    options: {
      display: true,
      customRender: (value) => {
        return <>{value?.name}</>
      }
    },
  },

  {
    name: "createAt",
    label: "Created Date",
    esKey: "createAt",
    options: {
      display: true,
      customRender: (value) => {
        return <>{formatDate(value)}</>
      }
    },
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },

  {
    name: "lastUpdateBy",
    label: "Last Updated By",
    esKey: "lastUpdateBy",
    options: {
      display: true,
      customRender: (value) => {
        return <>{value?.name}</>
      }
    },
  },

  {
    name: "lastUpdateAt",
    label: "Last Updated Date",
    esKey: "lastUpdateAt",
    options: {
      display: true,
      customRender: (value) => {
        return <>{formatDate(value)}</>
      }
    },
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },

  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: {
      ignoreGlobal: true,
      display: true,
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
      display: false,
      searchable: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "name-elasticsearch",
    esKey: 'name.keyword',
    options: { filter: false, display: false, sort: false, viewColumns: false, forSearch: true },
  },
  {
    name: "shapeLabel-elasticsearch",
    esKey: 'shapeJson.properties.shapeLabel.keyword',
    options: { filter: false, display: false, sort: false, viewColumns: false, forSearch: true },
  },
  {
    name: "state-elasticsearch",
    esKey: 'state.keyword',
    options: { filter: false, display: false, sort: false, viewColumns: false, forSearch: true },
  },
  // {
  //   name: "mapFlyTo",
  //   label: " ",
  //   options: {
  //     sort: true,
  //     // filter: true,
  //     ignoreGlobal: true,
  //     display: false,
  //     viewColumns: false,
  //     customRender: (value, tableMeta) => {
  //       return (
  //         <IconButton
  //           size="medium"
  //           color="primary"
  //           style={{ backgroundColor: "#efefef", width: '45px', height: '45px' }}
  //           onClick={(e) => {
  //             history.push(
  //               `/map/${tableMeta.rowData[3]?.toLowerCase()}s/${tableMeta.rowData[0]}`,
  //               { showAgreementBreadcrumb: true }
  //             );
  //             e.stopPropagation();
  //           }}
  //         >
  //           <MapFilledIcon />
  //         </IconButton>
  //       );
  //     },
  //   },
  // },
  // {
  //   name: "approvalStatus",
  //   label: " ",
  //   esKey: "shapeJson.properties.approvalStatus.keyword",
  //   options: {
  //     dbName: "shapeJson.properties.approvalStatus",
  //     sort: true,
  //     // filter: true,
  //     display: true,
  //     viewColumns: false,
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
  //   custom: {
  //     filterLabel: 'Approval Status'
  //   }
  // },
];

export default AgreementsHeadCells;
