import React, { memo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import KeyboardTabBlackIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const getDealNameFieldHeight = (title) => {
  const lineLength = Math.ceil(title.length / 53);
  return `${24 * lineLength}px !important`;
};

const useStyles = makeStyles((theme) => ({
  dealStateOpenWon: {
    padding: "8px 16px",
    borderRadius: 5,
    cursor: "pointer",
    backgroundColor: "#d9d9d9",
    "&:hover": {
      backgroundColor: "#a6e5c3",
      fontWeight: "bold",
      color: "#54a83c",
    },
  },
  dealStateOpenLost: {
    padding: "8px 16px",
    borderRadius: 5,
    cursor: "pointer",
    backgroundColor: "#d9d9d9",
    "&:hover": {
      backgroundColor: "#ffa8a8",
      fontWeight: "bold",
      color: "#f96060",
    },
  },
  dealStateClosed: {
    padding: "8px 16px",
    borderRadius: 18,
  },
  dealStateReopen: {
    padding: "2px 10px",
    cursor: "pointer",
    borderRadius: 5,
    border: "1px solid gray",
  },
  inputField: {
    outline: "none",
  },
  inputFieldDealName: (props) => ({
    width: "750px",
    padding: "0px 30px 20px 30px",
    "& .MuiTextField-root": {
      "& .MuiInputBase-multiline": {
        "& .MuiInputBase-inputMultiline": {
          height: props.title.length > 0 ? getDealNameFieldHeight(props.title) : "auto !important",
        },
      },
    },
  }),
  dealNameRoot: {
    fontWeight: "bold",
    paddingLeft: 0,
    textAlign: "left",
    fontSize: "1.2rem",
    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent",
    },
    "&:hover": {
      border: "1px solid black",
    },
  },
  notchedOutline: {
    border: 0,
  },
  menu: {
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "30px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
  },
  dialogActions: {
    display: "flex",
    justifyContent: "flex-end",
    "& svg": {
      fill: "#d9d9d9",
      "&:hover": {
        fill: "#b5b2b2",
      },
    },
  },
  // input field styling
  dialogInput:{
    "& .MuiInputBase-root": {
      padding: "5px"
    }
  }
}));

const DealDialogHeader = ({
  titleFocus,
  dealState,
  setDealState,
  activeDeal,
  title,
  setTitle,
  updateDealLoading,
  addContactLoading,
  contact,
  openConfirmationDialog,
  setTitleFocus,
  isTransactPage,
  handleClickDialogClose,
}) => {
  const classes = useStyles({ title });
  const [anchorEl, setAnchorEl] = useState();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Grid item container xs={12} style={{ padding: "30px 14px 10px 25px" }}>
        {!titleFocus && (
          <>
            <Grid item xs={6} style={{ minHeight: "35px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  float: "left",
                }}
              >
                {(dealState === null || dealState === "open") && (
                  <>
                    <div
                      className={classes.dealStateOpenWon}
                      onClick={() => setDealState("won")}
                      style={{
                        marginRight: 8,
                      }}
                    >
                      Won
                    </div>

                    <div className={classes.dealStateOpenLost} onClick={() => setDealState("lost")}>
                      Lost
                    </div>
                  </>
                )}
                {dealState === "won" && (
                  <>
                    <div
                      className={classes.dealStateClosed}
                      style={{
                        backgroundColor: "#a6e5c3",
                        fontWeight: "bold",
                        color: "#54a83c",
                        marginRight: 8,
                      }}
                    >
                      Won
                    </div>
                    <div className={classes.dealStateReopen} onClick={() => setDealState(null)}>
                      Re-open
                    </div>
                  </>
                )}
                {dealState === "lost" && (
                  <>
                    <div
                      className={classes.dealStateClosed}
                      style={{
                        backgroundColor: "#ffa8a8",
                        // borderStyle: "solid",
                        fontWeight: "bold",
                        color: "#f96060",
                        marginRight: 8,
                      }}
                    >
                      Lost
                    </div>
                    <div className={classes.dealStateReopen} onClick={() => setDealState(null)}>
                      Re-open
                    </div>
                  </>
                )}
              </div>
            </Grid>
            <Grid item xs={6} className={classes.dialogActions}>
              {(activeDeal?.cardId || activeDeal?.id) && activeDeal?.laneId && (
                <>
                  <IconButton
                    disabled={updateDealLoading || addContactLoading}
                    size="small"
                    component="span"
                    style={{
                      background: "transparent",
                      paddingLeft: "10px",
                      align: "center",
                    }}
                    onClick={handleMenuClick}
                    data-testid="delete-deal-icon-button"
                  >
                    <MoreHorizIcon size="medium" />
                  </IconButton>
                  <Menu
                    id="dealMenu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    className={classes.menu}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <MenuItem onClick={openConfirmationDialog} data-testid="delete-confirm">
                      <ListItemIcon>
                        <DeleteIcon size="medium" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
              <IconButton
                size="small"
                component="span"
                style={{
                  background: "transparent",
                  paddingLeft: "10px",
                  align: "center",
                }}
                onClick={handleClickDialogClose}
                data-testid="add-deal-icon-button"
              >
                <KeyboardTabBlackIcon />
              </IconButton>
            </Grid>
          </>
        )}
      </Grid>
      <Grid item container xs={12} style={{ padding: "0px 0px 0px 10px" }} alignItems="center">
        <FormControl variant="outlined" className={classes.inputFieldDealName} style={{ marginLeft: "-15px" }} fullWidth size="small">
          <TextField
            className={classes.dialogInput}
            margin="dense"
            value={title}
            variant="outlined"
            placeholder="Click to enter deal name"
            required
            multiline
            error={!title}
            helperText={!title ? "Enter a deal name to get started" : ""}
            onChange={({ target }) => setTitle(target.value)}
            InputProps={{
              classes: {
                root: classes.dealNameRoot,
                focused: classes.focused,
                notchedOutline: classes.notchedOutline,
              },
            }}
            onBlur={() => setTitleFocus(false)}
          />
          {/* <TextareaAutosize aria-label="empty textarea" placeholder="Empty" style={{ width: 200 }} /> */}
        </FormControl>
      </Grid>
      <Divider />
    </div>
  );
};

export default memo(DealDialogHeader);
