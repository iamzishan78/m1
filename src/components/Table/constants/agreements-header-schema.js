import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { history } from "store";

const AgreementsHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "agreementNumber",
    label: "Agreement #",
    esKey: "shapeJson.properties.agreementNumber.keyword",
    options: {
      setCellProps: () => ({ style: { minWidth: "200px" } }),
      dbName: "shapeJson.properties.agreementNumber",
      sort: true,
      filter: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <p
            onClick={(e) => {
              e.stopPropagation();
                history.push(`/map/${tableMeta.rowData[3]}s/${tableMeta.rowData[0]}`, { showAgreementBreadcrumb: true });
            }}
            style={{ fontWeight: 600, color: "#17aadd", cursor: "pointer" }}
          >
            {value}
          </p>
        );
      },
    },
  },
  {
    name: "agreementName",
    label: "Agreement Name",
    esKey: "shapeJson.properties.agreementName.keyword",
    options: {
      setCellProps: () => ({ style: { minWidth: "250px" } }),
      dbName: "shapeJson.properties.agreementName",
      sort: true,
      filter: true,
    },
  },
  {
    name: "agreementType",
    label: "Type",
    esKey: "shapeJson.properties.agreementType.keyword",
    options: {
      dbName: "shapeJson.properties.agreementSubtype",
      sort: true,
      filter: true,
    },
  },
  {
    name: "agreementSubtype",
    label: "Subtype",
    esKey: "shapeJson.properties.agreementSubtype.keyword",
    options: {
      dbName: "shapeJson.properties.agreementSubtype",
      sort: true,
      filter: true,
    },
  },
  {
    name: "rightsType",
    label: "Rights",
    esKey: "shapeJson.properties.rightsType.keyword",
    options: {
      dbName: "shapeJson.properties.rightsType",
      sort: true,
      filter: true,
    },
  },
  {
    name: "grantor",
    label: "Grantor (Party 1)",
    esKey: "shapeJson.properties.grantor.keyword",
    options: {
      dbName: "shapeJson.properties.grantor",
      sort: true,
      filter: true,
    },
  },
  {
    name: "grantee",
    label: "Grantee (Party 2)",
    esKey: "shapeJson.properties.grantee.keyword",
    options: {
      dbName: "shapeJson.properties.grantee",
      sort: true,
      filter: true,
    },
  },
  {
    name: "agreementDate",
    label: "Agmt Date",
    esKey: "shapeJson.properties.agreementDate.keyword",
    options: {
      dbName: "shapeJson.properties.agreementDate",
      sort: true,
      filter: true,
    },
  },
  {
    name: "effectiveDate",
    label: "Efftv Date",
    esKey: "shapeJson.properties.effectiveDate.keyword",
    options: {
      dbName: "shapeJson.properties.effectiveDate",
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
      sort: true,
      filter: true,
    },
  },
  {
    name: "extensionDate",
    label: "Ext Date",
    esKey: "shapeJson.properties.extensionDate.keyword",
    options: {
      dbName: "shapeJson.properties.extensionDate",
      sort: true,
      filter: true,
    },
  },
  {
    name: "agreementStatus",
    label: "Status",
    esKey: "shapeJson.properties.agreementStatus.keyword",
    options: {
      dbName: "shapeJson.properties.agreementStatus",
      sort: true,
      filter: true,
    },
  },
  {
    name: "reportGrossAcres",
    label: "RPT GRS",
    esKey: "shapeJson.properties.reportGrossAcres.keyword",
    options: {
      dbName: "shapeJson.properties.reportGrossAcres",
      sort: true,
      filter: true,
    },
  },
  {
    name: "grossAcres",
    label: "GRS",
    esKey: "shapeJson.properties.grossAcres.keyword",
    options: {
      dbName: "shapeJson.properties.grossAcres",
      sort: true,
      filter: true,
    },
  },
  {
    name: "netAcres",
    label: "NET",
    esKey: "shapeJson.properties.netAcres.keyword",
    options: {
      dbName: "shapeJson.properties.netAcres",
      sort: true,
      filter: true,
    },
  },

  {
    name: "State",
    label: "State",
    esKey: "shapeJson.properties.originalProperties.State.keyword",
    options: {
      dbName: "shapeJson.properties.originalProperties.State",
      sort: true,
      filter: true,
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
    name: "tags",
    label: "Tags",
    esKey: "tags.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      dbName: "comments.comment",
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "approvalStatus",
    label: " ",
    esKey: "shapeJson.properties.approvalStatus.keyword",
    options: {
      dbName: "shapeJson.properties.approvalStatus",
      sort: true,
      filter: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {value?.toLowerCase() === "approved" ? (
              <CheckCircleIcon style={{ color: "forestgreen" }} />
            ) : (
              <WarningIcon style={{ color: "orange" }} />
            )}
          </div>
        );
      },
    },
  },
];

export default AgreementsHeadCells;
