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
import { useQueryWellStimulation } from "../../../graphQL/useQueryWellCompletionsAndStimulation";
import moment from 'moment';

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
});

const headers = [
    "STIMULATION DATE" , 
    "START DATE",
    "END DATE",
    "SERVICE COMPANY",
    "STAGES",
    "TOTAL BASE H2O(GAL)",
    "TOTAL BASE NON H2O(GAL)",
    "TOTAL FRAC FLUID VOLUME",
    "TOTAL BASE H2O MASS(LBS)",
    "TOTAL PROPPANT MASS(LBS)",
    "TOTAL FRAC FLUID MASS",
    "FLUID TYPE",
    "PRIMARY PROPPANT",
    "CROSSLINK FLUID",
    "SURFACTANT",
    "CLAY CONTROL AGENT",
    "ACID TYPE",
    "ACID VOLUME",
    "COMMENTS"
];

export default function Simulation(props) {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { data, } = useQueryWellStimulation(stateApp.selectedWell.id);

  const [stimulationData, setStimulationData] = useState(null);

  useEffect(() => {

    if (typeof data !== "undefined" && typeof data.wellStimulation !== "undefined" ) {
      setStimulationData(data.wellStimulation);
    }
  }, [data]);

  return (
    <TableContainer className={classes.tableContainer}>
    {stimulationData !== null ? (
      <Table
        aria-label="simple table"
        className={classes.table}
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
          { stimulationData !== null && stimulationData.length > 0 ? 
          stimulationData.map((row) => {
                  return (
                      <TableRow>
                        <TableCell>
                          {moment(row.StimDate).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>
                          {moment(row.StartDate).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>
                          {moment(row.EndDate).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>
                          {row.ServiceCompany}
                        </TableCell>
                        <TableCell>
                          {row.NumberOfStages}
                        </TableCell>
                        <TableCell>
                          {row.TotalBaseWaterVolumeGallons.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.TotalBaseNonWaterVolumeGallons.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.TotalFracFluidVolume.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.TotalBaseWaterMass.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.TotalProppantMass.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.TotalFracFluidMass.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.FluidType}
                        </TableCell>
                        <TableCell>
                          {row.PrimaryProppantMaterial}
                        </TableCell>
                        <TableCell>
                          {row.CrosslinkFluid}
                        </TableCell>
                        <TableCell>
                          {row.Surfactant}
                        </TableCell>
                        <TableCell>
                          {row.ClayControlAgent}
                        </TableCell>
                        <TableCell>
                          {row.AcidType}
                        </TableCell>
                        <TableCell>
                          {row.AcidVolume.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.Comments}
                        </TableCell>
                      </TableRow>
                  );
              })
              : <TableRow>
                 
                  <Typography align="left" color="textSecondary"> No stimulation records available</Typography>
                </TableRow>
          }     
        </TableBody>
      </Table>
    ) : <Typography align="center">Loading...</Typography>
  }
  </TableContainer>
  );
}
