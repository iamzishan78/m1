import React, {useContext,useState} from "react";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, Grid, Typography, Drawer } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import MenuIcon from "@material-ui/icons/Menu";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useStyles, StyledMenu, StyledMenuItem } from "components/Land/style";
import moment from 'moment';
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import { ActivitiesContext } from "./ActivitiesContext";
import Calendar from 'react-calendar';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePicker: {
    overflow: "hidden",
    position: "absolute",
    width: "85%",
    marginLeft: "41px",
    opacity: "0",
    '& input::-webkit-calendar-picker-indicator': {
      cursor: "pointer",
      display: "block",
      top: 0,
      left: 0,
      background: "#0000",
      position: "absolute",
      transform: "scale(35)"
    },
    '& .MuiInput-root':{
      display:'flex',
      justifyContent:'center',
      backgroundColor:'black'
    },
    '& .MuiInputBase-input':{
      width: '50%'
    },
    '& .MuiPickersBasePicker':{
      pickerView:{
        backgroundColor:"black"
      }
    }
  },

  left: {
    display: "flex",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: 8,
  },
  centerNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'space-between',
    padding: '5px'
  },
}));


export default function QuickActionsPanel({ children, title, actions, handlePanelStateChange, quickActionsPanelState, activeModule }) {
  const classes = useStyles();
  const history = useHistory();
  const calenderClasses = useToolbarStyles();
  const [activityApp,setActivityApp] = useContext(ActivitiesContext);

  const [value, onChange] = useState(new Date());


  const goToBack = (date) => {
      let current = date
      if (date.getMonth() === 1){
        current = new Date(date.getFullYear() - 1, 0, 1);
      } else{
        current = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      }
    setActivityApp({...activityApp,selectedDate:current});
  };
  const goToNext = (date) => {
    let current = date;
    if (date.getMonth() === 11){
      current = new Date(date.getFullYear() + 1, 0, 1);
    } else{
      current = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }

    setActivityApp({...activityApp,selectedDate:current});
  };

  const handleChangeCalender = (e) =>{
    let date = e.activeStartDate;
    if(e.action === 'next'){
      goToNext(date);
    }else if(e.action === 'prev'){
      goToBack(date);
    }
  }
  const handleMenuItemClick = (path) => {
    history.push(path);
  };

  const handleDayChange = (e) => {
    setActivityApp({...activityApp,selectedDate:e});
  }

  return (
      <>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={quickActionsPanelState}
            classes={{
              paper: classes.drawerPaper,
            }}
        >
          <Grid container direction="row" justify="space-between" display="flex" className={classes.header}>
            <Grid item style={{ alignItems: "center" }}>
              <Typography variant="h5" style={{ fontWeight: "normal" }}>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton className={classes.iconArrow} color="secondary" onClick={() => handlePanelStateChange(false)}>
                <>
                  <ChevronLeftIcon />
                  <MenuIcon className={classes.menuIcon} />
                </>
              </IconButton>
            </Grid>
          </Grid>
          <Divider />
          <Typography variant="body2" className={classes.quickActionText}>
            Quick Actions
          </Typography>
          <StyledMenu>
            {Object.keys(actions)
                .filter((key) => !actions[key].isExcluded)
                .map(
                    (key, index) =>
                        actions[key].featureFlag && (
                            <FeatureFlag feature={FEATURES[actions[key].featureFlag]} noCheck={actions[key].noCheck}>
                              <StyledMenuItem
                                  onClick={() => handleMenuItemClick(actions[key].link)}
                                  key={index}
                                  isSelected
                                  style={{
                                    backgroundColor: activeModule.title === actions[key].title ? "#4B618F" : "",
                                  }}
                              >
                                <ListItemText id={`${actions[key].title} 101`}>{actions[key].title}</ListItemText>
                              </StyledMenuItem>
                            </FeatureFlag>
                        )
                )}
          </StyledMenu>
          <div className={calenderClasses.centerNav}>
            <Calendar
                onActiveStartDateChange={(e)=>handleChangeCalender(e)}
                next2Label={null}
                prev2Label={null}
                value={activityApp?.selectedDate}
                onChange={(e)=>handleDayChange(e)}
            />
          </div>
        </Drawer>
        <FeatureFlag feature={FEATURES[activeModule.featureFlag]} noCheck={activeModule.noCheck}>
          <div
              className={clsx({
                [classes.landRootExpanded]: quickActionsPanelState,
                [classes.landRootCollapsed]: !quickActionsPanelState,
              })}
          >
            {children}
          </div>
          <div className={classes.pulloutBox} onClick={() => handlePanelStateChange(!quickActionsPanelState)}>
            {quickActionsPanelState ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
          </div>
        </FeatureFlag>
      </>
  );
}
