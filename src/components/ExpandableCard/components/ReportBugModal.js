import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import { SENDEMAILBUG } from "../../../graphQL/useMutationSendEmailBug";

const useStyles = makeStyles((theme) => ({
  root: {
    "&  .MuiPaper-root": {
      maxWidth: "400px",
      padding: "25px",
    },
  },
  dialogTitle: {
    textAlign: "center",
  },
  dialogContentText: {
    textAlign: "center",
  },
  inputField: {
    marginBottom: "15px",
  },
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle",
  },
  dialogFooter: { display: "flex", justifyContent: "space-between" },

  label: {
    backgroundColor: "white",
  },
}));

const initialErrors = {
  issue: false,
  description: false,
};

function ReportBugModal(props) {
  const classes = useStyles();
  const { open, onClose } = props;

  const [issue, setIssue] = useState("missing");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ ...initialErrors });
  const [sendEmailBug, { called, loading, data }] = useMutation(SENDEMAILBUG);

  const sendEmailStatus = data ? data.sendEmailBug : null;

  const clearFields = () => {
    setDescription("");
    setIssue("missing");
  };

  const updateErrors = () => {
    let issueErr = false;
    let descriptionErr = false;
    if (!issue || issue.length === 0) issueErr = true;
    if (!description || description.length === 0) descriptionErr = true;
    setErrors({
      issue: issueErr,
      description: descriptionErr,
    });
    return issueErr || descriptionErr;
  };

  const sendMail = async () => {
    if (updateErrors()) return;

    sendEmailBug({
      variables: {
        email: {
          issue,
          description,
        },
      },
    });
  };

  useEffect(() => {
    if (called && !loading && sendEmailStatus.success === true) {
      clearFields();
    }
  }, [called, loading, sendEmailStatus]);

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={open}
      onClose={onClose}
      className={classes.root}
    >
      <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
        Log Data Issue
      </DialogTitle>
      <DialogContent>
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.inputField}
          size="small"
        >
          <InputLabel
            id="demo-simple-select-outlined-label"
            className={classes.label}
          >
            Issue Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={issue}
            onChange={(e) => {
              setIssue(e.target.value);
              updateErrors();
            }}
            fullWidth
            label="Issue type"
            disabled={loading}
            error={errors.issue}
          >
            <MenuItem value={"missing"}>Missing Information</MenuItem>
            <MenuItem value={"incorrect"}>Incorrect Information</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          multiline
          rows={4}
          id="issuedescription"
          label="Issue description"
          type="text"
          size="small"
          fullWidth
          className={classes.inputField}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            updateErrors();
          }}
          disabled={loading}
          error={errors.description}
        />

        <div className={classes.dialogFooter}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            disableElevation
            onClick={sendMail}
            disabled={loading}
          >
            Send
          </Button>
          {loading ? (
            <CircularProgress color="secondary" className={classes.progress} />
          ) : called && !loading ? (
            sendEmailStatus.success ? (
              <Typography color="secondary" variant="subtitle2" gutterBottom>
                Issue submitted successfully
              </Typography>
            ) : (
              <Typography color="primary" variant="subtitle2" gutterBottom>
                Unable to submit issue.
              </Typography>
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReportBugModal;
