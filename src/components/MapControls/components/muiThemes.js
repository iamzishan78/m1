import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const MUIMenuProps = {
  variant: "menu",
  MenuListProps: {
    disablePadding: true
  }
};
const MUIPopoverProps = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "top",
    horizontal: "left"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "right"
  }
};
export const useStyles = makeStyles(theme => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important"
  }
}));

export const StyledMenu = withStyles({
  paper: {
    border: "1px solid #011133"
  }
})(props => <Menu {...MUIMenuProps} {...MUIPopoverProps} {...props} />);

export const StyledMenuItem = withStyles(theme => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#4B618F"
    },
    backgroundColor: "#263451",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white
    }
  }
}))(MenuItem);
