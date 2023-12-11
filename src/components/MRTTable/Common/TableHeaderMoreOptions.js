import React, { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu, MenuItem } from "@material-ui/core";

function TableHeaderMoreOptions() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <MoreHorizIcon onClick={handleClick} />
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
