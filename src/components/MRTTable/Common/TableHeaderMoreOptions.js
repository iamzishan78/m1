import React, { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MRT_SelectCheckbox_OverRide from 'components/MRTTable/Common/MRT_SelectCheckbox_OverRide';
import { tableController } from 'hookstate/tableController';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > .MuiButtonBase-root': {
      padding: '0px'
    }
  },
}));
function TableHeaderMoreOptions({ tableKey }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const tableState = tableController(tableKey).useState([
    'mrtTableRef',
    'data',
    'globalFilter',
    'searchFields',
    'sorting',
    'defaultSort',
    'esIndex',
    'filters',
    'defaultFilters',
  ]);
  const tableStateValues = tableState.stateValues;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = async (number) => {
    number = number > tableStateValues?.data?.total ? tableStateValues?.data?.total : number

    let newstate = {}
    for (let i = 0; i < number; i++) {
      newstate[i] = true
    }
    tableController(tableKey).setColumnCheck(newstate)

    if (number !== tableStateValues?.data?.total)
      tableController(tableKey).updateState({
        isSubSetSelect: {
          total: number
        }
      });
    handleClose()
  }

  if (!tableStateValues?.mrtTableRef) return null

  const menuItems = [
    { label: 'All', value: tableStateValues?.data?.total },
    { label: 'First 100', value: 100 },
    { label: 'First 250', value: 250 },
  ];


  return (
    <div className={classes.root}>
      <MRT_SelectCheckbox_OverRide row={undefined} selectAll={true} table={tableStateValues?.mrtTableRef} tableKey={tableKey} />
      <Tooltip
        title={"Options"}
      >
        <ExpandMoreIcon onClick={handleClick} />
      </Tooltip>

      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={() => handleSelect(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default TableHeaderMoreOptions;
