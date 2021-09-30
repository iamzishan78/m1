import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Grid, Typography, IconButton, Tab, Tabs, Dialog, Breadcrumbs, Link } from "@material-ui/core";
import { Close as CloseIcon, Delete as DeleteIcon, NavigateNext as NavigateNextIcon } from "@material-ui/icons/";
import { makeStyles } from "@material-ui/core/styles";

import { setFlowState, showErrorMessage, showSuccessMessage, showWarningMessage } from "actions";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import BaicInfoPanel from "components/Transact/components/PipelineCustomizeDialog/BasicInfo";
import DealStagesPanel from "components/Transact/components/PipelineCustomizeDialog/DealStages";
import StageDetails from "components/Transact/components/PipelineCustomizeDialog/StageDetails";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { deepEqualObjects } from "components/Shared/functions";

import { AppContext } from "AppContext";
import { DEALSCOUNTINAPIPE } from "graphQL/useQueryNonDeletedDealsCountInAPipeline";
import { UPDATEPIPELINES, UPDATE_PIPELINE } from "graphQL/useMutationUpdatePipelines";
import { ADD_PIPELINE } from "graphQL/useMutationAddPipeline";
import { ADDSTAGES } from "graphQL/useMutationAddStages";
import { UPDATESTAGES } from "graphQL/useMutationUpdateStages";
import { CREATE_PIPELINE_DESCRIPTORS, UPDATE_PIPELINE_DESCRIPTORS } from "graphQL/useMutationPipelineDescriptors";

