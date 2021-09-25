import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";

const getDealNameFieldHeight = (title) => {
  const lineLength = Math.ceil(title.length / 53);
  return `${22 * lineLength}px !important`;
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
  closeIcon: {
    fill: theme.palette.secondary.main,
    "&:hover": {
      fill: "red",
    },
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
}) => {
  const classes = useStyles({ title });

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
            <Grid
              item
              xs={6}
              style={
                {
                  // minHeight: "35px",
                  // padding: "30px 14px 10px 25px"
                }
              }
            >
              {(activeDeal?.cardId || activeDeal?.id) && activeDeal?.laneId && (
                <>
                  <IconButton
                    disabled={updateDealLoading || addContactLoading}
                    onClick={openConfirmationDialog}
                    size="small"
                    component="span"
                    style={{
                      background: "transparent",
                      paddingLeft: "10px",
                      align: "center",
                      float: "right",
                    }}
                  >
                    <DeleteIcon size="medium" className={classes.closeIcon} />
                  </IconButton>
                </>
              )}
            </Grid>
          </>
        )}
      </Grid>
      <Grid item container xs={12} style={{ padding: "0px 0px 0px 10px" }} alignItems="center">
        {!((Object.keys(contact).length === 0 && contact.constructor === Object) || contact === null) && !isTransactPage && (
          <TextField
            variant="outlined"
            margin="dense"
            value={<Typography noWrap> {contact?.name} </Typography>}
            label="Contact Name"
            fullWidth
            disabled
            className={classes.inputField}
          />
        )}

        <FormControl variant="outlined" className={classes.inputFieldDealName} style={{ marginLeft: "-15px" }} fullWidth size="small">
          <TextField
            margin="dense"
            value={title}
            variant="outlined"
            placeholder="Click to enter deal name"
            required
            // fullWidth
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
