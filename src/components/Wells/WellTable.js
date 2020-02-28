import React, {useState,useContext,useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WellsContext } from './WellsContext'
import {AppContext} from '../../AppContext'
import { useLazyQuery } from "@apollo/react-hooks";
import { VERTEXEDGESQUERY } from '../../graphQL/useQueryVertexEdges';
import { WELLSQUERY } from '../../graphQL/useQueryWells';
import TrackToggleButton from '../Shared/TrackToggleButton'
import Collapse from "@material-ui/core/Collapse";
import Badge from "@material-ui/core/Badge";
import OwnersProvider from '../Owners/OwnersProvider';
import Tags from '../Shared/Tagger';
import Comments from '../Shared/Comments';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}



function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
    { id: 'api', numeric: false, disablePadding: false, label: 'API' },
    { id: 'wellName', numeric: false, disablePadding: false, label: 'Well' },
    { id: 'operator', numeric: false, disablePadding: false, label: 'Operator' },
    { id: 'wellType', numeric: false, disablePadding: false, label: 'Type' },
    { id: 'wellBoreProfile', numeric: false, disablePadding: false, label: 'Profile' },
    { id: 'ownerCount', numeric: true, disablePadding: false, label: '' },
    { id: 'comments', numeric: false, disablePadding: false, label: '' },
    { id: 'tags', numeric: false, disablePadding: false, label: '' },
    { id: 'isTracked', numeric: false, disablePadding: false, label: '' },
  ];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          /> */}
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align='left'
            //align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));



const useStyles = makeStyles(theme => ({
  rootTable: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  expandedRow: {
    width: '100%',
    backgroundColor:"#fff",
    paddingBottom:0, 
    paddingTop:0
  },
  collapseInsideRow: {
    width: '100%'
  },
  tagWrapper: {
    margin:'10px',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    flexWrap:'nowrap'
  },
  rootList: {
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
  },
  expand: {
    backgroundColor:'#efefef',
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpenOwner: {
    backgroundColor:theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.main
    },
    //transform: 'rotate(180deg)',
  },
  expandOpenTag: {
    backgroundColor:theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.main
    },
    //transform: 'rotate(180deg)',
  },
  expandOpenComment: {
    backgroundColor:theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.main
    },
    //transform: 'rotate(180deg)',
  },
}));