const DIALOG_WIDTHS = {
  BASIC: "450px",
  LANES: "1100px",
};

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
  const [width, setDialogWidth] = useState(DIALOG_WIDTHS.BASIC);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFunc, setDeleteFunc] = useState(null);
  const [stages, setStages] = useState([]);
  const [flowErrors, setFlowErrors] = useState([]);
  const [stagesError, setStageError] = useState(false);
  const [selectedStageForDetail, setStage] = useState(null);
  const { control, reset, setValue, getValues, watch } = useForm("FLOWLINE_FORM");

  const [stateApp, setStateApp] = useContext(AppContext);
  const { openPipeDialog, selectedPipe } = useSelector(({ Flow }) => Flow);

  const [getDealsCountByPipeline, { data: dataDealsCountByPipeline }] = useLazyQuery(DEALSCOUNTINAPIPE, {
    fetchPolicy: "network-only",
  });
  const [updatePipeline] = useMutation(UPDATE_PIPELINE);
  const [updatePipelines] = useMutation(UPDATEPIPELINES);
  const [addPipeline] = useMutation(ADD_PIPELINE);
  const [addStages] = useMutation(ADDSTAGES);
  const [updateStages] = useMutation(UPDATESTAGES);
  const [updatePipelineDescriptors] = useMutation(UPDATE_PIPELINE_DESCRIPTORS);
  const [createPipelineDescriptors] = useMutation(CREATE_PIPELINE_DESCRIPTORS);

  const classes = useStyles({ width });

  useEffect(() => {
    return () => reset({});
  }, [reset]);

  useEffect(() => {
    if (selectedStageForDetail) {
      setDialogWidth(DIALOG_WIDTHS.BASIC);
    }
  }, [selectedStageForDetail]);

  useEffect(() => {
    if (dataDealsCountByPipeline?.nonDeletedDealsCountInAPipeline) {
      setStateApp((state) => ({
        ...state,
        uniuniversalCircularLoaderAct: false,
      }));
      if (dataDealsCountByPipeline.nonDeletedDealsCountInAPipeline.dealsCount > 0)
        dispatch(showWarningMessage("There are deals associated to the pipeline, please remove them first."));
      else {
        setDeleteDialogOpen("pipe");
        handleClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDealsCountByPipeline]);

  const handleChange = (event, tab) => {
    if (tab === 0) {
      setDialogWidth(DIALOG_WIDTHS.BASIC);
    } else setDialogWidth(DIALOG_WIDTHS.LANES);
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

  const handleSaveOrUpdate = () => {
    const formStates = getValues();
    if (!formStates.name) {
      setFlowErrors((flowErrors) => ({ ...flowErrors, name: true }));
      return;
    }

    let isValid = stages.length > 0 ? true : false;
    for (let s = 0; s < stages.length; s += 1) {
      if (!stages[s].name || stages[s].name === "") {
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      setStageError(true);
      handleChange(null, 1);
      return;
    }

    if (openPipeDialog === "newPipe") {
      // New flowline
      addPipeline({
        variables: {
          pipeline: {
            ...formStates,
            stages,
            userId: stateApp.user.mongoId,
          },
        },
        refetchQueries: ["getPipelines", "getPipeline"],
        awaitRefetchQueries: true,
      });
    } else if (selectedPipe) {
      ////update
      let stagesToUpdate = [];

      let pipeToUpdate = { ...selectedPipe, ...formStates }; //// else update the ts

      let stagesToAdd = stages.filter((stage) => !stage._id);
      let existingStages = stages.filter((stage) => stage._id);

      for (let i = 0; i < existingStages.length; i++) {
        const frontEndStage = { ...existingStages[i] };
        for (let j = 0; j < selectedPipe.stages.length; j++) {
          const dbStage = { ...selectedPipe.stages[j] };
          if (dbStage._id === frontEndStage._id) {
            if (!deepEqualObjects(dbStage, frontEndStage)) {
              let stageToUpdate = {
                _id: dbStage._id,
                descriptorId: dbStage.descriptorId,
              };

              //// checking if the descriptor position changed
              if (dbStage.position !== frontEndStage.position) stageToUpdate.position = frontEndStage.position;

              //// checking if something change in the real stage object
              delete dbStage.position;
              delete frontEndStage.position;
              if (!deepEqualObjects(dbStage, frontEndStage)) stageToUpdate = { ...stageToUpdate, ...frontEndStage };

              ////
              stagesToUpdate.push(stageToUpdate);
            }

            break;
          }
        }
      }

      //// checking if some db stage was deleted
      for (let j = 0; j < selectedPipe.stages.length; j++) {
        const dbStage = { ...selectedPipe.stages[j] };
        let found = false;

        for (let i = 0; i < stages.length; i++) {
          const frontEndStage = { ...stages[i] };
          if (dbStage._id === frontEndStage._id) {
            found = true;
            break;
          }
        }

        if (!found) stagesToUpdate.push({ _id: dbStage._id, IsDeleted: true });
      }

      //// pipeToUpdate ////
      //// stagesToAdd ////
      //// stagesToUpdate ////

      let success = true;
      let allPromises = [];

      if (pipeToUpdate) {
        if (pipeToUpdate.IsDefault) pipeToUpdate = { ...pipeToUpdate, position: 0 };
        allPromises.push(
          new Promise((resolve, reject) => {
            updatePipeline({
              variables: {
                pipeline: pipeToUpdate,
              },
              refetchQueries: ["getPipelines", "getPipeline"], //// separete latter to the end all promises
              awaitRefetchQueries: true,
            }).then((result) => {
              const {
                data: { updatePipeline },
              } = result;

              if (updatePipeline?.success === false) success = false;

              resolve();
            });
          })
        );
      }

      if (stagesToAdd && stagesToAdd.length > 0)
        allPromises.push(
          new Promise((resolve, reject) => {
            addStages({
              variables: {
                stages: stagesToAdd,
                pipelineId: selectedPipe._id,
                userId: stateApp.user.mongoId,
              },
              refetchQueries: ["getPipelines", "getPipeline"], //// separete latter to the end all promises
              awaitRefetchQueries: true,
            }).then((result) => {
              const {
                data: { addStages },
              } = result;

              if (addStages?.success === false) success = false;

              resolve();
            });
          })
        );
      // attaching project
      if (selectedPipe.projectId && !formStates.projectId)
        updatePipelineDescriptors({
          variables: {
            descriptors: [
              {
                relatedObject: selectedPipe.projectId,
                descriptorObject: selectedPipe._id,
                isDeleted: true,
              },
            ],
          },
        });
      // removing project
      else if (!selectedPipe.projectId && formStates.projectId)
        createPipelineDescriptors({
          variables: {
            descriptor: {
              projectId: formStates.projectId,
              pipelines: [selectedPipe._id],
              userId: stateApp.user.mongoId,
            },
          },
        });

      if (stagesToUpdate && stagesToUpdate.length > 0)
        allPromises.push(
          new Promise((resolve, reject) => {
            updateStages({
              variables: {
                stages: stagesToUpdate,
              },
              refetchQueries: ["getPipelines", "getPipeline"], //// separete latter to the end all promises
              awaitRefetchQueries: true,
            }).then((result) => {
              const {
                data: { updateStages },
              } = result;

              if (updateStages?.success === false) success = false;

              resolve();
            });
          })
        );

      Promise.all(allPromises)
        .then((values) => {
          if (success === true) dispatch(showSuccessMessage("The Pipeline was successfully updated."));
          else dispatch(showErrorMessage("An error occurred during the update."));
        })
        .catch((reason) => {});
    }
    handleClose();
  };

  return (
    <>
      {openPipeDialog === "newPipe" || openPipeDialog ? (
        <RightDialog open={openPipeDialog === "newPipe" || openPipeDialog} handleClickDialogClose={handleSaveOrUpdate} width={width}>
          <div className={classes.root}>
            <div className={classes.stickyHeader}>
              <Grid container justify="space-between" direction="row" display="flex">
                <Grid item>
                  <Typography variant="h5" style={{ float: "left", fontSize: "1.3rem" }}>
                    {openPipeDialog === "newPipe" ? "New Flowline" : "Edit Flowline"}
                  </Typography>
                </Grid>
                <Grid item>
                  {openPipeDialog !== "newPipe" && (
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
                  )}
                  <IconButton size="small" onClick={handleClose}>
                    <CloseIcon className={classes.closeIcon} fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
            {!selectedStageForDetail ? (
              <>
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
                  <div style={{ display: tab !== 0 ? "none" : "" }}>
                    <BaicInfoPanel
                      control={control}
                      reset={reset}
                      setValue={setValue}
                      watch={watch}
                      flowErrors={flowErrors}
                      setFlowErrors={setFlowErrors}
                    />
                  </div>
                  <div style={{ display: tab === 0 ? "none" : "" }}>
                    <DealStagesPanel
                      showWarningMessage={showWarningMessage}
                      stages={stages}
                      setStages={setStages}
                      stagesError={stagesError}
                      setStageError={setStageError}
                      setStage={setStage}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginLeft: "23px" }}>
                  <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link
                      style={{
                        marginLeft: "5px",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      color="inherit"
                      onClick={() => {
                        setStage(null);
                        setDialogWidth(DIALOG_WIDTHS.LANES);
                      }}
                    >
                      Lanes
                    </Link>
                    <Typography style={{ color: "#18AADD", fontSize: "16px", marginLeft: "5px" }}>{selectedStageForDetail.name}</Typography>
                  </Breadcrumbs>
                </div>
                <StageDetails />
              </>
            )}
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
