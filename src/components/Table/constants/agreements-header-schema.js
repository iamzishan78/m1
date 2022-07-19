import { Grid, IconButton } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import MapFilledIcon from "components/Shared/svgIcons/MapFilled";
import { history } from "store";
import GlobalSettings from "..//..//..//GlobalSettings.js";
import GlobalStyles from "..//..//..//GlobalStyles.js";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";




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

      customRender: (value, tableMeta) => {
        const splitNumber = value?.split("_");

        const styles = {
          cursor: GlobalStyles.hyperlink.cursor,
          // position: 'relative',
          // left: '55px',
        };

        return (

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >


            {/* <div style={styles}>  */}
            {/* <Grid container 
          direction = 'column'
                      style={{
                        // display: 'flex',
                        // alignItems: 'center',
                      }}
                      >
          <Grid item> */}


            <Grid container spacing={0} direction="row"
              style={{
                position: 'absolute',
                left: '55px',
              }}

            // direction="column" alignItems="flex-start"
            >
              <Grid item
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >

                <Typography
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSnapGrid)
                      history.push(`/map/${tableMeta.rowData[18]}s/${tableMeta.rowData[0]}`,
                        { showAgreementBreadcrumb: false }
                      );
                    else
                      history.push(`/land/agreement/details/${tableMeta.rowData[0]}`,
                        { showAgreementBreadcrumb: true }
                      );
                  }}
                  noWrap
                  variant='body2'
                  style={styles}
                  color="inherit"
                >
                  <Box sx={{
                    color: GlobalStyles.colors.lightBlue,
                    p: 2,
                    "&:hover": {
                      textDecoration: "underline",
                      fontWeight: GlobalStyles.font.boldFontWeight,
                    },
                  }}>
                    {splitNumber?.[0]
                      ? `${splitNumber?.[0].trim()} - ${tableMeta?.rowData[2]}`
                      : tableMeta?.rowData[2]}
                  </Box>
                </Typography>
              </Grid>

              {/* <Grid item
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            >
            {value?.toLowerCase() === "approved" ? (
              <CheckCircleIcon style={{ color: "forestgreen" }} />
            ) : (
              <WarningIcon style={{ color: "orange" }} />
            )}
          </Grid>

          <Grid item
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            >
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
          </Grid>
           */}


            </Grid>

          </div>

        );
      },

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
