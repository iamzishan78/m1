import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Tooltip, IconButton, Typography } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector } from "react-redux";

const ICON_STYLE = {
  marginLeft: 10,
  marginRight: 10,
};

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: "36px",
  },
}));

const FlowLineAction = ({ title, onEdit, onDelete, onDuplicate }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const { selectedPipe } = useSelector(
    ({ Flow }) => Flow
  );
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditFlowline = () => {
    onEdit()
    handleClose();
  };

  const handleDuplicateFlowline = () => {
    onDuplicate()
    handleClose();
  };

  const handleDeleteFlowline = () => {
    onDelete()
    handleClose();
  };

  const EDIT_DISABLED = !selectedPipe;
  const DUPLICATE_DISABLED = !selectedPipe; // Logic is missing
  const DELETE_DISABLED = !selectedPipe; // Logic is missing

  return (
    <>
      <Tooltip title={title}>
        <IconButton 
          size="medium" 
          style={ICON_STYLE} 
          onClick={handleClick}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Tooltip>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem 
          disabled={EDIT_DISABLED}
          onClick={handleEditFlowline}
        >
          <ListItemIcon classes={{ root: classes.icon }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Edit Flowline</Typography>
        </MenuItem>
        <MenuItem
          disabled={DUPLICATE_DISABLED}
          onClick={handleDuplicateFlowline}
        >
          <ListItemIcon classes={{ root: classes.icon }}>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Duplicate Flowline</Typography>
        </MenuItem>
        <MenuItem
          disabled={DELETE_DISABLED}
          onClick={handleDeleteFlowline} 
        >
          <ListItemIcon classes={{ root: classes.icon }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Delete Flowline</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

FlowLineAction.propTypes = {
  title: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

FlowLineAction.defaultProps = {
  title: "Flowline Actions",
};

export default FlowLineAction;
