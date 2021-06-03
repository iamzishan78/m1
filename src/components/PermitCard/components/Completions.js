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
import { useQueryWellCompletions } from "../../../graphQL/useQueryWellCompletionsAndStimulation";
import moment from 'moment';

const useStyles = makeStyles({
  table: {
    minHeight: "100px !important",
  },
  tableContainer: {
    overflowX: "auto",
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
    marginBottom: 20,
    background: "white",
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
    "COMPLETION DATE",
    "LEASE ID",
    "LEASE NAME",
    "LEASE ACREAGE",
    "FORMATION",
    "TYPE",
    "UPPER PERF MD",
    "UPPER PERF TVD",
    "LOWER PERF MD",
    "LOWER PERF TVD",
    "PLUG BACK MD",
    "PLUG BACK TVD"
];

export default function Completions(props) {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);
  const [stateApp] = useContext(AppContext);
  const { data } = useQueryWellCompletions(stateApp.selectedWell.id);

  const [completionsData, setCompletionsData] = useState(null);

  useEffect(() => {
    if (typeof data !== "undefined" && typeof data.wellCompletions !== "undefined" ) {
      setCompletionsData(data.wellCompletions);
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
      {completionsData !== null ? (
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
              { completionsData !== null && completionsData.length > 0 && (
                completionsData.map((row, index) =>  (
                      <TableRow key={index}>
                        <TableCell>
                          {moment(row.CompletionDate).format("MM-DD-YYYY")}
                        </TableCell>
                        <TableCell>
                          {row.LeaseId}
                        </TableCell>
                        <TableCell>
                          {row.LeaseName}
                        </TableCell>
                        <TableCell>
                          {formatValue(row.LeaseAcreage)}
                        </TableCell>
                        <TableCell>
                          {row.Formation}
                        </TableCell>
                        <TableCell>
                          {row.CompletionType}
                        </TableCell>
                        <TableCell>
                          {formatValue(row.UpperPerf)}
                        </TableCell>
                        <TableCell>
                          {formatValue(row.UpperPerfTVD)}
                        </TableCell>
                        <TableCell>
                          {formatValue(row.LowerPerf)}
                        </TableCell>
                        <TableCell>
                          {formatValue(row.LowerPerfTVD)}
                        </TableCell>
                        <TableCell>
                          {formatValue(row.PlugBackMD)}
                        </TableCell>
                        <TableCell>
                          {formatValue(row.PlugBackTVD)}
                        </TableCell>
                      </TableRow>
                  ))
                  )
                }    
            </TableBody>
          </Table>
          <Typography color="textSecondary" align="center"> 
          {completionsData !== null && completionsData.length === 0 ?
            "No completion records available" : ""
          }
          </Typography>
        </div>

      ) : <Typography align="center">Loading...</Typography>
    }
    </TableContainer>
  );
}
