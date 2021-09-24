import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

import { getParcelOriginalProperties } from "../utils/GetParcelOriginalProps";

const useStyles = makeStyles({
  table: {
    minHeight: "454px !important",
  },
  tableContainer: {
    overflowX: "unset",
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
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
  },
    margin: "8px",
  },
  rowName: {
    fontWeight: "bold",
    background: "#ebebeb",
  },
  tableRow: {
    "& > td": {
      padding: "4px 10px !important",
      border: "2px solid #e3e3e3",
    },
  },
});

export default function LeftTopSummary(props) {
  const [parcelData, setParcelData] = useState({"state": "TX"});
  const classes = useStyles({ parcelData });
  const [originalProperties, setProperties] = useState({});

  useEffect(() => {
    if (props.parcelData) {
      setParcelData(props.parcelData);
      const properties = getParcelOriginalProperties(props.parcelData.shape.properties);
      setProperties(properties);
    }
  }, [props.parcelData, setParcelData]);

  return (
    <TableContainer className={classes.tableContainer}>
      {parcelData && (
        <Table
          aria-label="simple table"
          className={classes.table}
        >
          <TableBody>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                County
              </TableCell>
              <TableCell>{originalProperties.county}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                State
              </TableCell>
              <TableCell>{originalProperties.state}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Survey" : "Meridian"}
              </TableCell>
              <TableCell>{originalProperties.survey}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Block" : "Township"}
              </TableCell>
              <TableCell>{originalProperties.block}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Section" : "Range"}
              </TableCell>
              <TableCell>{originalProperties.section}</TableCell>
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell scope="row" className={classes.rowName}>
                {parcelData.state === "TX" ? "Abstract" : "Section"}
              </TableCell>
              <TableCell>{originalProperties.abstract}</TableCell>
            </TableRow>
            {parcelData.state === "TX" && (
              <TableRow className={classes.tableRow}>
                <TableCell scope="row" className={classes.rowName}>
                  {parcelData.state === "TX" ? "Alt Survey" : ""}
                </TableCell>
                <TableCell>{originalProperties.altSurvey}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
