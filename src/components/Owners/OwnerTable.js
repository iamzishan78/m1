import React, {useState,useContext,useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Collapse from "@material-ui/core/Collapse";
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
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import VisibilityIcon from '@material-ui/icons/Visibility'

import { OwnersContext } from './OwnersContext'
import {AppContext} from '../../AppContext'
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLOWNERSQUERY } from '../../graphQL/useQueryWellOwners';
import { VERTEXEDGESQUERY } from '../../graphQL/useQueryVertexEdges';
import { OWNERSQUERY } from '../../graphQL/useQueryOwners';
import TrackToggleButton from '../Shared/TrackToggleButton'
import Tags from '../Shared/Tagger';
import Comments from '../Shared/Comments';
import ExpandableCardProvider from '../ExpandableCard/ExpandableCardProvider';
import Test from '../ExpandableCard/Test';

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
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'ownershipType', numeric: false, disablePadding: false, label: 'Entity' },
  { id: 'interestType', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'ownershipPercentage', numeric: true, disablePadding: false, label: 'Interest' },
  { id: 'appraisedValue', numeric: true, disablePadding: false, label: 'Appraised Value' },
 /*  { id: 'Address', numeric: true, disablePadding: false, label: 'Address' },
  { id: 'Phone', numeric: true, disablePadding: false, label: 'Phone' },
  { id: 'Email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'Tag', numeric: true, disablePadding: false, label: 'Tag' }, */
  { id: 'comments', numeric: false, disablePadding: false, label: 'Comments' },
  { id: 'tags', numeric: false, disablePadding: false, label: 'Tags' },
  
  { id: 'isTracked', numeric: false, disablePadding: false, label: 'Track' },
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
            inputProps={{ 'aria-label': 'select all desserts' }}
          /> */}
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
  addForm: {
    margin:'15px',
    paddingLeft:'100px',
      '& > *': {
        margin: theme.spacing(1),
        width: 200,
      } 
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

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const [showAdd, setShowAdd] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [entityValue, setEntityValue] = useState('');
  const [typeValue, setTypeValue] = useState('');
  const [interestValue, setInterestValue] = useState('');
  const [appraisedValue, setAppraisedValue] = useState('');
  const [stateOwners, setStateOwners] = useContext(OwnersContext)

  const addOwner = () => {
    let newOwner = {
      name: nameValue,
      ownershipType: entityValue,
      interestType: typeValue,
      appraisedValue: appraisedValue,
      ownershipPercentage:interestValue
    }
    setStateOwners(state => ({...state, ownerToAdd: newOwner}))

    setNameValue('')
    setEntityValue('')
    setTypeValue('')
    setInterestValue('')
    setAppraisedValue('')
    setShowAdd(false)
  }
  return (
    <Toolbar
      className={clsx(classes.root)}
    >
      {showAdd > 0 ? (
        <form className={classes.addForm} noValidate autoComplete="off">
          <TextField  
          onChange={(e)=>{setNameValue(e.target.value)}}
          value={nameValue}
          placeholder="Name"  label="Name" variant="outlined" color="secondary" inputProps={{ 'aria-label': 'description' }} />
          <TextField 
           onChange={(e)=>{setEntityValue(e.target.value)}}
           value={entityValue}
          placeholder="Entity" label="Entity" variant="outlined" color="secondary" inputProps={{ 'aria-label': 'description' }} />
          <TextField 
           onChange={(e)=>{setTypeValue(e.target.value)}}
           value={typeValue}
          placeholder="Type"  label="Type" variant="outlined" color="secondary" inputProps={{ 'aria-label': 'description' }} />
          <TextField 
           onChange={(e)=>{setInterestValue(e.target.value)}}
           value={interestValue}
          placeholder="Interest"  label="Interest" variant="outlined" color="secondary" inputProps={{ 'aria-label': 'description' }} />
          <TextField 
           onChange={(e)=>{setAppraisedValue(e.target.value)}}
           value={appraisedValue}
          placeholder="Value"  label="Appraised Value" variant="outlined" color="secondary" inputProps={{ 'aria-label': 'description' }} />
        
        </form>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Owners
        </Typography>
      )}
       
      {showAdd ? (
        <Tooltip title="done">
          <IconButton color="primary" onClick={ () => {
                addOwner()
           }}  
           aria-label="done">
            <CheckIcon  color="secondary" />
          </IconButton>
        </Tooltip>
      ) : (<Tooltip title="Add">
      <IconButton color="primary" onClick={ () => {
          setShowAdd(true)
      }} 
      aria-label="add">
        <AddIcon color="secondary" />
      </IconButton>
    </Tooltip>)}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
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
    transform: 'rotate(180deg)',
  },
  expandOpenTag: {
    backgroundColor:theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.main
    },
    transform: 'rotate(180deg)',
  },
  expandOpenComment: {
    backgroundColor:theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.main
    },
    transform: 'rotate(180deg)',
  }
}));

