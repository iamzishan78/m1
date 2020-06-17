import { useQuery } from "@apollo/react-hooks";
import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { GETPROFILE } from "../../graphQL/useQueryGetProfile";
import { ProfileContext } from "./ProfileContext";

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
    },
  },
  button: {
    textTransform: "none",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "180px",
    borderRadius: "4px",
  },
}));

const ProfileContent = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const {
    user: { email },
  } = stateApp;

  const { data, error, loading } = useQuery(GETPROFILE, {
    variables: { email },
    fetchPolicy: "network-only",
  });
  const {
    fields: { fullname, displayname, activity, phone, timezone, profileImage },
    isImageModalOpen,
  } = stateProfile;

  useEffect(() => {
    if (data?.profileByEmail?.profile) {
      const {
        profileByEmail: {
          profile: {
            fullname,
            displayname,
            activity,
            phone,
            timezone,
            profileImage,
          },
        },
      } = data;

      setStateProfile({
        ...stateProfile,
        fields: {
          fullname,
          displayname,
          activity,
          phone,
          timezone,
          profileImage,
        },
      });
    }
  }, [data]);

  const onChange = ({ name, value }) => {
    setStateProfile({
      ...stateProfile,
      fields: { ...stateProfile.fields, [name]: value },
    });
  };

  const handleImage = (e) => {
    if (e.target.files?.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setStateProfile({
          ...stateProfile,
          isImageModalOpen: true,
          selectedImage: reader.result,
        })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const formatPhone = (number) => {
    const formatted = `${number}`.replace(/\D/g, "");
    const match = formatted.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
  };

  return (
    <MuiDialogContent>
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
            label={"Full Name"}
            placeholder={"Your Full Name"}
            name="fullname"
            value={fullname}
            onChange={({ target }) => onChange(target)}
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
            placeholder={"Display Name"}
            helperText={"This could be your nickname or first name"}
            name="displayname"
            value={displayname}
            onChange={({ target }) => onChange(target)}
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
            label={"What you do"}
            placeholder={"Your Role or Title"}
            helperText={"Let people know what you do"}
            name="activity"
            value={activity}
            onChange={({ target }) => onChange(target)}
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
            placeholder={formatPhone("555-555-5555")}
            helperText={"Enter your phone number"}
            name="phone"
            value={formatPhone(phone)}
            onChange={({ target }) => onChange(target)}
          />
        </Grid>
        <Grid item sm={4}>
          <Typography variant="body1">Profile Photo</Typography>
          {profileImage?.length > 0 ? (
            <CardMedia
              className={classes.image}
              component={"img"}
              image={profileImage}
              title="Profile Image"
            />
          ) : (
            <Skeleton variant="rect" className={classes.image} />
          )}
          <Box pb={2.5} />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-image"
            type="file"
            name="profileimage"
            onChange={(e) => handleImage(e)}
          />
          <label htmlFor="profile-image">
            <Button
              variant="outlined"
              component="span"
              className={classes.button}
            >
              Upload an image
            </Button>
          </label>
        </Grid>
      </Grid>
    </MuiDialogContent>
  );
};

export default ProfileContent;
