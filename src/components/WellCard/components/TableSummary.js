import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { AppContext } from "../../../AppContext";

const useStyles = makeStyles({
  table: {
    //minWidth: 650,
    paddingRight: '20px'
  },
  tableContainer: {
    //minWidth: 650,
    //paddingRight: '20px'
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Well Type', 'Gas'),
  createData('Well Status', 'Active'),
  createData('Owners', '18'),
  createData('Profile', 'Vertical'),
  createData('Permit Date', '10/18/2005'),
];


export default function CardDetailsSummary() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  console.log(stateApp);
  console.log(stateApp.selectedWell);
  const selectedWell = stateApp.selectedWell

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell scope="row">
              Lease
            </TableCell>
            <TableCell>{selectedWell.leaseId}</TableCell>
            <TableCell scope="row">
              Field
            </TableCell>
            <TableCell>{selectedWell.leaseId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              County
            </TableCell>
            <TableCell>{selectedWell.county}</TableCell>
            <TableCell scope="row">
              MD(ft)
            </TableCell>
            <TableCell>{selectedWell.measuredDepth}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              State
            </TableCell>
            <TableCell>{selectedWell.state}</TableCell>
            <TableCell scope="row">
              TVD(ft)
            </TableCell>
            <TableCell>{selectedWell.leaseId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              Survey
            </TableCell>
            <TableCell>{selectedWell.survey}</TableCell>
            <TableCell scope="row">
              Lateral(ft)
            </TableCell>
            <TableCell>{selectedWell.leaseId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              Block
            </TableCell>
            <TableCell>{selectedWell.leaseId}</TableCell>
            <TableCell scope="row">
              Field
            </TableCell>
            <TableCell>{selectedWell.leaseId}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}