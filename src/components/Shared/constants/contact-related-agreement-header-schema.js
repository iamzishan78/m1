import GlobalSettings from "GlobalSettings";
import { Link } from "react-router-dom";
import GlobalStyles from "GlobalStyles";

const ContactReleatedAgreementHeaderCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "agreementNumber",
    label: "Agreement",
    esKey: "shapeJson.properties.agreementNumber.keyword",
    options: {
      setCellProps: () => ({
        style: {
          ...GlobalSettings.muiGridInfScrollOptions.setCellProps().style,
          left: "77px",
        },
      }),
      setCellHeaderProps: () => ({
        style: {
          ...GlobalSettings.muiGridInfScrollOptions.setCellHeaderProps().style,
          left: "77px",
          padding: "0px 40px"
        },
      }),
      ignoreGlobal: true,
      dbName: "shapeJson.properties.agreementNumber",
      customRender: (value, tableMeta, updateValue) => {
        return (
          <Link to={`/land/agreement/details/${tableMeta.rowData[0]}`} style={{ color: GlobalStyles.colors.lightBlue }}>{value
            ? `${value} - ${tableMeta?.rowData[2]}`
            : tableMeta?.rowData[2]}</Link>
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
          maxWidth: "350px"
        }
      }),
      setCellHeaderProps: () => ({
        style: {
          paddingLeft: "0px"
        }
      }),
      dbName: "shapeJson.properties.agreementName",
      // ignoreGlobal: true,
      display: false,
      viewColumns: true,
    },
  },
  {
    name: "grantee",
    label: "Grantee",
    esKey: "shapeJson.properties.grantee.keyword",
    options: {
      dbName: "shapeJson.properties.grantee",
    },
  },
  {
    name: "grantor",
    label: "Grantor",
    esKey: "shapeJson.properties.grantor.keyword",
    options: {
      dbName: "shapeJson.properties.grantor",
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
];

export default ContactReleatedAgreementHeaderCells;
