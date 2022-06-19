import { IconButton } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import MapFilledIcon from "components/Shared/svgIcons/MapFilled"
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
      setCellProps: () => ({
        style: {
          minWidth: "150px",
          whiteSpace: "nowrap",
          position: "sticky",
          left: "77px",
          background: "white",
          zIndex: 200
        }
      }),
      setCellHeaderProps: () => ({
        style: {
          position: "sticky",
          minWidth: "150px",
          left: "77px",
          zIndex: 201
        }
      }),
      dbName: "shapeJson.properties.agreementNumber",
      stickyColumn: true,
      sort: false,
      filter: true,
      viewColumns: false,
      display: true,
      customRender: (value, tableMeta, updateValue) => {
        return (
          <p
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/land/agreement/details/${tableMeta.rowData[0]}`,
                { showAgreementBreadcrumb: true }
              );
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
      setCellProps: () => ({
        style: {
          minWidth: "300px",
          whiteSpace: "nowrap",
          position: "sticky",
          left: "227px",
          background: "white",
          zIndex: 100
        }
      }),
      setCellHeaderProps: () => ({
        style: {
          position: "sticky",
          minWidth: "150px",
          left: "227px",
          zIndex: 101
        }
      }),
      dbName: "shapeJson.properties.agreementName",
      stickyColumn: true,
      sort: false,
      filter: true,
      viewColumns: false,
      display: true,
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
      setCellProps: () => ({ style: { minWidth: "170px" } }),
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
      setCellProps: () => ({ style: { minWidth: "170px" } }),
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
      setCellProps: () => ({ style: { minWidth: "225px" } }),
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
      setCellProps: () => ({ style: { minWidth: "225px" } }),
      // customHeadLabelRender: () => (
      //   <>
      //     <div>Grantee</div>
      //     <div>(Party 2)</div>
      //   </>
      // ),
      dbName: "shapeJson.properties.grantee",
      sort: true,
      filter: true,
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
      sort: true,
      filter: true,
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
      sort: true,
      filter: true,
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
      setCellProps: () => ({ style: { minWidth: "175px" } }),
      dbName: "shapeJson.properties.extensionDate",
      sort: true,
      filter: true,
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
      setCellProps: () => ({ style: { minWidth: "200px" } }),
      dbName: "shapeJson.properties.agreementStatus",
      sort: true,
      filter: true,
    },
  },
  {
    name: "reportGrossAcres",
    label: "Report GRS",
    esKey: "shapeJson.properties.reportGrossAcres.keyword",
    options: {
      setCellProps: () => ({ style: { minWidth: "175px" } }),
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
      setCellProps: () => ({ style: { maxWidth: "50px" } }),
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
    esKey: "tags.tag.keyword",
    options: { display: true, sort: true, filter: true },
  },

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
  {
    name: "mapFlyTo",
    label: " ",
    options: {
      sort: true,
      filter: true,
      display: true,
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
  {
    name: "approvalStatus",
    label: " ",
    esKey: "shapeJson.properties.approvalStatus.keyword",
    options: {
      dbName: "shapeJson.properties.approvalStatus",
      sort: true,
      filter: true,
      display: true,
      viewColumns: false,
      customRender: (value, tableMeta, updateValue) => {
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
    custom: {
      filterLabel: 'Approval Status'
    }
  },
];

export default AgreementsHeadCells;
