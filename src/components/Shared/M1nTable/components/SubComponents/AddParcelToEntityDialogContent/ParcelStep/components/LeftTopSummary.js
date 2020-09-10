import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import CountyName from "./CountyName";

const useStyles = makeStyles({
  table: {
    minHeight: "407px !important",
  },
  tableContainer: {
    overflowX: "unset",
  },
  rowName: {
    fontWeight: "bold",
    background: "#ebebeb",
  },

  tableRow: {
    "& > td": {
      border: "2px solid #e3e3e3",
    },
  },
  aut: {
    padding: "0",
    "& fieldset": {
      border: "none",
    },
    "& .MuiInputBase-root": {
      borderRadius: "0px",
    },
  },
});

export default function LeftTopSummary(props) {
  const [parcelData, setParcelData] = useState(null);
  const classes = useStyles({ parcelData });

  useEffect(() => {
    if (props.parcelData) {
      setParcelData(props.parcelData);
    }
  }, [props.parcelData, setParcelData]);

  return (
    <TableContainer className={classes.tableContainer}>
      {parcelData && (
        <Table aria-label="simple table" className={classes.table}>
          <TableBody>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                State
              </TableCell>
              <TableCell>{parcelData.state}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                County
              </TableCell>
              {/* <TableCell>{parcelData.county}</TableCell> */}
              <TableCell className={classes.aut}>
                <CountyName />
              </TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Survey" : "Meridian"}
              </TableCell>
              <TableCell>{parcelData.Grid1}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Block" : "Township"}
              </TableCell>
              <TableCell>{parcelData.Grid2}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Section" : "Range"}
              </TableCell>
              <TableCell>{parcelData.Grid3}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Abstract" : "Section"}
              </TableCell>
              <TableCell>{parcelData.Grid4}</TableCell>
            </TableRow>
            {parcelData.state === "TX" && (
              <TableRow className={classes.tableRow}>
                <TableCell scope="row" className={classes.rowName}>
                  {parcelData.state === "TX" ? "Alt Survey" : ""}
                </TableCell>
                <TableCell>{parcelData.Grid5 || ""}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
