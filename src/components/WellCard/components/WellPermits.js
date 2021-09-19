import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import { AppContext } from "../../../AppContext";
import { Typography } from "@material-ui/core";
import { useQueryWellPermits } from "../../../graphQL/useQueryWellCompletionsAndStimulation";
import moment from 'moment';

const useStyles = makeStyles({
  table: {
    minHeight: "100px !important",
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: 20,
    background: "white",

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
  },
  rowName: {
    fontWeight: "bold",
    background: "#ebebeb",
    minWidth: 150
  },

  tableRow: {
    "& > td": {
      padding: "4px 15px !important",
      border: "2px solid #e3e3e3",
    },
  },
  tableSize:{
    height:',calc(100vh - 50vh) !important'
  },
  tableSize2:{
    height:'calc(100vh - 50vh + 482px) !important'
  }
});

const headers = [
    "PERMIT NUMBER",
    "STATE WELL ID",
    "SUBMITTED ON",
    "APPROVED ON",
    "EXPIRES ON",
    "AMENDED ON",
    "PERMIT STATUS",
    "PERMIT PURPOSE",
    "FILED BY"
];

export default function WellPermits(props) {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);
  const [stateApp] = useContext(AppContext);
  const { data } = useQueryWellPermits(stateApp.selectedWell.id);

  const [wellPermitData, setWellPermitData] = useState(null);

  useEffect(() => {
    if (typeof data !== "undefined" && typeof data.wellPermits !== "undefined" ) {
      setWellPermitData(data.wellPermits);
    }
  }, [data]);

  const formatValue = (data) => {
    if (data != null) {
      data = data.toLocaleString();
    }
    return data
  }

  return (
    <TableContainer className={classes.tableContainer}>
      {wellPermitData !== null ? (
        <div className={props.showSummary? classes.tableSize:classes.tableSize2}>
          <Table
            aria-label="simple table"
            className={classes.table}
          >
            
            <TableBody>
              <TableRow className={classes.tableRow}>
                  {headers.map((head) => {
                      return (
                          <TableCell key={head} scope="row" className={classes.rowName}>
                              {head}
                          </TableCell>
                      );
                  })
              }     
              </TableRow>
              { wellPermitData !== null && wellPermitData.length > 0 && (
                wellPermitData.map((row, index) =>  (
                      <TableRow key={index}>
                        <TableCell>
                          {row.PermitId}
                        </TableCell>
                        <TableCell>
                          {row.StateWellId}
                        </TableCell>
                        <TableCell>
                          {moment(row.SubmittedDate).isValid() ?  moment(row.SubmittedDate).format("MM/DD/YYYY") : ""}
                        </TableCell>
                        <TableCell>
                          {moment(row.ApprovedDate).isValid()  ?  moment(row.ApprovedDate).format("MM/DD/YYYY")  : ""}
                        </TableCell>
                        <TableCell>
                          {moment(row.ExpiredDate).isValid()   ? moment(row.ExpiredDate).format("MM/DD/YYYY")  : ""}
                        </TableCell>
                        <TableCell>
                          {moment(row.AmendedDate).isValid()  ? moment(row.AmendedDate).format("MM/DD/YYYY") : ""}
                        </TableCell>
                        <TableCell>
                          {row.PermitStatus.toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {row.PermitPurpose.toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {row.FiledBy.toUpperCase()}
                        </TableCell>
                      </TableRow>
                  ))
                  )
                }    
            </TableBody>
          </Table>
          <Typography color="textSecondary" align="center"> 
          {wellPermitData !== null && wellPermitData.length === 0 ?
            "No permit records available" : ""
          }
          </Typography>
        </div>

      ) : <Typography align="center">Loading...</Typography>
    }
    </TableContainer>
  );
}
