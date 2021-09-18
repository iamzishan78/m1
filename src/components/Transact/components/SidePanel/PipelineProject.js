import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Accordion, AccordionSummary, Typography, Grid, TextField } from "@material-ui/core";
import { ExpandMore, ExpandLess, Edit } from "@material-ui/icons";
import { useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import { Flipped } from "react-flip-toolkit";
import { UPDATE_PROJECT } from "graphQL/useMutationUpdateProject";
import { useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    width: "95%",
    margin: "10px 5px 5px 5px",
    zIndex: props.muted ? 1 : 0,
    color: props.muted ? theme.palette.primary.dark : "inherit",
  }),
  accordionRoot: {
    borderRadius: "5px",
    backgroundColor: "#111c35",
    color: "#fff",
    "& .MuiButtonBase-root.MuiAccordionSummary-root": {
      maxHeight: "50px",
      minHeight: "50px",
    },
  },
  headingGrid: {
    width: (props) => (props.isEdit.mode ? "90%" : "auto"),
    marginRight: 5,
    height: (props) => (props.isEdit.mode ? "30px" : "20px"),
  },
  heading: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: 500,
    textAlign: "left",
  },
  textField: {
    color: "#fff",
    height: "100%",
    width: "100%",
    borderRadius: 3,
    border: "1px #67696c solid",
  },
  textFieldInput: {
    color: "#fff",
    height: "10px",
  },
  textFieldLabel: {
    color: "#fff",
  },
}));

const PipelineProject = (props) => {
  const [isEdit, setEdit] = useState({});
  const { project, containingPipelines, handleToggleCollapse, data, handleDragBegin, handleDragEnd } = props;

  // MUTATIONS
  const [updateProject] = useMutation(UPDATE_PROJECT);

  // METHODS
  const onUpdateProjectNameHandler = (newProjectName) => {
    updateProject({
      variables: {
        project: {
          _id: project.projectId,
          name: newProjectName,
        },
      },
      refetchQueries: ["getPipelines"],
      awaitRefetchQueries: true,
    });
    setEdit({});
  };

  const itemRef = React.useRef({ id: -1, depth: -1, data: {} });
  // const { type, collapsed, name } = data;

  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    begin(f) {
      itemRef.current = data;
      handleDragBegin(data);
      console.log("begin drag");
    },
    end(f) {
      handleDragEnd(itemRef.current, data);
      console.log("end drag");
    },
  });

  const [, drop] = useDrop();

  const classes = useStyles({ ...props, isEdit, muted: useIsClosestDragging() || isDragging });

  return (
    <Flipped flipId={data._id}>
      <div className={classes.root} ref={(ref) => drop(preview(ref))}>
        <Accordion className={classes.accordionRoot} ref={isEdit.mode ? null : drag}>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              onClick={() => {
                handleToggleCollapse(project.id);
              }}
              onMouseOver={() => !isEdit.mode && setEdit({ ...isEdit, able: true })}
              onMouseLeave={() => setEdit({ ...isEdit, able: false })}
            >
              <Grid item style={{ height: "24px", marginLeft: "-4px" }}>
                {project.collapsed ? <ExpandLess /> : <ExpandMore />}
              </Grid>
              <Grid item className={classes.headingGrid}>
                {!isEdit.mode ? (
                  <Typography className={classes.heading}>{`${project.projectName} (${containingPipelines.length})`}</Typography>
                ) : (
                  <TextField
                    placeholder="Project Name..."
                    className={classes.textField}
                    variant="filled"
                    id="reddit-input"
                    defaultValue={project.projectName}
                    autoFocus
                    required
                    // helperText={showError ? "Name is required!" : ""}
                    InputProps={{
                      className: classes.textFieldInput,
                      disableUnderline: true,
                    }}
                    InputLabelProps={{ className: classes.textFieldLabel }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();
                        onUpdateProjectNameHandler(e.target.value);
                      }
                    }}
                    onClick={(event) => event.stopPropagation()}
                    onBlur={() => setEdit({ able: false, mode: false })}
                  />
                )}
              </Grid>
              <Grid item style={{ height: "24px" }}>
                {isEdit.able && (
                  <Edit
                    fontSize="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEdit({ able: false, mode: true });
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
      </div>
    </Flipped>
  );
};

export default PipelineProject;
