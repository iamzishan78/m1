import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import CSVDownloader from "react-csv-downloader";

import vf_number from "components/Shared/valueformatters/vf_number";
import { convertAnalyticsDataToCSV } from "components/Shared/M1nTable/components/MUIDataTable/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: "20px 0px",
  },
  table: {
    textTransform: "uppercase !important",
    minWidth: 150,
    "& .MuiTableCell-root": {
      paddingBottom: "5px",
      textAlign: "center",
      fontWeight: "bold",
    },
    "& .MuiTableCell-head": {
      borderBottom: "none",
    },
  },
  secondaryTable: {
    width: "auto",
    "& .MuiTableCell-root": {
      paddingBottom: "5px",
      textAlign: "center",
      fontWeight: "bold",
      minWidth: "200px",
    },
  },
  headerCell: {
    width: '200px',
    backgroundColor: "#f1f4fb !important",
    paddingBottom: "18px !important",
  },
  highlightedRows: {
    "& .MuiTableCell-root": {
      paddingTop: "25px !important",
      borderBottom: "none",
      background: "linear-gradient(#e0e0e0, #e0e0e0) bottom/100% 3px no-repeat",
    },
  },
  highlightedLessBordered: {
    "& .MuiTableCell-root": {
      paddingTop: "25px !important",
      borderBottom: "none",
      background: "linear-gradient(#e0e0e0, #e0e0e0) bottom/100% 2px no-repeat",
    },
  },
  leftCells: {
    paddingLeft: "3px",
    textAlign: "left !important",
  },
  topColoredBorderCell: {
    borderTop: "2px solid #34b4e3 !important",
  },
  leftRightColoredBorderCell: {
    borderLeft: "2px solid #34b4e3 !important",
    borderRight: "2px solid #34b4e3 !important",
  },
  bottomColoredBorderCell: {
    borderBottom: "2px solid #34b4e3 !important",
  },
  totalColCell: {
    fontWeight: "bolder",
    fontSize: "16px",
    fontFamily: "sans-serif",
  },
}));

export default function AcccessibleTable({ monthsInterval, items }) {
  const classes = useStyles();

  const formatRow = (item, value) => {
    if (item.name === 'Adjustments') return `${vf_number(value.toFixed(2))}`
    if (item.name === 'Net Revenue') return <span style={{ fontSize: '16px', fontWeight: '700' }}>{vf_number(value.toFixed(2))}</span>
    return vf_number(value.toFixed(2))
  }

  return (
    <div className={classes.root}>
      <TableContainer>
        <Grid container display="flex" direction="row" justify="flex-start" alignItems="center" style={{ padding: "2px" }}>
          <Grid item md={5}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ paddingLeft: 0 }} >
                    <CSVDownloader datas={convertAnalyticsDataToCSV(items, monthsInterval)} filename={`Revenue`} type="link">
                      <IconButton style={{ display: 'flex', padding: '0 0 0 15px'}}>
                        <Tooltip title="Download CSV" aria-label="add">
                          <CloudDownloadIcon />
                        </Tooltip>
                      </IconButton>
                    </CSVDownloader>
                  </TableCell>
                  <TableCell
                    align="center"
                    component="th"
                    className={`${classes.headerCell} ${classes.topColoredBorderCell} ${classes.leftRightColoredBorderCell}`}
                    style={{ color: "#12abe0" }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow className={`${(index + 1) % 2 !== 0 ? classes.highlightedRows : ""}`} key={index}>
                    <TableCell scope="row" className={classes.leftCells}>

                      {item.name}
                    </TableCell>
                    <TableCell scope="row" className={`${classes.leftRightColoredBorderCell} ${index === items.length - 1 ? classes.bottomColoredBorderCell : ""}`}>
                      {formatRow(item, item.total)}
                    </TableCell>
                  </TableRow>
                ))}
                {/* <TableRow className={classes.highlightedLessBordered}>
                  <TableCell scope="row" className={`${classes.leftCells} ${classes.totalColCell}`}>
                    Total Income
                  </TableCell>
                  <TableCell
                    scope="row"
                    className={`${classes.leftRightColoredBorderCell} ${classes.bottomColoredBorderCell} ${classes.totalColCell}`}
                    style={{ width: "160px" }}
                  >
                    {total}
                  </TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </Grid>
          <Grid item md={7} style={{ overflowX: "overlay" }}>
            <Table className={`${classes.secondaryTable} ${classes.table}`} aria-label="caption table" style={{ width: "auto" }}>
              <TableHead>
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell align="center" component="th" className={classes.headerCell}>
                      {month}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow className={`${(index + 1) % 2 !== 0 ? classes.highlightedRows : ""}`} key={index}>
                    {item.data && Object.values(item.data).map((value) => <TableCell scope="row">{formatRow(item, value)}</TableCell>)}
                  </TableRow>
                ))}
                {/* <TableRow className={classes.highlightedRows}>
                  {monthsInterval.map((month) => {
                    let total = 0;
                    items.filter((item) => ["Net Revenue", "Lease Payments", "Other"].includes(item.name)).forEach((item) => {
                      item.data && (total += item.data[month]);
                    });
                    return (
                      <TableCell className={classes.totalColCell} scope="row">
                        {vf_number(total)}
                      </TableCell>
                    );
                  })}
                </TableRow> */}

                <TableRow></TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </TableContainer>
    </div>
  );
}
