import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, TextField } from "@material-ui/core";
import { ExpandMore, ExpandLess, Edit } from "@material-ui/icons";
import { UPDATE_PROJECT } from "graphQL/useMutationUpdateProject";
import { useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "95%",
    margin: "5px 5px 10px 5px",
  },
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
    width: (props) => (props.mode ? "90%" : "auto"),
    marginRight: 5,
    height: (props) => (props.mode ? "30px" : "20px"),
  },
  heading: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: 500,
    textAlign: "left",
  },
  detailRoot: {
    padding: 0,
    display: "contents",
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

const PipelineProject = ({ key, children, project, containingPipelines }) => {
  const [isExpanded, setExpansion] = useState(false);
  const [isEdit, setEdit] = useState({});
  const classes = useStyles(isEdit);

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

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordionRoot}>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            onClick={() => setExpansion(!isExpanded)}
            onMouseOver={() => !isEdit.mode && setEdit({ ...isEdit, able: true })}
            onMouseLeave={() => setEdit({ ...isEdit, able: false })}
          >
            <Grid item style={{ height: "24px", marginLeft: "-4px" }}>
              {!isExpanded ? <ExpandMore /> : <ExpandLess />}
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
                  onBlur={() => setEdit({ able: false, mode: false })}
                />
              )}
            </Grid>
            <Grid item style={{ height: "24px" }}>
              {isEdit.able && <Edit fontSize="small" onClick={() => setEdit({ able: false, mode: true })} />}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.detailRoot}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default PipelineProject;
