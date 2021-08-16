import React, { useState, useEffect, useContext } from "react";
import { QuadContext } from "./QuadContext";
import { AppContext } from "../../AppContext";
import useQueryQuadChart from "../../graphQL/useQueryQuadChart";
//material-ui components
import {
  makeStyles,
  emphasize,
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Chip from "@material-ui/core/Chip";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Select, FormControl, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    //flexDirection:'column',
    overflow: "hidden",
  },
  gridList: {
    width: "auto",
    height: "auto",
    padding: "8px 0px 0px 18px",
    "&>:nth-child(1)": {
      marginRight: "13px",
      width: "46% !important",
      padding: " 0 0 16px 0px !important",
    },
    "&>:nth-child(2)": {
      padding: "0px 0px 16px 0px !important",
      width: "46% !important",
    },
    "&>:nth-child(3)": {
      marginRight: "13px",
      width: "46% !important",
      padding: " 0 0 16px 0px !important",
    },
    "&>:nth-child(4)": {
      padding: "0px 0px 16px 0px !important",
      width: "46% !important",
    },
  },
  gridContainer: {
    width: "auto",
    paddingBottom: 0,
    margin: "8px",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  tabContainer: {
    alignContent: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important",
  },
  card: {
    backgroundColor: "#f2fbfd",
    color: "black",
    fontFamily: "Poppins",
    border: "2px solid #e2f2f8 ",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center"
    // height : 100,
    // width: 100,
  },
  content: {
    margin: 10
  },

  bread: {
    display: "flex",
    justifyContent: "center",
  },

  formControl: {
    // margin: theme.spacing(1),
    minWidth: "100%",
    // padding: "0px 16px",
    marginBottom: 0,
  },

  divider: {
    backgroundColor: "#d4d4d4",
    padding: "2px 0",
    borderRadius: "2px",
    margin: "4px 0"
  }
}));

const toggleTheme = createMuiTheme({
  overrides: {
    MuiToggleButton: {
      root: {
        "&.Mui-selected": {
          backgroundColor: '#1fabda',
          color: "#fff",
          fontWeight: "bold",
          "&:hover , &:active": {
            backgroundColor: '#1aa9d9 !important',
          },
        },
        "&.Mui-disabled": {
          backgroundColor: '#dedede',
          color: 'inherit',
        },
      },
    },
  },
});

const DROPDOWN_ENUMS = {
  CUMULATIVE: 'Cumulative',
  LAST_MONTH: 'Last Month',
  LAST_6_MONTHS: 'Last 6 Months',
  LAST_12_MONTHS: 'Last 12 Months'
}

function formatDecimal(number) {
  let hasDecimal = false;
  const mod = number % 1 !== 0;
  if (number && mod !== 0) hasDecimal = true;
  const formatted = new Intl.NumberFormat("en-US").format(
    hasDecimal ? number.toFixed(1) : number);
  return formatted;
};

