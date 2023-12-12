import React, { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MRT_SelectCheckbox_OverRide from 'components/MRTTable/Common/MRT_SelectCheckbox_OverRide';
import { tableController } from 'hookstate/tableController';

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
  const tableState = tableController(tableKey).useState(['table', 'data']);
  const tableStateValues = tableState.stateValues;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (number) => {
    console.log(number)
    let newstate = {}
    for (let i = 0; i < number; i++) {
      newstate[i] = true
    }
    tableController(tableKey).setColumnCheck(newstate)
    handleClose()
  }

  if (!(!!tableStateValues?.table)) return (<ExpandMoreIcon onClick={handleClick} />)

  return (
    <div className={classes.root}>
      <MRT_SelectCheckbox_OverRide row={undefined} selectAll={true} table={tableStateValues?.table} tableKey={tableKey} />
      <ExpandMoreIcon onClick={handleClick} />
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
        <MenuItem
          onClick={() => {
            handleSelect(tableStateValues.data?.total);
          }}>
          All
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSelect(100);
          }}
        >
          First 100
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSelect(250);
          }}
        >
          First 250
        </MenuItem>
      </Menu>
    </div>
  );
}

export default TableHeaderMoreOptions;
