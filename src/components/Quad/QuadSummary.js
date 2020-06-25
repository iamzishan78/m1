import React, { useState, useEffect, useContext } from "react";
import { QuadContext } from "./QuadContext";
import { AppContext } from "../../AppContext";
import useQueryQuadChart from "../../graphQL/useQueryQuadChart";
//material-ui components
import {
  makeStyles,
  useTheme,
  emphasize,
  withStyles
} from "@material-ui/core/styles";
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

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    width: "auto",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    //flexDirection:'column',
    overflow: "hidden",
    paddingBottom: "4px"
  },
  gridList: {
    width: "auto",
    height: "auto"
  },
  gridContainer: {
    width: "auto",
    height: 'auto',
    paddingBottom: "4px",
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: "center",
    justifyContent: "center"
  },
  tabContainer: {
    alignContent: "center",
    justifyContent: "center",
    marginBottom: "8px"
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  card: {
    backgroundColor: "#FFFFFFF",
    color: "black",
    fontFamily: "Poppins",
    border: "1px solid",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center"
  },
  bread: {
    display: "flex",
    justifyContent: "center"
  },
  tab: {
    minWidth: "55px",
    display: "flex",
    flexGrow: "1",
    alignContent: "center",
    justifyContent: "center"
  }
}));
const StyledBreadcrumb = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[300]
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12)
    }
  }
}))(Chip);

export default function QuadSummary(props) {
  const [stateApp] = useContext(AppContext);
  const [stateQuad, setStateQuad] = useContext(QuadContext);
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChangeRange = range => {
    setStateQuad(state => ({ ...state, selectedRange: range }));
  };

  const handleFilterTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        color="secondary"
        component="div"
        role="tabpanel"
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };

  //graphQL
  const { data, loading, error } = useQueryQuadChart(stateApp.selectedWell.id);

  useEffect(() => {
    if (!stateQuad.quadChart) {
      if (data) {
        // console.log('quadData',data)
        let quadChart = data.quadChart;
        setStateQuad(state => ({ ...state, quadChart: quadChart }));
      }
    }
  }, [stateQuad.quadChart, data]);
  //graphQL

  return data && stateQuad.quadChart ? (
    <div>
      <div className={classes.gridContainer}>
        <AppBar className={classes.tabContainer} position="static">
          <Tabs
            value={value}
            onChange={handleFilterTabChange}
            //variant="scrollable"
            aria-label="tabs"
            // scrollButtons="on"
            classes={{ indicator: classes.indicator }}
          >
            <Tab
              value={0}
              className={classes.tab}
              label="CUM"
              onClick={() => {
                handleChangeRange(0);
              }}
            />
            <Tab
              value={1}
              className={classes.tab}
              label="1 Mo."
              onClick={() => {
                handleChangeRange(1);
              }}
            />
            <Tab
              value={2}
              className={classes.tab}
              label="6 Mo."
              onClick={() => {
                handleChangeRange(6);
              }}
            />
            <Tab
              value={3}
              className={classes.tab}
              label="12 Mo."
              onClick={() => {
                handleChangeRange(12);
              }}
            />
          </Tabs>
        </AppBar>

        <GridList 
          cellHeight="auto" 
          // cellHeight = "300"//invalid prop
          cols={2} 
          className={classes.gridList}>
          {stateQuad.quadChart.map(tile => (
            <GridListTile cols={1} rows={1} key={tile.metric}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography align="center" variant="h4">
                    {tile.metric.toUpperCase()}
                  </Typography>
                  <Typography align="center" variant="h5">
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
        </GridList>
      </div>
    </div>
  ) : loading ? (
    <CircularProgress size={80} disableShrink color="secondary" />
  ) : (
    <Skeleton variant="rect" height={325}>
      <Typography variant="button">Not Available</Typography>
    </Skeleton>
  );
}
