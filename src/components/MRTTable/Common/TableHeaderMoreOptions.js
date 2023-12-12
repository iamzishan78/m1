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
  const tableState = tableController(tableKey).useState(['table']);
  const tableStateValues = tableState.stateValues;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

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
        <MenuItem >
          All
        </MenuItem>
        <MenuItem >
          First 100
        </MenuItem>
        <MenuItem >
          First 250
        </MenuItem>
      </Menu>
    </div>
  );
}

export default TableHeaderMoreOptions;