export default function WellTable(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext)
  const [stateWells, setStateWells] = useContext(WellsContext)
  const [parent, setParent] = React.useState(props.parent);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('IsTracked');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [source,setSource] = useState(null)
  const [rows, setRows] = React.useState([]);
  const [getVertexEdges, { loading:loadingGraph, data:dataGraph }] = useLazyQuery(VERTEXEDGESQUERY);
  const [getWells, { loading, data:dataWells }] = useLazyQuery(WELLSQUERY);
  const [collapsedRow,setCollapsedRow] = useState(null)
  const [collapseComponent,setCollapseComponent] = useState('owner');
  const [expanded, setExpanded] = useState(false);
  const [expandedTag, setExpandedTag] = useState(false);
  const [expandedComment, setExpandedComment] = useState(false);
  const [showList,setShowList] = useState(props.showList)

  useEffect( () => {
    setShowList(props.showList)
  },[props.showList,setShowList])

  useEffect( () => {
    if(!source){
      setSource({
        sourceId: stateApp.user.id,
        label: 'user',
        name: stateApp.user.name,
        type:'vertex',
        properties:[]
      })
    }
    getVertexEdges({variables: {'source':source,'edgeLabel':"tracks",'targetLabel':"well"}})
  },[stateApp.user,source])

  useEffect( () => {
    if(props.parent){
    if(props.parent === 'track'){
      
      if(dataGraph) {
        if(dataGraph.vertexEdges.sourceIds){
          if(dataGraph.vertexEdges.sourceIds.length > 0){
              getWells({variables: {'wellIdArray':dataGraph.vertexEdges.sourceIds,'authToken':stateApp.user.authToken}})
          }
        }
      }
    }
  }
  },[stateApp.user,dataGraph,props.parent])

   useEffect( () => {
   
    if(props.parent){
    if(props.parent === 'track'){
     
        if(dataWells && dataGraph) {
           
            if(dataWells.wells) {
              
                dataWells.wells.results.forEach( (well) => {
                
                    if(dataGraph.vertexEdges.sourceIds){
                      if(dataGraph.vertexEdges.sourceIds.length > 0){
                        dataGraph.vertexEdges.sourceIds.forEach( (sourceId) => {
                          if(well.id === sourceId) {
                            well.isTracked = true
                          }})
                      }
                    }
              })
              
              setRows(dataWells.wells.results)
              setStateApp(state => ({...state,wells:dataWells.wells.results}))
          }
          else {
            setRows([])
          }
            
        }
        else {
          
            setRows([])
        }
     

    }
    
  }
  },[dataWells,dataGraph,props.parent]) 


  const handleListClick = (well) => {
    //console.log('flyto',well)
    
    setStateApp(state => ({...state, popupOpen:false}))
    setStateApp(state => ({ ...state, selectedWell:well }))
    setStateApp(state => ({ ...state, selectedWellId:well.id }))
    setStateApp(state => ({...state,flyTo:well}))
    
}

 /*  useEffect( () => {
   
    if(props.parent){
      if(props.parent === 'track'){
     
        if(dataWells) {
             
            setStateApp(state => ({...state,wells:dataWells.wells.results}))
            setRows(dataWells.wells.results)
          }
          else {
            setRows([])
          }
            
      }
      else {
          
            setRows([])
      }
    }
  },[dataWells,props.parent]) */


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.Id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /* const handleClick = (event,row) => {
    setStateApp(state => ({...state,selectedWell:row}))
    
    const selectedIndex = selected.indexOf(row.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    
    
  }; */

  const handleExpandClick = async (index,component) => {
    setCollapseComponent(component)
    setCollapsedRow(index)
    setExpanded(!expanded);
    setExpandedTag(false);
    setExpandedComment(false);
    
  };
  const handleExpandClickTag = async (index,component) => {
    setCollapseComponent(component)
    setCollapsedRow(index)
    setExpandedTag(!expandedTag);
    setExpanded(false);
    setExpandedComment(false);
    
  };
  const handleExpandClickComment = async (index,component) => {
    setCollapseComponent(component)
    setCollapsedRow(index)
    setExpandedComment(!expandedComment);
    setExpanded(false);
    setExpandedTag(false);
    
  };

  
  const isSelected = Id => selected.indexOf(Id) !== -1;
  
  /* let rowsLen = 0;
  if(rows && rows.length > 0) {
    rowsLen = rows.length
  }
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowsLen - page * rowsPerPage); */
  

  return (
    rows && rows.length > 0 ?  showList ? (
      <div className={classes.rootList}>
      <List dense className={classes.wellList}  aria-label="secondary wells">
        <ListItem className={classes.subHeader} 
              key="subheader" 
              button>
          <ListItemText 
          primary={`Tracked Wells (${rows.length})`} 
          secondary = ''
          />
        </ListItem> 
          {rows.map( (well) => (
          <ListItem onClick={ () => (handleListClick(well))} className={classes.wellListItem} key={well.wellName} button>
            <ListItemText 
            primary={well.wellName}
            secondary={well.operator} 
            />
          </ListItem>
          
        ) )} 
        
      </List>
      </div>
    ):(
      
    <div className={classes.rootTable}>
      <Paper className={classes.paper}>
       
       {/*  <EnhancedTableToolbar numSelected={selected.length} /> */}
        
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return ([
                    <TableRow
                      hover
                     // onClick={event => handleClick(event, row,index)}
                     // role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                       <TableCell padding="checkbox">
                        {/* <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        /> */}
                      </TableCell>

                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.api}
                      </TableCell>

                      <TableCell align="left">{row.wellName}</TableCell>

                      <TableCell align="left">{row.operator}</TableCell>
                      <TableCell align="left">{row.wellType}</TableCell>
                      <TableCell align="left">{row.wellBoreProfile}</TableCell>
                      
                      
                      <TableCell align="right">
                      <Badge badgeContent={row.ownerCount} color="secondary">
                      <IconButton size="medium" color="primary"
                        className={clsx(classes.expand, {
                          [classes.expandOpenOwner]:expanded &&  collapsedRow === index,
                        })}
                        onClick={ () => handleExpandClick(index,'owners')}
                        aria-expanded={expanded && collapsedRow === index}
                        aria-label="show owners"
                      >
                        <PeopleAltIcon />
                      </IconButton>
                      </Badge>
                      </TableCell>


                      <TableCell align="right">
                      <Badge badgeContent={0} color="secondary">
                      <IconButton size="medium" color="primary"
                        className={clsx(classes.expand, {
                          [classes.expandOpenComment]: expandedComment &&  collapsedRow === index,
                        })}
                        onClick={ () => handleExpandClickComment(index,'comments')}
                        aria-expanded={expandedComment && collapsedRow === index}
                        aria-label="show comments"
                      >
                        <ChatIcon />
                      </IconButton>
                      </Badge>
                      </TableCell>


                      <TableCell align="right">
                      <Badge badgeContent={0} color="secondary">
                      <IconButton size="medium" color="primary"
                        className={clsx(classes.expand, {
                          [classes.expandOpenTag]: expandedTag &&  collapsedRow === index,
                        })}
                        onClick={ () => handleExpandClickTag(index,'tags')}
                        aria-expanded={expandedTag && collapsedRow === index}
                        aria-label="show tags"
                      >
                        <LocalOfferIcon />
                      </IconButton>
                      </Badge>
                      </TableCell>


                      <TableCell align="right">
                        <TrackToggleButton 
                          source={stateApp.user} 
                          sourceLabel="user" 
                          sourceSourceId={stateApp.user.id} 
                          sourceName={stateApp.user.name} 
                          target= {row} 
                          targetLabel="well" 
                          targetSourceId={row.id}
                          targetName={row.wellName}  />
                      </TableCell>

                    </TableRow>,
                    <TableRow key={index}>
                    <TableCell className={classes.expandedRow} colSpan={9}>
                      <Collapse  className={classes.collapseInsideRow}
                        in={(expanded || expandedTag || expandedComment) && collapsedRow === index}
                        timeout="auto"
                        unmountOnExit
                      >
                       {collapseComponent === 'tags' ? (
                       <div className={classes.tagWrapper}>
                      {/*  <Tags public={true}/> */}
                       <Tags public={false}
                       source={stateApp.user} 
                       sourceLabel="user" 
                       sourceSourceId={stateApp.user.id} 
                       sourceName={stateApp.user.name} 
                       target= {row} 
                       targetLabel="well" 
                       targetSourceId={row.id}
                       targetName={row.wellName}
                       />
                       </div>
                       )
                       : collapseComponent === 'comments' ? (
                        <Comments></Comments>
                       ):(<OwnersProvider selectedWell={row} parent="well"/>)}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  ]);
                })}
              
            </TableBody>
          </Table>
        </TableContainer>
       
      </Paper>
     
    </div>) 
    : loading || loadingGraph ? (<CircularProgress size={80} disableShrink color="secondary" />)
    :(<Skeleton variant="rect" height={300}><Typography variant="button">Not Available</Typography></Skeleton>)
  );
}