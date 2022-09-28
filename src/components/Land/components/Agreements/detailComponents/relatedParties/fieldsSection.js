import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
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
  ListItemIcon,
  ListItemText,
  Dialog,
  Popover,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { DeleteOutline as DeleteIcon, MoreVert as MoreVertIcon } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import ChatIcon from "@material-ui/icons/Chat";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { copy } from "utils/helper";

import Comments from "components/Shared/Comments";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import ContactPaginatedAutocomplete from "components/Revenue/components/Common/ContactsPaginatedAutocomplete";

import { UPSERT_RELATED_PARTY } from "graphQL/useMutationRelatedParty";

const useStyles = makeStyles((theme) => ({
  icons: {
    backgroundColor: "transparent",
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "#dadbde !important",
    },
  },
  iconSelected: {
    backgroundColor: "#17aadd !important",
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

export default function FieldsSection({ relatedParties, agreementId, agreementName, agreementNumber, partiesLoading }) {
  const customClasses = customStyles();
  const classes = useStyles();
  const history = useHistory();

  const [partyTypes, setPartyTypes] = useState(["Attorney", "Broker", "Lessor Contact", "Spouse", "Surface Landowner"]);
  const [openCommentsDialog, setCommentsDialog] = useState(false);
  const [, setAnchorEl] = useState();
  const [hoverParty, setHoverParty] = useState(-1);

  const [upsertRelatedParty] = useMutation(UPSERT_RELATED_PARTY);

  const [fields, setFields] = useState([]);

  const addNewParty = () => {
    setFields([...fields, { id: uuid() }]);
  };
  const removeParty = (index) => {
    const _fields = copy(fields);
    _fields.splice(index, 1);
    setFields(_fields);
  };

  useEffect(() => {
    if (partiesLoading === false) {
      let parties = fields;
      const relatedPartiesIds = relatedParties.map((party) => party.id);
      relatedParties.forEach((party) => {
        if (party.id) {
          const index = fields.findIndex((f) => f.id === party.id);
          if (index !== -1) {
            parties[index] = party;
          } else parties.push(party);
        }
      });
      parties = parties.filter((p) => (relatedPartiesIds.includes(p.id) || p.id) && p.isDeleted !== true);
      if (relatedParties.length === 0 && parties.length === 0) parties.push({ id: uuid() });
      setFields(parties);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatedParties]);

  useEffect(() => {
    if (relatedParties.length > 0) {
      const types = copy(partyTypes);
      relatedParties.forEach((party) => {
        if (party.type && !types.includes(party.type)) types.push(party.type);
      });
      if (types.length !== partyTypes.length) setPartyTypes(types);
    }
  }, [relatedParties]);

  const handleUpdateParty = (params, index) => {
    const party = { ...fields[index], ...params };
    const _fields = fields;
    _fields[index] = party;
    setFields(_fields);
    upsertRelatedParty({
      variables: {
        relatedParty: party,
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
              <Grid container className={customClasses.gridStyle}>
                <Grid item xs={1} style={{ display: "flex" }}>
                  <div className={customClasses.fieldLabel}>Party {index + 1}</div>
                </Grid>
                <Grid item xs={4}>
                  <AutoComplete
                    defaultValue={item.type ?? ""}
                    value={item.type ?? ""}
                    options={partyTypes}
                    getOptionSelected={(option, value) => {
                      return option === value;
                    }}
                    onChange={(value) => {
                      if (!value || typeof value === "string") {
                        handleUpdateParty({ type: value }, index);
                      } else {
                        setPartyTypes([...partyTypes, value.value]);
                        handleUpdateParty({ type: value.value }, index);
                      }
                    }}
                    renderOption={(option) => {
                      if (option.id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.value}'</Typography>;

                      return (
                        <Grid container spacing={0}>
                          <Grid container item xs={12} alignItems="center">
                            <Grid item xs>
                              <Typography variant="body2" color="textSecondary">
                                {option}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    }}
                    renderInput={(params1) => (
                      <TextField
                        margin="dense"
                        {...params1}
                        variant="outlined"
                        InputLabelProps={{
                          ...params1.InputLabelProps,
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5} style={{ paddingLeft: "20px" }}>
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
                              <div
                                className={customClasses.contactCardIcon}
                                onClick={(e) => {
                                  if (item.descriptorObject?._id) {
                                    history.replace(`/contact/details/${item.descriptorObject?._id}`, {
                                      showAgreementBreadcrumb: true,
                                      agreementBreadcrumbsParams: {
                                        Agreements: "/land/agreements",
                                        [`${agreementNumber} - ${agreementName}`]: `/land/agreement/details/${agreementId}`,
                                      },
                                    });
                                    e.stopPropagation();
                                  }
                                }}
                              >
                                <ContactCardIcon fill={!item.descriptorObject?._id ? "darkgrey" : undefined} />
                              </div>
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={1} style={{ textAlign: "left", paddingLeft: 10}}>
                  <Tooltip title={item?.comments !== 0 ? "Comments" : "Add Comments"} placement="top" style={{ marginRight: "10px" }}>
                    <Badge badgeContent={item?.comments ?? null} color="secondary">
                      <IconButton
                        id={`${index}-comments`}
                        size={"small"}
                        color="primary"
                        className={`${classes.icons} ${!item?.comments || item?.comments === 0 ? classes.noCommentsIcon : ""} ${
                          openCommentsDialog?.targetSourceId && openCommentsDialog?.targetSourceId === item.descriptorObject?._id
                            ? classes.iconSelected
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentsDialog({ state: true, targetSourceId: item.descriptorObject?._id });
                        }}
                        aria-label="show comments"
                        disabled={!item.descriptorObject?._id}
                      >
                        <ChatIcon />
                      </IconButton>
                    </Badge>
                  </Tooltip>
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
                                  if (item._id) {
                                    handleUpdateParty({ _id: item?._id, isDeleted: true }, index);
                                  } else {
                                    removeParty(index);
                                  }
                                  popupState.close();
                                }}
                              >
                                <ListItemIcon>
                                  <DeleteIcon size="medium" />
                                </ListItemIcon>
                                <ListItemText>Delete Related Party</ListItemText>
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
            Add Another Party
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