export default function QuadSummary(props) {
  const [stateApp] = useContext(AppContext);
  const [stateQuad, setStateQuad] = useContext(QuadContext);
  const classes = useStyles();
  const [dropDownValue, setDropDownValue] = useState({ value: DROPDOWN_ENUMS.CUMULATIVE });
  const [toggleAlignment, setToggleAlignment] = useState('cumulative');
  const [daily, setDaily] = useState(false);

  useEffect(() => {
    switch (dropDownValue.value) {
      case DROPDOWN_ENUMS.LAST_MONTH:
      case DROPDOWN_ENUMS.LAST_6_MONTHS:
      case DROPDOWN_ENUMS.LAST_12_MONTHS:
        setToggleAlignment('daily');
        setDaily(true);
        break;
      default:
        setToggleAlignment('cumulative');
        setDaily(false);
    }
  }, [dropDownValue]);

  //graphQL
  const { data, loading } = useQueryQuadChart(stateApp.selectedWell.id);

  useEffect(() => {
    if (!stateQuad.quadChart) {
      if (data) {
        let quadChart = data.quadChart;
        setStateQuad((state) => ({ ...state, quadChart: quadChart }));
      }
    }
  }, [stateQuad.quadChart, data]);
  //graphQL


  const handleChangeRange = (range) => {
    const newRange = parseInt(range.target.value);
    switch (newRange) {
      case 0:
        setDropDownValue({ value: DROPDOWN_ENUMS.CUMULATIVE });
        break;
      case 1:
        setDropDownValue({ value: DROPDOWN_ENUMS.LAST_MONTH });
        break;
      case 6:
        setDropDownValue({ value: DROPDOWN_ENUMS.LAST_6_MONTHS });
        break;
      case 12:
        setDropDownValue({ value: DROPDOWN_ENUMS.LAST_12_MONTHS });
        break;
      default:
        setDropDownValue({ value: DROPDOWN_ENUMS.CUMULATIVE });
        break;
    }
    setStateQuad((state) => ({ ...state, selectedRange: newRange }));
    if (!stateQuad.quadChart) {
      if (data) {
        let quadChart = data.quadChart;
        setStateQuad((state) => ({ ...state, quadChart: quadChart }));
      }
    }
  };

  const handleToggleChange = (value) => {
    value === "daily" ? setDaily(true) : setDaily(false);
    setToggleAlignment(value);
  }
  return data && stateQuad.quadChart ? (
    <div className={classes.gridContainer}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              defaultValue={dropDownValue.value}
              onChange={handleChangeRange}
            >
              <option value={0}>Cumulative</option>
              <option value={1}>Last Month</option>
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 12 Months</option>
            </Select>
          </FormControl>
        </Grid>
        {
          stateQuad.quadChart.map((tile) => {
            return (
              <Grid item xs={6}>
                <Card className={classes.card}>
                  <CardContent className={classes.content}>
                    <Typography align="center" variant="h5" style={{ fontWeight: "bold" }}       >
                      {tile.metric.toUpperCase()}
                    </Typography>
                    <Divider className={classes.divider} />
                    <Typography
                      align="center" variant="inherit" component="h5"
                      style={{ fontSize: 20 }}
                    >
                      {stateQuad.selectedRange === 12
                        ? formatDecimal(daily ? tile.value12 / (30 * 12) : tile.value12)
                        : stateQuad.selectedRange === 6
                          ? formatDecimal(daily ? tile.value6 / (30 * 6) : tile.value6)
                          : stateQuad.selectedRange === 1
                            ? formatDecimal(daily ? tile.value1 / (30) : tile.value1)
                            : stateQuad.selectedRange === 0
                              ? formatDecimal(tile.cumulative)
                              : "--"}
                    </Typography>
                    <Typography align="center" variant="h6">
                      {tile.units}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        }
        {dropDownValue.value !== DROPDOWN_ENUMS.CUMULATIVE && (
          <Grid item xs={12}>
            <MuiThemeProvider theme={toggleTheme} >
              <ToggleButtonGroup exclusive style={{ width: "100%" }} value={toggleAlignment} >
                <ToggleButton
                  selected={!daily}
                  disabled={stateQuad.selectedRange === 0}
                  onClick={() => handleToggleChange("cumulative")}
                  style={{ width: "100%" }}
                  size="medium"
                >
                  Cumulative
              </ToggleButton>
                <ToggleButton
                  selected={daily}
                  disabled={stateQuad.selectedRange === 0}
                  onClick={() => handleToggleChange("daily")}
                  style={{ width: "100%" }}
                  size="medium"
                >
                  Daily
              </ToggleButton>
              </ToggleButtonGroup>
            </MuiThemeProvider>
          </Grid>
        )}
      </Grid>
      {/* <FormControl variant="outlined" className={classes.formControl}>
        <Select
          native
          defaultValue={dropDownValue.value}
          onChange={handleChangeRange}
        >
          <option value={0}>Cumulative</option>
          <option value={1}>Last Month</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 12 Months</option>
        </Select>
      </FormControl>

      <GridList
        cellHeight="auto"
        cols={1}
        className={classes.gridList}
      >
        {stateQuad.quadChart.map((tile) => (
          <GridListTile
            className={classes.gridListTile}
            cols={1}
            rows={1}
            key={tile.metric}
          >
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <Typography align="center" variant="h5"  style={{fontWeight:"bold"}}       >
                  {tile.metric.toUpperCase()}
                </Typography>
                <Divider className={classes.divider} />
                <Typography 
                  align="center" variant="inherit" component="h5"
                  style={{fontSize:20}}
                  >
                  {stateQuad.selectedRange === 12
                    ? formatDecimal( daily ? tile.value12 / (30 * 12) : tile.value12)
                    : stateQuad.selectedRange === 6
                    ? formatDecimal(daily ? tile.value6 / (30 * 6) : tile.value6)
                    : stateQuad.selectedRange === 1
                    ? formatDecimal(daily ? tile.value1 / (30) : tile.value1)
                    : stateQuad.selectedRange === 0
                    ? formatDecimal(tile.cumulative)
                    : "--"}
                </Typography>
                <Typography align="center" variant="h6">
                  {tile.units}
                </Typography>
              </CardContent>
            </Card>
          </GridListTile>
        ))}
      <MuiThemeProvider theme={toggleTheme} >
        <ToggleButtonGroup exclusive style={{width: "97%"}} value={toggleAlignment} >
            <ToggleButton
              selected={!daily}
              disabled={stateQuad.selectedRange === 0} 
              onClick={() => handleToggleChange("cumulative")}
              style={{width: "100%"}}
              size="medium"
            >
              Cumulative
            </ToggleButton>
            <ToggleButton 
              selected={daily}
              disabled={stateQuad.selectedRange === 0} 
              onClick={() => handleToggleChange("daily")}
              style={{width: "100%"}}
              size="medium"
            >
              Daily
            </ToggleButton>
        </ToggleButtonGroup>
      </MuiThemeProvider>


      </GridList> */}
    </div>
  ) : // </div>
    loading ? (
      <Skeleton variant="rect" height={325} />
    ) : (
      <Skeleton variant="rect" height={325}>
        <Typography variant="button">Not Available</Typography>
      </Skeleton>
    );
}
