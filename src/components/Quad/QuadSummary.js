import React, { useState, useEffect, useContext } from "react";
import { QuadContext } from "./QuadContext";
import { AppContext } from "../../AppContext";
import useQueryQuadChart from "../../graphQL/useQueryQuadChart";
//material-ui components
import {
  makeStyles,
  useTheme,
  emphasize,
  withStyles,
} from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Chip from "@material-ui/core/Chip";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { Select, FormControl, Divider } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    //flexDirection:'column',
    overflow: "hidden",
    paddingBottom: "4px",
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
    height: "auto",
    paddingBottom: "4px",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
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
    justifyContent: "center",
    padding: "8px",
  },
  content: {
    "&> h5": {
      fontSize: "30px",
    },
    "&> h6": {
      fontSize: "24px",
    },
  },
  bread: {
    display: "flex",
    justifyContent: "center",
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    padding: "0px 16px",
  },
  divider: {
    backgroundColor: "#d4d4d4",
    padding: "2px 0",
    borderRadius: "2px",
    margin: "4px 0",
  },
  gridListTile: {},
}));

const toggleTheme = createMuiTheme({
  overrides: {
    MuiToggleButton: {
      selected: {
        backgroundColor: '#1fabda'
      }
    }
  }
});

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[300],
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip);

export default function QuadSummary(props) {
  const [stateApp] = useContext(AppContext);
  const [stateQuad, setStateQuad] = useContext(QuadContext);
  const classes = useStyles();
  const [dropDownValue, setDropDownValue] = useState({ value: "Cumulative" });
  const [toggleAlignment, setToggleAlignment] = useState('daily');
  const [value, setValue] = useState(0);

  const handleChangeRange = (range) => {
    console.log(range, "rangevalue");
    const newRange = parseInt(range.target.value);
    switch(newRange) {
      case 0:
        setDropDownValue({ value: "Cumulative" });
        break;
      case 1:
        setDropDownValue({ value: "Last Month" });
        break;
      case 6:
        setDropDownValue({ value: "Last 6 Months" });
        break;
      case 12:
        setDropDownValue({ value: "Last 12 Months" });
        break;
      default:
        setDropDownValue({ value: "Cumulative" });
        break;
    }
    setStateQuad((state) => ({ ...state, selectedRange: newRange }));
    console.log(stateQuad.quadChart, "stateQuad.quadChart");
    if (!stateQuad.quadChart) {
      if (data) {
        // console.log('quadData',data)
        let quadChart = data.quadChart;
        setStateQuad((state) => ({ ...state, quadChart: quadChart }));
      }
    }
  };

  const handleToggleChange = (event, value) => {
    console.log(value)
    setToggleAlignment(value);
  }

  //graphQL
  const { data, loading, error } = useQueryQuadChart(stateApp.selectedWell.id);

  useEffect(() => {
    if (!stateQuad.quadChart) {
      if (data) {
        // console.log('quadData',data)
        let quadChart = data.quadChart;
        setStateQuad((state) => ({ ...state, quadChart: quadChart }));
      }
    }
  }, [stateQuad.quadChart, data]);
  //graphQL

  return data && stateQuad.quadChart ? (
    // <div style={{ padding: "0px 5px 0px 5px" }}>
    <div className={classes.gridContainer}>
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
      <GridList
        cellHeight="auto"
        // cellHeight = "300"//invalid prop
        cols={2}
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
                <Typography align="center" variant="h5">
                  {tile.metric.toUpperCase()}
                </Typography>
                <Divider className={classes.divider} />
                <Typography align="center" variant="h6">
                  {stateQuad.selectedRange === 12
                    ? new Intl.NumberFormat("en-US").format(tile.value12)
                    : stateQuad.selectedRange === 6
                    ? new Intl.NumberFormat("en-US").format(tile.value6)
                    : stateQuad.selectedRange === 1
                    ? new Intl.NumberFormat("en-US").format(tile.value1)
                    : stateQuad.selectedRange === 0
                    ? new Intl.NumberFormat("en-US").format(tile.cumulative)
                    : "--"}
                </Typography>
                <Typography align="center" variant="h6">
                  {tile.units}
                </Typography>
              </CardContent>
            </Card>
          </GridListTile>
        ))}
        <MuiThemeProvider theme={toggleTheme}>
          <ToggleButtonGroup
            value={toggleAlignment}
            exclusive
            onChange={handleToggleChange}
            aria-label="text alignment"
            style={{width: '100%'}}
          >
            <ToggleButton value="cumulative" aria-label="left aligned" style={{width: '100%'}}>
              Cumulative
            </ToggleButton>
            <ToggleButton value="daily" aria-label="right aligned" style={{width: '100%'}}>
              Daily
            </ToggleButton>
          </ToggleButtonGroup>
        </MuiThemeProvider>
      </GridList>
    </div>
  ) : // </div>
  loading ? (
    <Skeleton variant="rect" height={325}/>
  ) : (
    <Skeleton variant="rect" height={325}>
      <Typography variant="button">Not Available</Typography>
    </Skeleton>
  );
}
