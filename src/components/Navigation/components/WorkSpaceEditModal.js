import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { DropzoneAreaBase } from "material-ui-dropzone";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    "& .MuiTypography-root": {
      fontSize: "26px",
      fontWeight: "bold",
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },

  dateRoot: {
    border: "1px solid #EBEBEB",

    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "#EBEBEB",
    },
    "&:active": {
      border: "1px solid black",
      backgroundColor: "#fff",
    },
  },
  inputFieldDate: {
    marginBottom: "7px",
  },
  notchedOutline: {
    border: 0,
  },

  forImage: {
    width: "135px !important",
    height: "130px !important",
    backgroundColor: "transparent !important",
    // border: "1px solid #999",
    borderRadius: "10px !important",
  },
  dropzoneClass: {
    "&:hover": { backgroundColor: "#dddddd" },
    "& .MuiDropzoneArea-text": {
      fontSize: "0.83em",
      marginBlockStart: "1.67em",
      marginBlockEnd: "1.67em",
      fontWeight: "bold",
    },
    "& .MuiDropzoneArea-icon": { display: "none" },

    width: "100%",
    border: "1px solid #dddddd",
    height: "36px",
    display: "flex",
    padding: "6px 37px",
    minHeight: "0px",
    textAlign: "center",
    alignItems: "center",
    fontWeight: "normal",
    marginBottom: "4px",
    justifyContent: "center",
    backgroundColor: "#eee",
    borderRadius: "5px",
    fontSize: "16px",
  },
}));

const DialogTitle = (props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    height: "300px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs({ workspaceSettings, setWorkspaceModal }) {
  const classes = useStyles();

  const handleClose = () => {
    setWorkspaceModal(false);
  };

  const handleFileInput = (files) => {
    if (Array.isArray(files)) {
      let inputFile = files[0]?.file;
      let fileName = files[0]?.file?.name;

      if (inputFile && fileName) {
      }
    }
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={true} maxWidth={"md"}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} classes={classes}>
          Edit Workspace
        </DialogTitle>
        <DialogContent dividers>
          <Grid container display="flex" justify="center" alignItems="center" direction="row" style={{ width: "480px" }}>
            <Grid item xs={5}>
              <img
                src={
                  "https://m1devstorage.blob.core.windows.net/m1dev/61411e422a6d59605f572965.jpg?st=2022-05-10T08%3A56%3A14Z&se=2022-05-10T09%3A56%3A14Z&sp=r&sv=2018-03-28&sr=b&sig=sSUoDNFbEXypXUkf84M3ccFW3iioOJ1mhUeR%2FOR0RWc%3D"
                }
                alt={"file uri not found"}
                className={classes.forImage}
              />
            </Grid>
            <Grid item xs={6}>
              <Grid container display="flex" justify="space-between" alignItems="center" direction="row" spacing={2}>
                <Grid item xs={12}>
                  <h4 style={{ marginBottom: 0 }}>Display Name</h4>
                  <TextField
                    margin="dense"
                    variant="outlined"
                    value={"M1neral"}
                    placeholder=""
                    fullWidth
                    className={`${classes.dateRoot} ${classes.inputFieldDate}`}
                    onChange={(e) => {}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      classes: {
                        root: classes.dateRoot,
                        focused: classes.focused,
                        notchedOutline: classes.notchedOutline,
                        light: classes.light,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DropzoneAreaBase
                    onAdd={handleFileInput}
                    showAlerts={false}
                    filesLimit={1}
                    dropzoneText={"Upload an image"}
                    acceptedFiles={["image/*"]}
                    maxFileSize={104857600}
                    dropzoneClass={classes.dropzoneClass}
                  ></DropzoneAreaBase>
                  <Button fullWidth style={{ textTransform: "capitalize" }}>
                    Remove Image
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" component="span" style={{ backgroundColor: "#00abed", color: "white" }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
