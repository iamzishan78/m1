import React, { useState, useEffect } from "react";
import { get } from "lodash";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import { Typography, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, FormControl, TextField } from "@material-ui/core";
import { InfoOutlined as InfoOutlinedIcon, MoreHoriz as MoreHorizIcon, Delete as DeleteIcon } from "@material-ui/icons";

import Tags from "components/Shared/Tagger";

const getDealNameFieldHeight = (title) => {
  const lineLength = Math.ceil(title.length / 53);
  return `${24 * lineLength}px !important`;
};

const useStyles = makeStyles(() => ({
  header: {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    backgroundColor: "#F2F2F2",
    minHeight: "64px",
    display: "flex",
    position: "relative",
    alignItems: "center",
  },
  heading: {
    padding: "10px 20px 20px 30px",
    fontWeight: "600",
    fontSize: "20px",
  },
  detailHeader: {
    backgroundColor: "#fff",
    marginTop: "7px",
  },
  title: {
    width: "100%",
    display: "flex",
  },
  titleText: {
    width: "100%",
    padding: "0px 15px 0px 30px",
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  highlighter: {
    background: "#263451",
    padding: "5px 16px",
    borderRadius: 16,
    width: "max-content",
    transform: "translateX(5px) translateY(11px)",
    height: "32px",
  },
  highlight: {
    color: "#ffffff",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  menuIcon: {
    background: "transparent",
    align: "center",
    "& svg": {
      fill: "#808080 !important",
    },
  },
  tags: {
    "& fieldset": {
      border: "none",
    },
    width: "74%",
  },
  menu: {
    "& .MuiListItem-gutters": {
      paddingLeft: "10px !important",
      paddingRight: "10px !important",
    },
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "25px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
  },
  metaActions: ({ collapse }) => ({
    marginTop: "2px",
    "& button": {
      backgroundColor: !collapse ? "#eceded" : "#fff",
      color: "grey",
      fontWeight: "bold",
      textTransform: "capitalize",
      padding: "6px 12px",
      "&:hover": {
        backgroundColor: !collapse ? "#eceded" : "#fff",
      },
    },
  }),
  inputFieldDealName: (props) => ({
    width: "542px",
    padding: "0px 30px 20px 30px",
    "& .MuiTextField-root": {
      "& .MuiInputBase-multiline": {
        "& .MuiInputBase-inputMultiline": {
          height: props.name.length > 0 ? getDealNameFieldHeight(props.name) : "auto !important",
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

const CampaignHeader = ({ campaign }) => {
  const [collapse, setCollapse] = useState(true);
  const [anchorEl, setAnchorEl] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { control, watch, reset } = useForm();

  const campaignName = watch("name", "");
  const classes = useStyles({ name: campaignName });

  useEffect(() => {
    reset(campaign);
  }, [campaign, reset]);

  return (
    <>
      <div>
        {/**
         * Detail title section
         */}
        <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
          <div className="flex column alignStart justifyStart w-100">
            <div className={classes.title}>
              <div className={classes.titleText}>
                <div className={classes.userName}>
                  <Controller
                    control={control}
                    name="name"
                    defaultValue={get(campaign, "name")}
                    render={(params) => (
                      <FormControl
                        variant="outlined"
                        className={classes.inputFieldDealName}
                        style={{ marginLeft: "-15px" }}
                        fullWidth
                        size="small"
                      >
                        <TextField
                          {...params}
                          margin="dense"
                          variant="outlined"
                          placeholder="Click to enter deal name"
                          required
                          multiline
                          error={!get(campaign, "name")}
                          helperText={!get(campaign, "name") ? "Enter a deal name to get started" : ""}
                          // onChange={({ target }) => setTitle(target.value)}
                          InputProps={{
                            classes: {
                              root: classes.dealNameRoot,
                              focused: classes.focused,
                              notchedOutline: classes.notchedOutline,
                            },
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                <div className={classes.tagsContainer}>
                  <div className={classes.highlighter}>
                    <Typography className={classes.highlight} variant="highlight">
                      Campaign
                    </Typography>
                  </div>
                  <div className={classes.tags}>
                    <Tags width="100%" targetSourceId={`${get(campaign, "_id")}`} targetLabel="campaign" publicLeftBottom onlyTags />
                  </div>
                  <div className={classes.metaActions}>
                    <Button startIcon={<InfoOutlinedIcon />} onClick={() => setCollapse(!collapse)}>
                      Metadata
                    </Button>
                    <IconButton
                      size="small"
                      component="span"
                      className={classes.menuIcon}
                      onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                      <MoreHorizIcon size="medium" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/**
       * Menu for meta data
       */}
      <Menu
        id="revPropertyMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.menu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem onClick={() => setOpenDeleteDialog(true)}>
          <ListItemIcon>
            <DeleteIcon size="medium" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default CampaignHeader;
