import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { AppContext } from '../../../AppContext';
import { NavigationContext } from '../../Navigation/NavigationContext';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 200,
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    width:'250px',
    height:'210px',
    overflowY:'auto',
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    // "&::-webkit-scrollbar-track": {
    //     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    // },
    position:'absolute',
    top:'250px',
    left:'82px',
    zIndex:4,
    background:'rgba(255,255,255,0)',
    color: 'rgba(23, 170, 221, 1)'
  },
  listItem:{
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
    }
  },
  subHeader: {
    color:'white',
    backgroundColor: '#011133 !important'
  }
}));



export default function OwnerList() {
  const [stateApp, setStateApp] = useContext(AppContext)
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [stateApp, setStateApp] = useContext(MapContext)
  const classes = useStyles();

  const handleClick = (owner) => {
}


  return (
    <div className={classes.root}>
     <List dense className={classes.list}  aria-label="secondary owners">
        <ListItem className={classes.subHeader} key="subheader" button>
          <ListItemText 
          primary={`My Owners (${stateApp.owners.length})`} />
        </ListItem> 
        {stateApp.owners.map( (owner) => (
        <ListItem onClick={ () => (handleClick(owner))} className={classes.listItem} key={owner.name} button>
          <ListItemText 
          primary={owner.name}
          secondary={owner.ownershipPercentage} />
        </ListItem>
      ) )} 
       
        
      </List>
    </div>
  );
}