import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";
import { TextField, Grid, Avatar, InputAdornment } from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import CustomAvatar from "components/Shared/ui/CustomAvatar";
import { getRandomColor } from "components/Shared/functions/ui";

const useStyles = makeStyles((theme) => ({
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dealOwnerRoot: {
    border: "1px solid #EBEBEB",
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingLeft: 26,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover.MuiOutlinedInput-root": {
      backgroundColor: "#EBEBEB",
    },
    "&:hover .MuiAutocomplete-popupIndicator": {
      visibility: "visible",
      padding: "2px",
      marginRight: "-2px",
    },
  },
  dealOwnerRootFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black",
    },
  },
  popupIndicator: {
    visibility: "hidden",
    padding: "2px",
    marginRight: "-2px",
    "&:hover": {
      visibility: "visible",
    },
  },
  inputFieldOwner: {
    marginBottom: "7px",
  },
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "#fff",
    fontSize: "0.6rem",
    backgroundColor: "#4880F6",
    padding: "0.5em",
  },
  dealOwnerLabel: {
    marginLeft: 4,
  },
}));

const UsersListWithIcon = ({ label, placeholder, selectedUserId, onChangeUser, labelSize = 3, fieldSize = 9 }) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getAllMongoUsers();
  }, [getAllMongoUsers]);

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      setUsers(
        userLists.allMongoUsers.map((user) => ({
          value: user._id,
          text: user.name,
          email: user.email,
        }))
      );
    }
  }, [userLists]);

  return (
    <Grid container className={classes.gridStyle}>
      <Grid item xs={labelSize}>
        <div>{label}</div>
      </Grid>
      <Grid item xs={fieldSize}>
        <Autocomplete
          id="userList"
          options={users.filter((u) => u.text)}
          onChange={(e, user) => onChangeUser(user)}
          value={users.find((user) => user?.value === selectedUserId) || null}
          getOptionLabel={(option) => option.text}
          getOptionSelected={(option) => option.value === selectedUserId}
          classes={{
            inputRoot: classes.dealOwnerRoot,
            focused: classes.dealOwnerRootFocused,
            popupIndicator: classes.popupIndicator,
          }}
          renderInput={(params) => (
            <TextField
              margin="dense"
              {...params}
              variant="outlined"
              className={classes.inputFieldOwner}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
                classes: {
                  root: classes.dealOwnerLabel,
                },
              }}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <Avatar
                        style={{
                          backgroundColor: users.find((user) => user?.value === selectedUserId)
                            ? getRandomColor(users.find((user) => user?.value === selectedUserId).text.toString())
                            : "",
                        }}
                        className={classes.dealOwnerAvatar}
                      >
                        {users.find((user) => user?.value === selectedUserId) ? (
                          <CustomAvatar
                            diglog={true}
                            email={users.find((user) => user?.value === selectedUserId).email}
                            text={
                              users
                                .find((user) => user?.value === selectedUserId)
                                .text.toString()
                                .toUpperCase().length > 1
                                ? users.find((user) => user?.value === selectedUserId).text.toString()
                                : "Add Owner"
                            }
                          />
                        ) : (
                          "AO"
                        )}
                      </Avatar>
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default UsersListWithIcon;
