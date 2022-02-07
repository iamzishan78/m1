import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useStyles as customStyles } from "../style";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button, TextField, Tooltip, Badge, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Dialog } from "@material-ui/core";
import { DeleteOutline as DeleteIcon, MoreVert as MoreVertIcon } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import ChatIcon from "@material-ui/icons/Chat";

import Comments from "components/Shared/Comments";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import ContactPaginatedAutocomplete from "components/Revenue/components/Common/ContactsPaginatedAutocomplete";

const useStyles = makeStyles((theme) => ({
  icons: {
    backgroundColor: (props) => (props.dense ? "transparent" : "#efefef"),
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "#dadbde !important",
    },
  },
  colorIcon: {
    backgroundColor: (props) => (props.dense ? "transparent" : "#efefef"),
    marginLeft: "auto",
    color: `${theme.palette.secondary.main} !important`,
    "&:hover": {
      backgroundColor: "#dadbde !important",
    },
  },
  iconSelected: {
    // backgroundColor: `${theme.palette.secondary.main} !important`,
    color: "#011133 !important",
    "& p": {
      color: "#011133 !important",
    },
  },
  noCommentsIcon: {
    color: "darkgrey",
  },
  menuIcon: {
    background: "transparent",
    align: "center",
    "& svg": {
      fill: "#808080 !important",
    },
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
}));

export default function FieldsSection({ setPartiesNumber }) {
  const customClasses = customStyles();
  const classes = useStyles();
  const { control } = useForm();

  const [parties, setParties] = useState([{}]);
  const [openCommentsDialog, setCommentsDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [hoverParty, setHoverParty] = useState(-1);

  const addNewParty = () => {
    setPartiesNumber(parties.length + 1);
    setParties([...parties, {}]);
  };

  return (
    <>
      <Grid container display="flex" direction="row">
        {parties.map((party, index) => (
          <Grid item xs={12} onMouseEnter={() => setHoverParty(index)} onMouseLeave={() => setHoverParty(-1)}>
            <Grid container className={customClasses.gridStyle} justify="space-between">
              <Grid item xs={1} style={{ display: "flex" }}>
                <div className={customClasses.fieldLabel}>Party {index + 1}</div>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name={`parties[${index}].type`}
                  render={(params) => {
                    return (
                      <AutoComplete
                        {...params}
                        options={["Attorney", "Broker", "Lessor Contact", "Surface Landowner"]}
                        fullWidth
                        renderInput={(params1) => (
                          <TextField
                            margin="dense"
                            {...params1}
                            variant="outlined"
                            InputLabelProps={{
                              ...params.InputLabelProps,
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={5} style={{ paddingLeft: "20px" }}>
                <Controller
                  control={control}
                  name="owner"
                  render={(params) => (
                    <ContactPaginatedAutocomplete
                      nameAutValue={params.value ? params.value : { _id: "", name: "" }}
                      className={customClasses.field}
                      setNameAutValue={(value) => {
                        // contactEntity(value?._id, "owner");
                      }}
                      renderInput={(params2) => (
                        <TextField
                          {...params2}
                          margin="dense"
                          variant="outlined"
                          InputLabelProps={{
                            ...params2.InputLabelProps,
                            shrink: true,
                          }}
                          InputProps={{
                            ...params2.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {params2.InputProps.endAdornment}
                                <div className={customClasses.contactCardIcon}>
                                  {/* <ContactCardIcon fill={!propertyDetails?.owner?._id ? "darkgrey" : undefined} /> */}
                                  <ContactCardIcon fill={undefined} />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1} style={{ textAlign: "right" }}>
                <Tooltip title={"Add Comments"} placement="top" style={{ marginRight: "10px" }}>
                  <Badge badgeContent={1} color="secondary">
                    <IconButton
                      id={`add-comments-button-${index}`}
                      size={"medium"}
                      color="primary"
                      className={`${classes.icons} ${classes.noCommentsIcon} ${classes.iconSelected}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCommentsDialog({ state: true, party });
                        //   handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, targetSourceId, "comment");
                      }}
                      aria-label="show comments"
                      // onMouseOver={() => {
                      //   if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
                      //     multiSelectMouseHoverColor(id, "#dadbde");
                      // }}
                      // onMouseOut={() => {
                      //   if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
                      //     multiSelectMouseHoverColor(id, "#efefef");
                      // }}
                    >
                      <ChatIcon />
                    </IconButton>
                  </Badge>
                </Tooltip>
              </Grid>
              <Grid item xs={1}>
                {hoverParty === index ? (
                  <IconButton
                    size="small"
                    component="span"
                    className={classes.menuIcon}
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                  >
                    <MoreVertIcon size="medium" />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Grid>
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
                <MenuItem>
                  <ListItemIcon>
                    <DeleteIcon size="medium" />
                  </ListItemIcon>
                  <ListItemText>Delete Agreement</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        ))}
        <Grid item>
          <Button variant="contained" color="primary" className={customClasses.addDataButton} startIcon={<AddIcon />} onClick={addNewParty}>
            Add Custom Data
          </Button>
        </Grid>
      </Grid>
      {openCommentsDialog?.state && (
        <Dialog open={openCommentsDialog.state ? true : false} onClose={() => setCommentsDialog(null)} fullWidth={false} maxWidth>
          {openCommentsDialog && <Comments focus targetSourceId={openCommentsDialog.party?._id} targetLabel="Agreement Party" />}
        </Dialog>
      )}
    </>
  );
}
