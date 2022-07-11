import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import { useLazyQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import Tooltip from "@material-ui/core/Tooltip";
import LinkIcon from "@material-ui/icons/Link";
import {
  Grid,
  Container,
  Box,
  Typography,
  Badge,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
} from "@material-ui/core";
import RightDialog from "../ContactDetailCard/components/RightDialog";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import SearchIcon from "@material-ui/icons/Search";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import {
  LINKED_GLOBAL_OWNERS,
  UNLINK_GLOBAL_OWNER,
  LINK_PLATFORM_OWNER,
} from "../../graphQL/useQueryLinkedGlobalOwners";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import PersonIcon from "@material-ui/icons/Person";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { AppContext } from "AppContext";

export default function LinkWithIcon(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [inputSearchValue, setSearchValue] = useState("");
  const [showAll, setShow] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [isDeleteGlobalOwnerDialog, setGlobalOwnerDialog] = useState({
    state: false,
    globalOwner: "",
  });

  const [getLinkedGlobalOwners, { data }] = useLazyQuery(LINKED_GLOBAL_OWNERS, {
    fetchPolicy: "cache-and-network",
  });
  const [unlinkGlobalOwners] = useMutation(UNLINK_GLOBAL_OWNER);
  const [linkTaxOwners] = useMutation(LINK_PLATFORM_OWNER);
  const [getESSimpleSearch, { data: esSearchData, loadng }] = useLazyQuery(
    GET_ES_SIMPLE_SEARCH,
    { fetchPolicy: "no-cache" }
  );

  useEffect(() => {
    if (props.objectId) {
      getLinkedGlobalOwners({
        variables: {
          contactId: props.objectId,
        },
      });
    }
  }, [props.objectId]);

  useEffect(() => {
    debouncedSearch();
  }, [inputSearchValue, showAll]);

  const useStyles = makeStyles((theme) => ({
    icons: {
      color: "#ffffff",
      marginLeft: "auto",
      backgroundColor: "#f2f2f2",
      "&:hover": {
        backgroundColor:
          props.targetLabel === "deal" ? "#dadbde88 !important" : "#eeeeee",
      },
    },
    iconSelected: {
      color: theme.palette.secondary.main,
      "& svg": {
        fill: `${theme.palette.secondary.main} !important`,
      },
    },
    heading: {
      fontSize: "initial",
      fontWeight: 800,
      marginBottom: "10px",
    },
    badge: {
      "& .MuiBadge-anchorOriginTopRightRectangle": {
        top: "7px",
      },
    },
    dialog: {
      zIndex: "9999999999 !important",
    },
    removeIcon: {
      "& svg": {
        fill: "red !important",
      },
    },
    ownerIdGrid: {
      paddingLeft: "5px !important",
    },
    searchContainer: {
      overflowY: "auto",
      border: "1px solid lightgrey",
      padding: "0.5rem",
    },
  }));

  const classes = useStyles();

  const getGlobalOwners = () => {
    return data && data.linkedGlobalOwners && data.linkedGlobalOwners.data
      ? data.linkedGlobalOwners.data
      : [];
  };

  const debouncedSearch = _.debounce(function(){
    const searchedText = document?.getElementById("searchPlatformOwners")?.value;
    getESSimpleSearch({
      variables: {
        index: "platformData:globalowner",
        pagination: {
          first: showAll ? 200 : 25,
          keep_alive: "1micros",
        },
        search: {
          query: searchedText,
          fields: ["ownerName", "streetAddress", "city", "state", "zip"],
        },
        sort: [],
      },
    });
    setSearchValue(searchedText);
  }, 1500);

  const handleRemoveGlobalOwner = () => {
    unlinkGlobalOwners({
      variables: {
        contactId: props.objectId,
        globalOwner: isDeleteGlobalOwnerDialog.globalOwner,
      },
      refetchQueries: ["getLinkedGlobalOwners"],
      awaitRefetchQueries: true,
    });
  };

  const handleLinkTaxOwners = (taxOwner) => {
    const contact = {};
    const acceptedFields = [
      "name",
      "address1",
      "address2",
      "city",
      "state",
      "zip",
      "country",
      "globalOwner",
      "title",
      "firstName",
      "lastName",
      "middleName",
      "suffix",
    ];

    for (let i in props.contact) {
      if (acceptedFields.includes(i)) {
        contact[i] = props.contact[i];
      }
    }
    contact.globalOwner = taxOwner.globalOwnerId;

    linkTaxOwners({
      variables: {
        contactId: props.objectId,
        contact,
        userId: stateApp.user.mongoId,
      },
      refetchQueries: ["getLinkedGlobalOwners"],
      awaitRefetchQueries: true,
    });
  };

  const isLinked = (taxOwner) => {
    const globalOwners = getGlobalOwners();

    return Boolean(
      globalOwners.find(
        (globalOwner) => globalOwner.globalOwner === taxOwner.globalOwnerId
      )
    );
  };

  return (
    <React.Fragment>
      <Tooltip title={"Linked Global Owner"} placement="top">
        <Badge
          className={classes.badge}
          badgeContent={props.iconZiseSmall ? null : getGlobalOwners().length}
          color="secondary"
        >
          <IconButton
            size={props.iconZiseSmall ? "small" : "medium"}
            color="primary"
            className={`${classes.icons}  ${
              openDialog || getGlobalOwners().length > 0
                ? classes.iconSelected
                : ""
            }`}
            onClick={() => {
              setOpenDialog(true);
            }}
            aria-label="show linked global owner"
          >
            <LinkIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      {openDialog && (
        <RightDialog open={true}>
          <Container maxWidth="sm" className={classes.gridWidthScroll}>
            <div className={classes.dealContainer}>
              <Box pb={3} pt={1}>
                <Grid
                  container
                  direction="row"
                  spacing={4}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography
                      className={classes.topHeading}
                      style={{ fontWeight: "bold" }}
                      variant="h5"
                      component="h2"
                    >
                      Linked Platform Owners
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => setOpenDialog(false)}
                    >
                      <ArrowRightAltIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid xs={12}>
                  <Typography style={{ marginBottom: 5 }}>
                    Search for similarly named platform owners and associate to
                    contact
                  </Typography>
                  <TextField
                    id="searchPlatformOwners"
                    fullWidth
                    variant="outlined"
                    // value={inputSearchValue}
                    onChange={({ target }) => debouncedSearch()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {inputSearchValue && (
                  <Grid
                    container
                    className={classes.searchContainer}
                    style={{
                      maxHeight: showAll ? 500 : 300,
                    }}
                  >
                    <Grid
                      container
                      item
                      xs={12}
                      className={classes.groupsHeaders}
                    >
                      <Grid item xs={6}>
                        <Typography color={"primary"}>
                          PLATFORM OWNERS
                        </Typography>
                      </Grid>
                      {!_.isEmpty(esSearchData?.getESSimpleSearch?.hits) && (
                        <Grid
                          item
                          xs={6}
                          style={{
                            textAlign: "right",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            className={classes.groupsButton}
                            onClick={() => {
                              setShow(!showAll);
                            }}
                          >
                            {showAll ? "See Less" : "See All"}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    {loadng && (
                      <Grid container justifyContent="center">
                        <CircularProgress color="secondary" />
                      </Grid>
                    )}
                    {esSearchData?.getESSimpleSearch?.hits?.map((taxOwner) => (
                      <ListGlobalOwners
                        taxOwner={taxOwner}
                        onClick={() =>
                          isLinked(taxOwner)
                            ? setGlobalOwnerDialog({
                                state: true,
                                globalOwner: taxOwner.globalOwnerId,
                              })
                            : handleLinkTaxOwners(taxOwner)
                        }
                        key={"search_tax_owners" + taxOwner._id}
                        isLinked={isLinked(taxOwner)}
                      />
                    ))}
                    {_.isEmpty(esSearchData?.getESSimpleSearch?.hits) && (
                      <Grid container justifyContent="center">
                        <Typography>No platform owners found.</Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
                {getGlobalOwners().length > 0 ? (
                  <>
                    <Box mt={2}>
                      <Typography>
                        The below platform owners are linked to the selected
                        contact.
                      </Typography>
                    </Box>

                    <Box pt={3}>
                      <Typography style={{ fontWeight: "bold" }}>
                        Platform owners
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box mt={2}>
                    <Typography>
                      No Platform Owner linked to selected contact.
                    </Typography>
                  </Box>
                )}
              </Box>

              <Grid
                container
                justify="center"
                alignItems="center"
                className={classes.heading}
              >
                <Grid item md={3}>
                  Owner ID
                </Grid>
                <Grid item md={9}>
                  Name &amp; Address
                </Grid>
              </Grid>

              {getGlobalOwners().map((row) => (
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  key={row.id}
                >
                  <Grid item md={12}>
                    <Typography style={{ backgroundColor: "#edfbff" }}>
                      <Grid container justify="center" alignItems="center">
                        <Grid item md={3} className={classes.ownerIdGrid}>
                          {row.id}
                        </Grid>
                        <Grid item md={8}>
                          <Grid container>
                            <Grid item md={12}>
                              {row.name}
                            </Grid>
                            <Grid item md={12}>
                              {row.address1} {row.address2} {row.city},{" "}
                              {row.state} {row.zip}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={1}>
                          <IconButton
                            size="medium"
                            className={
                              isDeleteGlobalOwnerDialog.state
                                ? classes.removeIcon
                                : ""
                            }
                          >
                            <RemoveCircleOutlineIcon
                              onClick={() =>
                                setGlobalOwnerDialog({
                                  state: true,
                                  globalOwner: row.globalOwner,
                                })
                              }
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </div>
          </Container>
        </RightDialog>
      )}
      <Dialog
        className={classes.dialog}
        open={isDeleteGlobalOwnerDialog.state}
        onClose={() =>
          setGlobalOwnerDialog((state) => ({ ...state, state: false }))
        }
        fullWidth={false}
        maxWidth="sm"
      >
        <DeleteConfirmationDialogContent
          header="Remove Global Owner"
          onClose={() =>
            setGlobalOwnerDialog((state) => ({ ...state, state: false }))
          }
          deleteFunc={handleRemoveGlobalOwner}
          m1nSelectedRowsIds={null}
          setM1nSelectedRowsIndexes={() => {}}
        >
          Are you sure you want to remove this Global Owner?
        </DeleteConfirmationDialogContent>
      </Dialog>
    </React.Fragment>
  );
}

const ListGlobalOwners = ({ taxOwner, onClick, isLinked }) => {
  return (
    <Grid container spacing={0} style={{ cursor: "pointer" }}>
      <Grid
        container
        item
        xs
        spacing={2}
        alignItems="center"
        style={{ marginBottom: 5 }}
      >
        <Grid item>
          <PersonIcon color={"#757575"} />
        </Grid>
        <Grid item xs>
          <span>{taxOwner.ownerName}</span>
          <Typography variant="body2" color="textSecondary">
            {taxOwner.streetAddress}, {taxOwner.city}, {taxOwner.state},{" "}
            {taxOwner.zip}
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <IconButton
          color={isLinked ? "primary" : "#757575"}
          onClick={onClick}
        >
          {isLinked ? <LinkIcon color="primary" /> : <ControlPointIcon />}
        </IconButton>
      </Grid>
    </Grid>
  );
};
