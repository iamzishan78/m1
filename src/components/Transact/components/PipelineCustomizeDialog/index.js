import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Grid, Typography, IconButton, Tab, Tabs, Dialog } from "@material-ui/core";
import { Close as CloseIcon, Delete as DeleteIcon } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/core/styles";

import { setFlowState, showWarningMessage } from "actions";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import BaicInfoPanel from "components/Transact/components/PipelineCustomizeDialog/BasicInfo";
import LanesInfoPanel from "components/Transact/components/PipelineCustomizeDialog/LanesInfo";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

import { AppContext } from "AppContext";
import { DEALSCOUNTINAPIPE } from "graphQL/useQueryNonDeletedDealsCountInAPipeline";
import { UPDATEPIPELINES } from "graphQL/useMutationUpdatePipelines";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFunc, setDeleteFunc] = useState(null);

  const [, setStateApp] = useContext(AppContext);
  const { openPipeDialog, selectedPipe /*, pipelines, pipeToShow*/ } = useSelector(({ Flow }) => Flow);

  const [getDealsCountByPipeline, { data: dataDealsCountByPipeline }] = useLazyQuery(DEALSCOUNTINAPIPE, {
    fetchPolicy: "network-only",
  });
  const [updatePipelines] = useMutation(UPDATEPIPELINES);

  const classes = useStyles({ width });

  useEffect(() => {
    if (dataDealsCountByPipeline?.nonDeletedDealsCountInAPipeline) {
      setStateApp((state) => ({
        ...state,
        uniuniversalCircularLoaderAct: false,
      }));
      if (dataDealsCountByPipeline.nonDeletedDealsCountInAPipeline.dealsCount > 0)
        dispatch(showWarningMessage("There are deals associated to the pipeline, please remove them first."));
      else setDeleteDialogOpen("pipe");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDealsCountByPipeline]);

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

  const handleDeletePipe = () => {
    if (selectedPipe) {
      setStateApp((state) => ({
        ...state,
        uniuniversalCircularLoaderAct: true,
      }));

      getDealsCountByPipeline({
        variables: {
          pipelinesIds: [selectedPipe?._id],
        },
      });

      setDeleteFunc(() => () => {
        updatePipelines({
          variables: {
            pipelines: [{ _id: selectedPipe._id, IsDeleted: true }],
          },
          refetchQueries: ["getPipelines"],
          awaitRefetchQueries: true,
        });
        dispatch(
          setFlowState({
            openPipeDialog: false,
            selectedPipe: null,
            pipeToShow: null,
          })
        );
      });
    }
  };

  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);

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
                    onClick={handleDeletePipe}
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
      {deleteDialogOpen && (
        <Dialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDeleteDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={deleteDialogOpen === "pipe" ? `Delete Flowline` : `Delete Stage`}
            onClose={handleCloseDeleteDialog}
            deleteFunc={deleteFunc ? deleteFunc : () => {}}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => {}}
          >
            {deleteDialogOpen === "pipe" ? "Are you sure you want to delete the Flowline?" : "Are you sure you want to delete the stage?"}
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PipelineCustomDialog;
