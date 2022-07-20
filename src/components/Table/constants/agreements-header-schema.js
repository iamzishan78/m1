import { IconButton } from "@material-ui/core";
import MapFilledIcon from "components/Shared/svgIcons/MapFilled";
import { history } from "store";
import GlobalSettings from "..//..//..//GlobalSettings.js";

const AgreementsHeadCells = (isSnapGrid = false) => [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {

    // this column is considered the grid "control"

    name: "agreementNumber",
    label: "Agreement #",
    esKey: "shapeJson.properties.agreementNumber.keyword",
    options: {
      ...GlobalSettings.muiGridControlOptions,
      ignoreGlobal: true,
      dbName: "shapeJson.properties.agreementNumber",

    },
  },
  {
    name: "agreementName",
    label: "Agreement Name",
    esKey: "shapeJson.properties.agreementName.keyword",
    options: {
      dbName: "shapeJson.properties.agreementName",
    },
  },
  {
    name: "agreementType",
    label: "Type",
    esKey: "shapeJson.properties.agreementType.keyword",
    options: {
      dbName: "shapeJson.properties.agreementSubtype",
    },
  },
  {
    name: "agreementSubtype",
    label: "Subtype",
    esKey: "shapeJson.properties.agreementSubtype.keyword",
    options: {
      display: false,
      viewColumns: false,
      dbName: "shapeJson.properties.agreementSubtype",
    },
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
    name: "extensionDate",
    label: "Ext Date",
    esKey: "shapeJson.properties.extensionDate.keyword",
    options: {
      dbName: "shapeJson.properties.extensionDate",
    },
    custom: {
      isDate: true,
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
    label: "Report GRS",
    esKey: "shapeJson.properties.reportGrossAcres.keyword",
    options: {
      dbName: "shapeJson.properties.reportGrossAcres",
    },
  },
  {
    name: "grossAcres",
    label: "GRS",
    esKey: "shapeJson.properties.grossAcres.keyword",
    options: {
      dbName: "shapeJson.properties.grossAcres",
    },
  },
  {
    name: "netAcres",
    label: "NET",
    esKey: "shapeJson.properties.netAcres.keyword",
    options: {
      dbName: "shapeJson.properties.netAcres",
    },
  },

  {
    name: "State",
    label: "State",
    esKey: "shapeJson.properties.originalProperties.State.keyword",
    options: {
      dbName: "shapeJson.properties.originalProperties.State",
    },
  },
  {
    name: "County",
    label: "County",
    esKey: "shapeJson.properties.originalProperties.County.keyword",
    options: {
      dbName: "shapeJson.properties.originalProperties.County",
      sort: true,
      filter: true,
    },
  },
  {
    name: "layer",
    label: "Layer",
    options: {
      display: false,
      viewColumns: false,
    },
  },
  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: {
      ignoreGlobal: true,
      display: true, sort: true, filter: true
    },
  },

  {
    name: "commentsCounter",
    label: " ",
    options: {
      ignoreGlobal: true,
      dbName: "comments.comment",
      display: true,
      searchable: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "mapFlyTo",
    label: " ",
    options: {
      sort: true,
      // filter: true,
      ignoreGlobal: true,
      display: false,
      viewColumns: false,
      customRender: (value, tableMeta) => {
        return (
          <IconButton
            size="medium"
            color="primary"
            style={{ backgroundColor: "#efefef", width: '45px', height: '45px' }}
            onClick={(e) => {
              history.push(
                `/map/${tableMeta.rowData[3]?.toLowerCase()}s/${tableMeta.rowData[0]}`,
                { showAgreementBreadcrumb: true }
              );
              e.stopPropagation();
            }}
          >
            <MapFilledIcon />
          </IconButton>
        );
      },
    },
  },
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
