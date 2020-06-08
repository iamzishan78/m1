import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  label: {
    position: "initial",
    textAlign: "left",
    transform: "none",
    fontSize: 16,
    color: "black",
    "&& + *": {
      // override initial styles
      // label + .MuiInput-formControl
      marginTop: theme.spacing(1),
    },
  },
  focused: {
    "&$label": {
      color: "black",
    },
  },
  helperText: {
    color: "#6c757d",
    lineHeight: "19.2px",
    marginTop: theme.spacing(1) / 2,
    fontSize: 12.8,
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ced4da",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#ced4da",
      //   boxShadow: `0 0 0 0.2rem ${Color(normalColor).fade(0.75)}`,
    },
  },
  button: {
    textTransform: "none",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "150px",
  },
}));

const ProfileContent = () => {
  const classes = useStyles();
  return (
    <MuiDialogContent className={{}}>
      <Grid container>
        <Grid item sm={8}>
          <TextField
            InputLabelProps={{
              classes: { root: classes.label, focused: classes.focused },
              shrink: true,
            }}
            InputProps={{
              disableUnderline: true,
              classes: { input: classes.input },
            }}
            FormHelperTextProps={{
              classes: { root: classes.helperText },
            }}
            label={"Full name"}
            placeholder={"Jacob Averi"}
          />
          <Box pb={2.5} />
          <TextField
            InputLabelProps={{
              classes: { root: classes.label, focused: classes.focused },
              shrink: true,
            }}
            InputProps={{
              disableUnderline: true,
              classes: { input: classes.input },
            }}
            FormHelperTextProps={{
              classes: { root: classes.helperText },
            }}
            label={"Display Name"}
            placeholder={"Jacob Averi"}
            helperText={"This could be..."}
          />
          <Box pb={2.5} />
          <TextField
            InputLabelProps={{
              classes: { root: classes.label, focused: classes.focused },
              shrink: true,
            }}
            InputProps={{
              disableUnderline: true,
              error: true,
              classes: { input: classes.input },
            }}
            FormHelperTextProps={{
              classes: { root: classes.helperText },
            }}
            label={"What I do"}
            placeholder={"Chief cook"}
            helperText={"Let people know what you do"}
          />
          <Box pb={2.5} />
          <TextField
            InputLabelProps={{
              classes: { root: classes.label, focused: classes.focused },
              shrink: true,
            }}
            InputProps={{
              disableUnderline: true,
              error: true,
              classes: { input: classes.input },
            }}
            FormHelperTextProps={{
              classes: { root: classes.helperText },
            }}
            label={"Phone number"}
            placeholder={"0703"}
            helperText={"Enter a phone number"}
          />
          <Box pb={2.5} />
          <TextField
            InputLabelProps={{
              classes: { root: classes.label, focused: classes.focused },
              shrink: true,
            }}
            InputProps={{
              disableUnderline: true,
              error: true,
              classes: { input: classes.input },
            }}
            FormHelperTextProps={{
              classes: { root: classes.helperText },
            }}
            label={"Time zone"}
            placeholder={"UTC"}
            helperText={"Your current timezone"}
          />
        </Grid>
        <Grid item sm={4} spacing={2}>
          <Typography variant="body1">Profile Photo</Typography>
          {/* <CardMedia
          // component={'img'} // add this line to use <img />
          // image={"src"}
          //   classes={styles}
          /> */}
          <Skeleton variant="rect" className={classes.image} />
          <Box pb={2.5} />
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              className={classes.button}
            >
              Upload an image
            </Button>
          </label>
          <Button
            variant="raised"
            component="span"
            className={classes.button}
            style={{ color: "blue" }}
          >
            Remove photo
          </Button>
        </Grid>
      </Grid>
    </MuiDialogContent>
  );
};

export default ProfileContent;
