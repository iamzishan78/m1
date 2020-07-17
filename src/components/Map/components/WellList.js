import React, {useContext, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { AppContext } from '../../../AppContext';
import { NavigationContext } from '../../Navigation/NavigationContext';
import { MapControlsContext } from '../../MapControls/MapControlsContext';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 300,
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  wellList: {
    width:'250px',
    height:'75vh',
    position:'relative',
    top:'5vh',
    left:'82px',
    zIndex:4,
    background:'rgba(255,255,255,0)',
    color: 'rgba(23, 170, 221, 1)',
    overflowY:'auto',
    padding: 0,
  },
  wellListItem:{
    fontFamily: 'Poppins',
    '&:hover': {
      background: '#4B618F'
    },
    backgroundColor: 'rgba(38, 52, 81, 1.0)',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white
    },
    '& .MuiListItemText-secondary': {
      color: 'rgba(23, 170, 221, 1)'
    },
  },
  subHeader: {
    color:'white',
    backgroundColor: '#011133 !important',
  }
}));



export default function WellList() {
  const [stateApp, setStateApp] = useContext(AppContext)
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [stateApp, setStateApp] = useContext(MapContext)
    const [stateCont, setStateCont] = useContext(MapControlsContext)
    const [wells, setWells] = useState([])

  const classes = useStyles();

  useEffect( () => {

    if(stateApp.trackedwells){
      setWells(stateApp.trackedwells)
    }
  },[stateApp.trackedwells])

  const handleWellClick = (well) => {
    //console.log('flyto',well)
    
    setStateApp(state => ({...state, popupOpen:false}))
    setStateApp(state => ({ ...state, selectedWell:well }))
    setStateApp(state => ({ ...state, selectedWellId:well.id }))
    setStateApp(state => ({...state,flyTo:well}))
    
}


  return (
    <div className={classes.root}>
     <List dense className={classes.wellList}  aria-label="secondary wells">
        <ListItem className={classes.subHeader} 
              key="subheader" 
              button>
          <ListItemText 
          primary={`Tracked Wells (${wells.length})`} 
          secondary = ''
          />
        </ListItem> 
          {wells.map( (well) => (
          <ListItem onClick={ () => (handleWellClick(well))} className={classes.wellListItem} key={well.wellName} button>
            <ListItemText 
            primary={well.wellName}
            secondary={well.operator} 
            />
          </ListItem>
          
        ) )} 
        
      </List>
    </div>
  );
}