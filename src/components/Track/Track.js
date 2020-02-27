import React, { useContext,useState } from 'react';
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import { AppContext } from '../../AppContext'
import { TrackContext } from './TrackContext'
import { MapContext } from '../Map/MapContext'
import { Container } from '@material-ui/core';
import WellsProvider from '../Wells/WellsProvider';
import OwnersProvider from '../Owners/OwnersProvider';
import WellIcon from "../Shared/svgIcons/well";
import OwnershipIcon from "../Shared/svgIcons/ownership";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Badge from "@material-ui/core/Badge";
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import MyLocationIcon from '@material-ui/icons/MyLocation'
const useStyles = makeStyles(theme => ({ 
  container: {
    paddingTop:"10px"
  },
  tab: {
    minWidth: "62px"
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  card: {
    width: '100%',
    background: '#011133',
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderColor: '#011133'
  },
  cardContent: {
    background: '#fff',
  },
  title: {
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    fontSize: '20px'
  },
  subheader: {
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    fontSize: '14px'
  },
}));

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
export default function Track() {
  const classes = useStyles()
  const [stateApp, setStateApp] = useContext(AppContext)
  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
    return (
      <Container maxWidth="xl" className={classes.container}>
        <Card className={classes.card}>
        <CardHeader
          classes={{
            title: classes.title,
            subheader: classes.subheader
          }}
          title="Track"
          subheader="Wells and Owners"
          avatar={
            <MyLocationIcon color="secondary" />
          }
          
        />
          <CardContent className={classes.cardContent}>
     
        <Tabs
              value={value}
              onChange={handleTabChange}
              variant="standard"
              textColor="primary"
              aria-label="tabs"
              classes={{ indicator: classes.indicator }}
            >

        <Tab
                value={1}
                classes={{ root: classes.tab }}
                icon={
                  <Badge
                    badgeContent={stateApp.owners ? stateApp.owners.length:0}
                    color="secondary"
                  >
                    <OwnershipIcon color="#000" opacity="1.0" />
                  </Badge>
                }
                aria-label="ownership"
              />

              <Tab
                value={0}
                className={classes.tab}
                icon={
                  <Badge
                    badgeContent={stateApp.wells ? stateApp.wells.length:0}
                    color="secondary"
                  >
                    <WellIcon color="#000" opacity="1.0" />
                  </Badge>
                }
                aria-label="well"
              />


             
            </Tabs>
            <TabPanel value={value} index={0}>
            <WellsProvider showList={false} parent="track"/>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <OwnersProvider  parent="track"/>
            </TabPanel>
        
            </CardContent>
           
          </Card>
      
      </Container>
    );
  }