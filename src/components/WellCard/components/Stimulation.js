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
    minHeight: "100px !important",
  },
  tableContainer: {
    overflowX: "unset",
    margin: "8px",
    //paddingRight: '20px'
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





function formatFT(ft) {
  let ftNum = ft ? ft : 0;
  ftNum = Math.round(ftNum);
  return ftNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const headers = [
    "SERVICE COMPANY",
    "START DATE",
    "END DATE",
    "TVD",
    "TOTAL BASE H2O(GAL)",
    "TOTAL BASE NONE-H2O(GAL)",
    "TOTAL BASE H2O MASS(LBS)",
    "TOTAL PROPPANT MASS(LBS)",
    "TOTAL FRAC FLUID VOLUME",
    "TOTAL FRAC FLUID MASS(LBS)",
    "FLUID TYPE",
    "PRIMARY PROPPANT",
    "CROSSLINK FLUID",
    "SURFACTANT PRESENT?",
    "CLAY CONTROL AGENT PRESENT?",
    "ACID TYPE",
    "ACID VOLUME",
    "BREAKER PRESENT"
];

export default function Simulation(props) {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (props.summary) {
      setSummary(props.summary);
    }
  }, [props.summary, setSummary]);

  return (
    <TableContainer className={classes.tableContainer}>
      {true && (
        <Table
          aria-label="simple table"
          className={classes.table}
          loading={!summary}
        >
          <TableBody>
            <TableRow className={classes.tableRow}>
                {headers.map((head) => {
                    return (
                        <TableCell scope="row" className={classes.rowName}>
                            {head}
                        </TableCell>
                    );
                })
            }     
            </TableRow>
            {[1,2].map((head) => {
                    return (
                        <TableRow>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                          <TableCell>
                              a
                          </TableCell>
                        </TableRow>
                    );
                })
            }     
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
