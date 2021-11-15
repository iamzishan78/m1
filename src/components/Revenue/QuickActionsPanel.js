import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, Grid, Typography, Drawer } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import { RevenueContext } from "components/Revenue/RevenueContext";

import { useStyles, StyledMenu, StyledMenuItem } from "./styles";
import { SIDE_PANEL_MENU_ITEMS_LIST } from "components/Revenue/Revenue";

function Panel({ children }) {
  const classes = useStyles();
  const { stateRevenue, setStateRevenue } = useContext(RevenueContext);
  const history = useHistory();

  const closeAction = () => {
    setStateRevenue((prevState) => ({
      ...prevState,
      expandedPanel: false,
    }));
  };

  const handleMenuItemClick = (path) => {
    history.push(path);
  };
  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid container direction="row" justify="space-between" display="flex" className={classes.header}>
          <Grid item style={{ alignItems: "center" }}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Revenue
            </Typography>
          </Grid>
          <Grid item>
            <IconButton className={classes.iconArrow} color="secondary" onClick={closeAction}>
              <>
                <ChevronLeftIcon />
                <MenuIcon className={classes.menuIcon} />
              </>
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <Typography variant="body2" className={classes.quickActionText}>
          Quick Actions
        </Typography>
        <StyledMenu>
          {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((key, index) => (
            <StyledMenuItem onClick={() => handleMenuItemClick(SIDE_PANEL_MENU_ITEMS_LIST[key].link)} key={index}>
              <ListItemText>{SIDE_PANEL_MENU_ITEMS_LIST[key].text}</ListItemText>
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </Drawer>
      <div className={classes.revenueRoot}>{children}</div>
    </>
  );
}

export default Panel;
