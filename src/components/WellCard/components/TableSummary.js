import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { AppContext } from "../../../AppContext";

const useStyles = makeStyles({
  table: {
    //minWidth: 650,
    paddingRight: "20px",
    minHeight: "100%",
  },
  tableContainer: {
    //minWidth: 650,
    //paddingRight: '20px'
    // minHeight: "419.556px",
  },
  rowName: {
    fontWeight: "bold",
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Well Type", "Gas"),
  createData("Well Status", "Active"),
  createData("Owners", "18"),
  createData("Profile", "Vertical"),
  createData("Permit Date", "10/18/2005"),
];

function formatFT(ft) {
  let ftNum = ft ? ft : 0;
  ftNum = Math.round(ftNum);
  return ftNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function TableSummary(props) {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (props.summary) {
      setSummary(props.summary);
    }
  }, [props.summary, setSummary]);

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      {summary && (
        <Table
          className={classes.table}
          aria-label="simple table"
          loading={!summary}
        >
          <TableBody>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                Lease
              </TableCell>
              <TableCell>
                {summary.Lease
                  ? `${summary.LeaseId} - ${summary.Lease}`
                  : summary.LeaseId}
              </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Field
              </TableCell>
              <TableCell>{summary.Field}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                County
              </TableCell>
              <TableCell>{summary.County}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                MD(ft)
              </TableCell>
              <TableCell>{formatFT(summary.MeasuredDepth)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                State
              </TableCell>
              <TableCell>{summary.State}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                TVD(ft)
              </TableCell>
              <TableCell>{formatFT(summary.TrueVerticalDepth)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Survey" : "Meridian"}
              </TableCell>
              <TableCell>{summary.Grid1}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Lateral Length(ft)
              </TableCell>
              <TableCell>{formatFT(summary.LateralLength)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Block" : "Township"}
              </TableCell>
              <TableCell>{summary.Grid2}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Latitude
              </TableCell>
              <TableCell>{summary.Latitude}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Section" : "Range"}
              </TableCell>
              <TableCell>{summary.Grid3}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Longitude
              </TableCell>
              <TableCell>{summary.Longitude}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Abstract" : "Section"}
              </TableCell>
              <TableCell>{summary.Grid4}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                BH Latitude
              </TableCell>
              <TableCell>{summary.BHLatitude}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Alt Survey" : ""}
              </TableCell>
              <TableCell>{summary.Grid5 || ""}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                BH Longitude
              </TableCell>
              <TableCell>{summary.BHLongitude}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
