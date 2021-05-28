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
import { useQueryWellFormation } from "../../../graphQL/useQueryWellCompletionsAndStimulation";

const useStyles = makeStyles({
  table: {
    minHeight: "100px !important",
  },
  tableContainer: {
    overflowX: "auto",
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
    height:'calc(100vh - 50vh) !important'
  },
  tableSize2:{
    height:'calc(100vh - 50vh + 482px) !important'
  }
});

const headers = [
    {name: "FORMATION NAME", width:"20%"},
    {name: "TOP DEPTH (FT)", width:"20%"},
    {name: "COMMENTS", width:"60%"},
];

export default function Formation(props) {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { data } = useQueryWellFormation(stateApp.selectedWell.id);

  const [formationData, setFormationData] = useState(null);

  useEffect(() => {
    if (typeof data !== "undefined" && typeof data.wellFormation !== "undefined" ) {
      const group1 = [];
      const group2 = [];
      data.wellFormation.forEach(o => {
        o.TopDepth !== null ? group1.push(o) : group2.push(o);
      });
      setFormationData([...group1, ...group2]);
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
      {formationData !== null ? (
      <div className={props.showSummary? classes.tableSize:classes.tableSize2}>
        <Table
          aria-label="simple table"
          className={classes.table}
        >
          <TableBody>
            <TableRow className={classes.tableRow}>
                {headers.map((head) => {
                    return (
                        <TableCell key={head} scope="row" className={classes.rowName} style={{ width:head.width }}>
                            {head.name}
                        </TableCell>
                    );
                })
            }     
            </TableRow>
            { formationData !== null && formationData.length > 0 &&
            formationData.map((row, index) => (
                    <TableRow key={index + 1}>
                      <TableCell>
                        {row.ReportedFormationName}
                      </TableCell>
                      <TableCell>
                      {formatValue(row.TopDepth)}
                      </TableCell>
                      <TableCell>
                        {row.Comments}
                      </TableCell>
                    </TableRow>
                ))
            }     
          </TableBody>
        </Table>
        <Typography color="textSecondary" align="center"> 
        {formationData !== null && formationData.length === 0 ?
          "No Formation records available" : ""
        }
        </Typography>
      </div>
      ) : <Typography align="center">Loading...</Typography>
    }
    </TableContainer>
  );
}