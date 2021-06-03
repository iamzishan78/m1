import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";

import { AppContext } from "../../../AppContext";

const useStyles = makeStyles({
  table: {
    //minWidth: 650,
    // paddingRight: "20px",
    minHeight: "466.556px !important",
  },
  tableContainer: {
    overflowX: "unset",
    margin: "8px",

    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    // "&::-webkit-scrollbar-track": {
    //     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    // },
    //paddingRight: '20px'
  },
  rowCell: {
    width:"25%",
  },
  rowName: {
    fontWeight: "bold",
    background: "#ebebeb",
    width:"25%",
  },

  tableRow: {
    "& > td": {
      padding: "4px 10px !important",
      border: "2px solid #e3e3e3",
    },
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
      ;
    }
  }, [props.summary, setSummary]);

  return (
    <TableContainer className={classes.tableContainer}>
      {summary && (
        <Table
          aria-label="simple table"
          className={classes.table}
          loading={!summary}
        >

          {console.log('summary',summary)}
          
          <TableBody>

          <TableRow className={classes.tableRow}>
          <TableCell scope="row" className={classes.rowName}>
                Lease
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Lease ? summary.Lease : "--"}
              </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Lease Number
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.LeaseId ? summary.LeaseId : "--"}
                </TableCell>
            </TableRow>

            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                Current Operator
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.CurrentOperator ? summary.CurrentOperator : "--"}
              </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Original Operator
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.OriginalOperator ? summary.OriginalOperator : "--"}
              </TableCell>
            </TableRow>

            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                Basin
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Basin ? summary.Basin : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Formation
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.PrimaryFormation ? summary.PrimaryFormation : "--"}
                </TableCell>

            </TableRow>

            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                Play
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Play ? summary.Play : "--"}
              </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Field
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Field ? summary.Field : "--"}
                </TableCell>
            </TableRow>


            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                Permit Number
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.PermitNumber ? summary.PermitNumber : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                MD(ft)
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.MeasuredDepth ? formatFT(summary.MeasuredDepth) : "--"}
                </TableCell>
            </TableRow>


            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                Lateral Length(ft)
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.LateralLength ? formatFT(summary.LateralLength) : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                TVD(ft)
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.TrueVerticalDepth ? formatFT(summary.TrueVerticalDepth) : "--"}
                </TableCell>
            </TableRow>
            
            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                Latitude
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Latitude ? summary.Latitude : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                Longitude
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Longitude ? summary.Longitude : "--"}
                </TableCell>
            </TableRow>

            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                BH Latitude
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.BHLatitude ? summary.BHLatitude : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                BH Longitude
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.BHLongitude ? summary.BHLongitude : "--"}
                </TableCell>
            </TableRow>

          <TableRow className={classes.tableRow}>
          <TableCell scope="row" className={classes.rowName}>
                State
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.State ? summary.State : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                County
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.County ? summary.County : "--"}
                </TableCell>
            </TableRow>

            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Survey" : "Meridian"}
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Grid1 ? summary.Grid1 : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Block" : "Township"}
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Grid2 ? summary.Grid2 : "--"}
                </TableCell>
            </TableRow>

            <TableRow className={classes.tableRow}>
            <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Section" : "Range"}
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Grid3 ? summary.Grid3 : "--"}
                </TableCell>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Abstract" : "Section"}
              </TableCell>
              <TableCell className={classes.rowCell}>
                {summary.Grid4 ? summary.Grid4 : "--"}
                </TableCell>
            </TableRow>



            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "Alt Survey" : ""}
              </TableCell>
              <TableCell className={classes.rowCell}>{summary.Grid5 || ""}</TableCell>
              <TableCell scope="row" className={classes.rowName}>
                {summary.State === "TX" ? "" : ""}
              </TableCell>
              <TableCell className={classes.rowCell}>{"" || ""}</TableCell>
            </TableRow>
             
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
