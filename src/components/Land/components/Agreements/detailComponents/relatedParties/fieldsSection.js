import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useStyles as customStyles } from "../style";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  Button,
  TextField,
  Tooltip,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  Popover,
  List,
  ListItem,
} from "@material-ui/core";
import { DeleteOutline as DeleteIcon, MoreVert as MoreVertIcon } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import ChatIcon from "@material-ui/icons/Chat";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

import Comments from "components/Shared/Comments";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import ContactPaginatedAutocomplete from "components/Revenue/components/Common/ContactsPaginatedAutocomplete";

import { UPSERT_RELATED_PARTY } from "graphQL/useMutationRelatedParty";

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

export default function FieldsSection({ relatedParties, agreementId }) {
  const customClasses = customStyles();
  const classes = useStyles();
  const { control, reset } = useForm();

  const [openCommentsDialog, setCommentsDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [hoverParty, setHoverParty] = useState(-1);

  useEffect(() => {
    reset({
      parties: relatedParties,
    });
  }, [relatedParties]);

  const [upsertRelatedParty] = useMutation(UPSERT_RELATED_PARTY);
  const name = "parties";
  const arrayField = useFieldArray({
    control,
    name,
  });
  let { fields, append } = arrayField;

  const addNewParty = () => {
    append({});
  };

  const handleUpdateParty = (params, index) => {
    upsertRelatedParty({
      variables: {
        relatedParty: { ...relatedParties[index], ...params, name: `Party ${index + 1}` },
        customLayerId: agreementId,
      },
      refetchQueries: ["getRelatedParties"],
      awaitRefetchQueries: true,
    });
  };

  return (
    <>
      <Grid container display="flex" direction="row">
        <Grid item xs={12} display="flex" style={{ margin: "20px 0px 35px" }}>
          {fields.map((item, index) => (
            <Grid item xs={12} onMouseEnter={() => setHoverParty(index)} onMouseLeave={() => setHoverParty(-1)}>
              <Grid container className={customClasses.gridStyle} justify="space-between">
                <Grid item xs={1} style={{ display: "flex" }}>
                  <div className={customClasses.fieldLabel}>Party {index + 1}</div>
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    control={control}
                    name={`${name}.${index}.type`}
                    render={(params) => {
                      return (
                        <AutoComplete
                          {...params}
                          value={item.type}
                          onChange={(value) => handleUpdateParty({ type: value }, index)}
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
                    name={`${name}.${index}.descriptorObject.entityDetail`}
                    render={(params) => (
                      <ContactPaginatedAutocomplete
                        nameAutValue={item.descriptorObject?.entityDetail ?? { _id: "", name: "" }}
                        className={customClasses.field}
                        setNameAutValue={(value) => {
                          handleUpdateParty({ descriptorObject: value?._id }, index);
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
                                    <ContactCardIcon fill={!item.descriptorObject?._id ? "darkgrey" : undefined} />
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
                    <Badge badgeContent={item.comments ?? 0} color="secondary">
                      <IconButton
                        id={`add-comments-button-${index}`}
                        size={"medium"}
                        color="primary"
                        className={`${classes.icons} ${classes.noCommentsIcon} ${classes.iconSelected}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentsDialog({ state: true, targetSourceId: item.descriptorObject?._id });
                        }}
                        aria-label="show comments"
                      >
                        <ChatIcon />
                      </IconButton>
                    </Badge>
                  </Tooltip>
                </Grid>
                <Grid item xs={1}>
                  {hoverParty === index ? (
                    <PopupState variant="popover" popupId={`party-${index}-popover`}>
                      {(popupState) => (
                        <>
                          <IconButton
                            aria-controls={`party${index}Menu`}
                            aria-haspopup="true"
                            className={classes.menuIcon}
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                            {...bindTrigger(popupState)}
                          >
                            <MoreVertIcon size="medium" />
                          </IconButton>
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                          >
                            <List className={classes.menu}>
                              <ListItem
                                button
                                onClick={() => {
                                  handleUpdateParty({ _id: item?._id, isDeleted: true });
                                  popupState.close();
                                }}
                              >
                                <ListItemIcon>
                                  <DeleteIcon size="medium" />
                                </ListItemIcon>
                                <ListItemText>Delete Agreement</ListItemText>
                              </ListItem>
                            </List>
                          </Popover>
                        </>
                      )}
                    </PopupState>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" className={customClasses.addDataButton} startIcon={<AddIcon />} onClick={addNewParty}>
            Add Custom Data
          </Button>
        </Grid>
      </Grid>
      {openCommentsDialog?.state && (
        <Dialog open={openCommentsDialog.state ? true : false} onClose={() => setCommentsDialog(null)} fullWidth={false} maxWidth>
          {openCommentsDialog && (
            <Comments
              focus
              targetSourceId={openCommentsDialog.targetSourceId}
              targetLabel="contact"
              refetchQueries={["getRelatedParties"]}
            />
          )}
        </Dialog>
      )}
    </>
  );
}
