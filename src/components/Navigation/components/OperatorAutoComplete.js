import React, {useContext, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavigationContext } from '../NavigationContext';
import useQueryOperators from '../../../graphQL/useQueryOperators';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';


const useStyles = makeStyles({
    listbox: {
      '& ul': {
        padding: 0,
        margin: 0,
      },
    },
  });

  const OuterElementContext = React.createContext({});

    const OuterElementType = React.forwardRef((props, ref) => {
      const outerProps = React.useContext(OuterElementContext);
      return <div ref={ref} {...props} {...outerProps} />;
    });


export default function OperatorAutoComplete() {
    const classes = useStyles();
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [operatorName, setOperatorName] = React.useState(stateNav.operatorName ? stateNav.operatorName : null);
    
        const {data,loading,error} = useQueryOperators()

        const handleOperatorChange = value => {
           // console.log(value)
           let filter;
           if(value && value.Name) {
            filter = ['match', ['get', 'Operator'], value.Name, true, false]
            setStateNav(stateNav => ({ ...stateNav, operatorName:value}))
            setOperatorName(value)
           }
           else {
            filter = null
            setStateNav(stateNav => ({ ...stateNav, operatorName:null}))
           }
           
            setStateNav(stateNav => ({ ...stateNav, filterOperator: filter}))
           
          };

    
    useEffect( () => {
       
            if(!stateNav.operators) {
               
                if(data) {
                    let operators = data.operators;
                    setStateNav(state => ({...state,operators:operators}))
                }
            }
            else {
               // console.log(stateNav.operators[0])
            }
        
    },[stateNav.operators,data])

    const LISTBOX_PADDING = 8; // px

    function renderRow(props) {
      const { data, index, style } = props;
      return React.cloneElement(data[index], {
        style: {
          ...style,
          top: style.top + LISTBOX_PADDING,
        },
      });
    }


    const renderGroup = params => [
        <ListSubheader key={params.key} component="div">
        {params.key}
        </ListSubheader>,
        params.children,
    ];
    
    

    // Adapter for react-window
    const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;
  
    const getChildSize = child => {
      if (React.isValidElement(child) && child.type === ListSubheader) {
        return 48;
      }
  
      return itemSize;
    };
  
    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };
  
    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            key={itemCount}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={index => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });
  
  ListboxComponent.propTypes = {
    children: PropTypes.node,
  };
  
  // console.log('+++++++++++++++')
  // console.log(stateNav.operatorName)
  // console.log('--------------------')
 

  return  stateNav.operators ? (

     <Autocomplete 
    value={stateNav.operatorName}
    onChange={(event, newValue) => {
        handleOperatorChange(newValue);
      }}
    //multiple
    id="virtualize-operators"
    style={{ maxWidth: 300, minWidth: 120 }}
    disableListWrap
    classes={classes}
    ListboxComponent={ListboxComponent}
    options={stateNav.operators}
    getOptionLabel={option => option.Name}
    renderInput={params => (
        
      <TextField {...params} variant="outlined" label="Operator" fullWidth />
    )}
    renderOption={option => <Typography noWrap>{option.Name}</Typography>}
  />):
  (<CircularProgress color="secondary" />)
  



}