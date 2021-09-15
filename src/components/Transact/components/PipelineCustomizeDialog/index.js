import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFlowState } from "actions";
import { Grid, Typography, IconButton, Tab, Tabs } from "@material-ui/core";
import { Close as CloseIcon, Delete as DeleteIcon } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/core/styles";

import RightDialog from "components/ContactDetailCard/components/RightDialog";
import BaicInfoPanel from "components/Transact/components/PipelineCustomizeDialog/BasicInfo";
import LanesInfoPanel from "components/Transact/components/PipelineCustomizeDialog/LanesInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTabs-root": {
      "& .MuiTabs-scroller": {
        "& .MuiTabs-flexContainer": {
          width: "320px",
        },
      },
      "& .MuiTabs-indicator": {
        marginLeft: "25px",
        height: "5px",
        width: "113px !important",
        backgroundColor: "#1CB6DA",
      },
    },
  },
  stickyHeader: (props) => ({
    padding: "25px",
    width: props.width,
  }),
  panelInfo: {},
  deleteIcon: {
    fill: theme.palette.secondary.main,
    "&:hover": {
      fill: "red",
    },
  },
}));

const FLOWLINE_CUSTOM_TABS = [
  {
    label: "Basic",
    value: "basic",
  },
  {
    label: "Lanes",
    value: "lanes",
  },
];

const a11yProps = (index) => ({
  id: `full-width-tab-${index}`,
  "aria-controls": `full-width-tabpanel-${index}`,
});

const PipelineCustomDialog = (props) => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [width, setDialogWidth] = useState("450px");
  const { openPipeDialog /*, selectedPipe, pipelines, pipeToShow*/ } = useSelector(({ Flow }) => Flow);

  const classes = useStyles({ width });

  const handleChange = (event, tab) => {
    if (tab === 0) {
      setDialogWidth("450px");
    } else setDialogWidth("1100px");
    setTab(tab);
  };
  const handleClose = () => {
    dispatch(
      setFlowState({
        openPipeDialog: false,
      })
    );
  };

  return (
    <>
      {openPipeDialog === "newPipe" || openPipeDialog ? (
        <RightDialog open={openPipeDialog === "newPipe" || openPipeDialog} handleClickDialogClose={handleClose} width={width}>
          <div className={classes.root}>
            <div className={classes.stickyHeader}>
              <Grid container justify="space-between" direction="row" display="flex">
                <Grid item>
                  <Typography variant="h5" style={{ float: "left", fontSize: "1.3rem" }}>
                    {openPipeDialog === "newPipe" ? "New Flowline" : "Edit Flowline"}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    size="small"
                    component="span"
                    style={{
                      background: "transparent",
                      align: "center",
                    }}
                  >
                    <DeleteIcon size="medium" className={classes.deleteIcon} />
                  </IconButton>
                  <IconButton size="small" onClick={handleClose}>
                    <CloseIcon className={classes.closeIcon} fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="simple tabs example"
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              {FLOWLINE_CUSTOM_TABS.map((tab, index) => (
                <Tab label={tab.label} {...a11yProps(tab.value)} />
              ))}
            </Tabs>
            <div className={classes.panelInfo}>
              {tab === 0 && <BaicInfoPanel />}
              {tab === 1 && <LanesInfoPanel />}
            </div>
          </div>
        </RightDialog>
      ) : (
        <></>
      )}
    </>
  );
};

export default PipelineCustomDialog;
