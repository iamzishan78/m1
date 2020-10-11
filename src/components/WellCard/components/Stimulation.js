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
const useStyles = makeStyles({
  table: {
    minHeight: "100px !important",
  },
  tableContainer: {
    overflowX: "auto",
    margin: "8px",
    marginBottom: 20,
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
                          {row.ServiceCompany}
                        </TableCell>
                        <TableCell>
                          {row.StartDate}
                        </TableCell>
                        <TableCell>
                          {row.EndDate}
                        </TableCell>
                        <TableCell>
                          {row.TopTVD}
                        </TableCell>
                        <TableCell>
                          {row.TotalBaseWaterVolumeGallons}
                        </TableCell>
                        <TableCell>
                          {row.TotalBaseNoneWaterVolumeGallons}
                        </TableCell>
                        <TableCell>
                          {row.TotalBaseWaterMass}
                        </TableCell>
                        <TableCell>
                          {row.TotalFracFluidVolume}
                        </TableCell>
                        <TableCell>
                          {row.TotalFracFluidMass}
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
                          {row.SurfactantPresent}
                        </TableCell>
                        <TableCell>
                          {row.ClayControlPresent}
                        </TableCell>
                        <TableCell>
                          {row.AcidTreatmentPresent}
                        </TableCell>
                        <TableCell>
                          {row.AcidType}
                        </TableCell>
                        <TableCell>
                          {row.AcidVolume}
                        </TableCell>
                        <TableCell>
                          {row.BreakerPresent}
                        </TableCell>
                      </TableRow>
                  );
              })
              : <TableRow>
                  <Typography align="center" color="textSecondary"> No records </Typography>
                </TableRow>
          }     
        </TableBody>
      </Table>
    ) : <Typography align="center">Loading...</Typography>
  }
  </TableContainer>
  );
}
