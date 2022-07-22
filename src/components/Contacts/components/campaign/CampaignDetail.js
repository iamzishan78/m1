import React, { useState, useEffect, useMemo, useRef } from "react";
import { debounce, get } from "lodash";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import {
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  TextField,
  Tabs,
  Tab,
} from "@material-ui/core";
import { InfoOutlined as InfoOutlinedIcon, MoreHoriz as MoreHorizIcon, Delete as DeleteIcon } from "@material-ui/icons";

// Components
import NavHeader from "components/Land/components/Common/NavHeader";
import CampaignHeader from "components/Contacts/components/campaign/CampaignHeader";
import Tags from "components/Shared/Tagger";
import MetadataDrawer from "components/Revenue/components/Common/MetadataDrawer";

// Queries & Mutations
import { UPDATE_CAMPAIGN } from "graphQL/useMutationCampaign";

import { GET_CAMPAIGN } from "graphQL/useQueryCampaign";
import { useStyles } from "./styles";

const StyledTabs = withStyles({
  root: {
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "5px",
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "uppercase",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "black",
      opacity: 1,
    },
    "&$selected": {
      color: "black",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "black",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const [metaCollapse, setMetaCollapse] = useState(true);
  const [anchorEl, setAnchorEl] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isButtonScroll, setButtonScroll] = useState(false);
  const [tab, setTab] = useState(0);
  const selectedTabRef = useRef(null);

  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN);

  const { control, watch, reset } = useForm();

  const campaignName = watch("name", "");
  const classes = useStyles({ name: campaignName, metaCollapse });

  const [getCampaign, { data: campaignData }] = useLazyQuery(GET_CAMPAIGN);

  const campaign = useMemo(() => get(campaignData, "getCampaign", {}), [campaignData]);

  useEffect(() => {
    if (campaignId)
      getCampaign({
        variables: {
          campaignId,
        },
      });
  }, [campaignId, getCampaign]);

  useEffect(() => {
    reset(campaign);
  }, [campaign, reset]);

  useEffect(() => {
    if (selectedTabRef?.current && isButtonScroll) {
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [tab, isButtonScroll]);

  const updateCampaignInformation = (key, value) => {
    updateCampaign({
      variables: {
        campaign: {
          _id: campaign._id,
          [key]: value,
        },
      },
      refetchQueries: ["getCampaign"],
      awaitRefetchQueries: true,
    });
  };

  const getRelativePosition = (childDivId) => {
    const parentPos = document.getElementById("parent-div").getBoundingClientRect();
    const childPos = document.getElementById(childDivId).getBoundingClientRect();
    const relativePos = {};

    relativePos.top = childPos.top - parentPos.top;
    relativePos.right = childPos.right - parentPos.right;
    relativePos.bottom = childPos.bottom - parentPos.bottom;
    relativePos.left = childPos.left - parentPos.left;
    return relativePos.top;
  };

  const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);

  const handleScroll = (e) => {
    if (!isButtonScroll) {
      let activeTab = 0;
      if (getRelativePosition("header-div") < 5) activeTab = 0;
      if (getRelativePosition("detail-div") < 30) activeTab = 1;

      if (tab !== activeTab) setTab(activeTab);
    }
    handleEndScroll();
  };

  return (
    <NavHeader title={`${get(campaignData, "getCampaign.name")}`}>
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
                        onBlur={({ target }) => updateCampaignInformation("name", target.value)}
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
              </div>
            </div>
          </div>

          <div className={classes.actionsContainer}>
            <div className={classes.tabsHeader}>
              <StyledTabs
                value={tab}
                onChange={(event, tab) => {
                  setButtonScroll(true);
                  setTab(tab);
                }}
                aria-label="ant example"
              >
                <StyledTab label="Header" />
                <StyledTab label="Campaign Details" />
              </StyledTabs>
            </div>
            <div className={classes.metaActions}>
              <Button startIcon={<InfoOutlinedIcon />} className={classes.metaButton} onClick={() => setMetaCollapse(!metaCollapse)}>
                Metadata
              </Button>
              <IconButton size="small" component="span" className={classes.menuIcon} onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MoreHorizIcon size="medium" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justifyBetween alignStart w-100">
        <div className={classes.tabsDetailContainer}>
          {/**
           * Detail tabs section
           */}

          <div
            className={classes.tabsSection}
            // style={{ display: stateApp.viewDoc ? "none" : "" }}
          >
            <div id="parent-div" className={classes.tabsSectionDetails} onScroll={handleScroll}>
              <div id="header-div" className={classes.tabDetailSection} ref={tab === 0 ? selectedTabRef : null}>
                <CampaignHeader campaign={campaign} updateCampaignInformation={updateCampaignInformation} />
              </div>
            </div>
          </div>

          {/*** Component for viewing selected pdf file*/}
          {/* {stateApp.viewDoc && (
            <DocViewer
              divCondition={true}
              DocStyle={{ height: "calc(100vh - 280px)" }}
            />
          )} */}
        </div>

        {!metaCollapse && (
          <div
            style={{
              marginTop: 20,
              marginRight: 24,
              height: "calc(100vh - 270px)",
              width: 620,
            }}
          >
            <MetadataDrawer
              setCollapse={setMetaCollapse}
              targetSourceId={campaign._id}
              data={campaign}
              targetLabel="Campaign"
              descriptionKey="description"
              onUpdate={(data) => updateCampaignInformation("description", data.description)}
            />
          </div>
        )}
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
    </NavHeader>
  );
};

export default CampaignDetail;