export default function OwnerTable(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext)
  const [stateOwners, setStateOwners] = useContext(OwnersContext)
  const [parent, setParent] = React.useState(props.parent);
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('isTracked');
  const [selected, setSelected] = React.useState([]);
  const [selectedWell, setSelectedWell] = React.useState(props.selectedWell ? props.selectedWell : null);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [source,setSource] = useState(null)
  const [rows, setRows] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState();
 
  const [getVertexEdges, { loading:loadingGraph, data:dataGraph }] = useLazyQuery(VERTEXEDGESQUERY);
  const [getOwners, { loading:loadingOwners, data:dataOwners }] = useLazyQuery(OWNERSQUERY);
  const [getWellOwners, { loading:loadingWellOwners, data:dataWellOwners }] = useLazyQuery(WELLOWNERSQUERY);
  const [collapsedRow,setCollapsedRow] = useState(null)
  const [collapseComponent,setCollapseComponent] = useState('owner');
  const [expanded, setExpanded] = useState(false);
  const [expandedTag, setExpandedTag] = useState(false);
  const [expandedComment, setExpandedComment] = useState(false);
  const [distinctName, setDistinctName] = useState([]);
  const [distinctOwnershipType, setDistinctOwnershipType] = useState([]);
  const [distinctInterestType, setDistinctInterestType] = useState([]);
  const [distinctOwnershipPercentage, setDistinctOwnershipPercentage] = useState([]);
  const [distinctAppraisedValue, setDistinctAppraisedValue] = useState([]);
  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  
  //get all owners
  //get user's tracked owner ids from graphDB
  //loop through all owners and set IsTracked to true for each id

  
  //const {data,loading,error} = useQueryWellOwners(stateApp.selectedWell ? stateApp.selectedWell.api : null) 
  useEffect( () => {
    if(stateOwners.ownerToAdd){
      setRows([stateOwners.ownerToAdd,...rows])

    }
  },[stateOwners.ownerToAdd])

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
    else {
      getVertexEdges({variables: {'source':source,'edgeLabel':"tracks",'targetLabel':"owner"}})
     
    }
   
  },[stateApp.user,source])

  useEffect( () => {
 
    if(props.selectedWell) {
      setSelectedWell(props.selectedWell)
      getWellOwners({variables: {'api':selectedWell.api}})
    }

  },[props.selectedWell])

  useEffect( () => {
    if(props.parent){
    if(props.parent === 'track'){
      
      if(dataGraph) {
        if(dataGraph.vertexEdges.sourceIds){
          if(dataGraph.vertexEdges.sourceIds.length > 0){
              getOwners({variables: {'ownerIdArray':dataGraph.vertexEdges.sourceIds,'authToken':stateApp.user.authToken}})
          }
        }
      }
    }
  }
  },[stateApp.user,dataGraph,props.parent])

  useEffect( () => {
   
    if(props.parent){
    if(props.parent === 'well'){
     
        if(dataWellOwners && dataGraph) {
           
            if(dataWellOwners.wellOwners) {
              
                dataWellOwners.wellOwners.forEach( (wellOwner) => {
                
                    if(dataGraph.vertexEdges.sourceIds){
                      if(dataGraph.vertexEdges.sourceIds.length > 0){
                        dataGraph.vertexEdges.sourceIds.forEach( (sourceId) => {
                          if(wellOwner.id === sourceId) {
                            wellOwner.isTracked = true
                          }})
                      }
                    }
              })
             
              setRows(dataWellOwners.wellOwners)
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
  },[dataWellOwners,dataGraph,props.parent])

  useEffect( () => {
   
    if(props.parent){
      if(props.parent === 'track'){
     
        if(dataOwners) {
          dataOwners.owners.results.forEach( (owner) => {
                
            if(dataGraph.vertexEdges.sourceIds){
              if(dataGraph.vertexEdges.sourceIds.length > 0){
                dataGraph.vertexEdges.sourceIds.forEach( (sourceId) => {
                  if(owner.id === sourceId) {
                    owner.isTracked = true
                  }})
              }
            }
      })


            setRows(dataOwners.owners.results)
            setStateApp(state => ({...state,owners:dataOwners.owners.results}))
          }
          else {
            setRows([])
          }
            
      }
      else {
          
            setRows([])
      }
    }
  },[dataOwners,props.parent])

  useEffect( () => {
   
    if(rows && rows.length > 0){
      setDistinctName([...new Set(rows.map(x => x.name))])
      setDistinctOwnershipType([...new Set(rows.map(x => x.ownershipType))])
      setDistinctInterestType([...new Set(rows.map(x => x.interestType))])
      setDistinctOwnershipPercentage([...new Set(rows.map(x => x.ownershipPercentage))])
      setDistinctAppraisedValue([...new Set(rows.map(x => x.appraisedValue))])

      console.log('name',distinctName)
     
      console.log('itype',distinctInterestType)
      console.log('percent',distinctOwnershipPercentage)
      console.log('appraised',distinctAppraisedValue)
    }

},[rows])

useEffect( () => {
  console.log('otype',distinctOwnershipType)
},[distinctOwnershipType])


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

  const handleRowClick = (e,row) => {
    console.log(e)
    console.log(e.nativeEvent)
    setMouseX(e.nativeEvent.clientX)
    setMouseY(e.nativeEvent.clientY-70) 
    setSelectedRow(row)
   handleOpenExpandableCard()
  }
  const handleOpenExpandableCard = () => {
    //setStateApp(state => ({...state,showExpandableCard:true}))
    setShowExpandableCard(true)
     
  }
  const handleCloseExpandableCard = () => {
    
    setShowExpandableCard(false)
   // setStateApp(state => ({...state,showExpandableCard:true}))
     
  }
  
  /* let rowsLen = 0;
  if(rows && rows.length > 0) {
    rowsLen = rows.length
  }
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowsLen - page * rowsPerPage); */
  

  return (
    rows && rows.length > 0 ?  (
    <div className={classes.root}>
       {showExpandableCard ? (
        <ExpandableCardProvider 
        expanded={false}
        handleCloseExpandableCard={handleCloseExpandableCard}
        component={<Test hello="Owner Card Not Available"/>}
        title={selectedRow ? selectedRow.name: null }
        subTitle={selectedRow ? selectedRow.interestType: null }
        parent="owner"
        mouseX={mouseX}
        mouseY={mouseY}
        position="absolute"
        cardLeft={mouseX}
        cardTop={mouseY}
        zIndex={101}
        cardWidth="380px" 
        cardHeight="380px" 
        cardWidthExpanded="85vw" 
        cardHeightExpanded="80vh" 
        source={stateApp.user}
        sourceSourceId={stateApp.user.id}
        sourceName={stateApp.user.name}
        sourceLabel='user'
        target={selectedRow ? selectedRow:null}
        targetSourceId={selectedRow ? selectedRow.id: null} 
        targetName={selectedRow ? selectedRow.name:null}
        targetLabel='owner'></ExpandableCardProvider>):null}
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
                  //const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return ([
                    <TableRow
                      hover
                     // onClick={event => handleRowClick(event,row)}
                      role="checkbox"
                     // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                     // selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                      <IconButton size="medium" color="primary"
                        onClick={ (event) => handleRowClick(event,row)}
                        aria-label="view more">
                        <VisibilityIcon color="secondary" />
                      </IconButton>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.ownershipType}</TableCell>
                      <TableCell align="left">{row.interestType}</TableCell>
                      <TableCell align="right">{row.ownershipPercentage}</TableCell>
                      <TableCell align="right">{row.appraisedValue}</TableCell>
                      <TableCell align="left">
                      <IconButton size="medium" color="primary"
                        className={clsx(classes.expand, {
                          [classes.expandOpenComment]: expandedComment &&  collapsedRow === index,
                        })}
                        onClick={ () => handleExpandClickComment(index,'comments')}
                        aria-expanded={expandedComment && collapsedRow === index}
                        aria-label="show comments"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                     
                      </TableCell>
                      <TableCell align="left">
                      <IconButton size="medium" color="primary"
                        className={clsx(classes.expand, {
                          [classes.expandOpenTag]: expandedTag &&  collapsedRow === index,
                        })}
                        onClick={ () => handleExpandClickTag(index,'tags')}
                        aria-expanded={expandedTag && collapsedRow === index}
                        aria-label="show tags"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                     
                      </TableCell>
                      <TableCell align="center">
                        <TrackToggleButton 
                          source={stateApp.user} 
                          sourceLabel="user" 
                          sourceSourceId={stateApp.user.id} 
                          sourceName={stateApp.user.name} 
                          target= {row} 
                          targetLabel="owner" 
                          targetSourceId={row.id}
                          targetName={row.name}  />
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
                       targetLabel="owner" 
                       targetSourceId={row.id}
                       targetName={row.name}
                       />
                       </div>
                       )
                       : collapseComponent === 'comments' ? (
                        <Comments></Comments>
                       ):(null)}
                      </Collapse>
                    </TableCell>
                  </TableRow>]
                  );
                })}
              
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
      </Paper>
     
    </div>) 
    : loadingOwners || loadingWellOwners || loadingGraph ? (<CircularProgress size={80} disableShrink color="secondary" />)
    :(<Skeleton variant="rect" height={300}><Typography variant="button">Not Available</Typography></Skeleton>)
  );
}