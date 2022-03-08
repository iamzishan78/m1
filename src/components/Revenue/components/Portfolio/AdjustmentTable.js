import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "20px 0px",
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
      lineHeight: "0.5rem",
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
    width: "160px",
  },
}));

export default function AdjustmentTable({ monthsInterval }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TableContainer>
        <Grid container display="flex" direction="row" justify="flex-start" alignItems="center" style={{ padding: "2px" }}>
          <Grid item md={5}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
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
                <TableRow>
                  <TableCell scope="row" className={classes.leftCells}>
                    Severance Tax
                  </TableCell>
                  <TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
                    10,000,000
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" className={classes.leftCells}>
                    Transportation - Oil
                  </TableCell>
                  <TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
                    10,000,000
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" className={classes.leftCells}>
                    Transportation - Gas
                  </TableCell>
                  <TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
                    10,000,000
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" className={classes.leftCells}>
                    Compression
                  </TableCell>
                  <TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
                    10,000,000
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell scope="row" className={classes.leftCells}>
                    Processing
                  </TableCell>
                  <TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
                    10,000,000
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" className={classes.leftCells}>
                    Lease Use
                  </TableCell>
                  <TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
                    10,000,000
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" className={classes.leftCells}>
                    Other
                  </TableCell>
                  <TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
                    10,000,000
                  </TableCell>
                </TableRow>
                <TableRow className={`${classes.highlightedRows}`}>
                  <TableCell scope="row" className={classes.leftCells}>
                    Total Adjustments
                  </TableCell>
                  <TableCell
                    scope="row"
                    className={`${classes.leftRightColoredBorderCell} ${classes.bottomColoredBorderCell} ${classes.totalColCell}`}
                  >
                    10,000,000
                  </TableCell>
                </TableRow>
                <TableRow></TableRow>
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
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
                <TableRow className={classes.highlightedRows}>
                  {monthsInterval.map((month) => (
                    <TableCell scope="row">10,000,000</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </TableContainer>
    </div>
  );
}
