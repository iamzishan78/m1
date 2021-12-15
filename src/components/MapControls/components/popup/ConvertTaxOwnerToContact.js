import React, { useEffect, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";

import { AppContext } from "AppContext";
import Tags from "components/Shared/Tagger";
import ContactAutoComplete from "components/Shared/ContactAutoComplete";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import AutoCompleteWithAddNew from "components/Shared/AutoCompleteWithAddNew";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "557px",
    padding: "10px 30px",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: "10px 0px",
    "& svg": {
      fill: "#757575 !important",
    },
  },
  fullWidth: {
    width: "100%",
  },
  field: {
    marginTop: 20,
  },
  bold: {
    fontWeight: "bold",
  },
}));

const contactStatusOptions = [
  {
    label: "Unqualified Lead",
    value: "UnqualLead",
  },
  {
    label: "Qualified Lead",
    value: "QualLead",
  },
  {
    label: "Contact",
    value: "Contact",
  },
];

const ConvertTaxOwnerToContact = ({
  getShapeOwnersAndCountAction,
  getContactCampaignAction,
  campaignList,
  shapeOwners,
  shapeCount,
  onClose,
  open,
}) => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { currentFeature, user } = stateApp;
  const [newTagsIds, setNewTagsIds] = useState([]);
  const [searchCampaign, setSearchCampaign] = useState("");
  const [includeFilter, setIncludeFilter] = useState(false);
  const { control, reset, setValue, register, getValues, watch } = useForm();

  const contactStatus = watch("contactStatus", contactStatusOptions[0].value);
  const contactOwner = watch("contactOwner", null);

  useEffect(() => {
    getShapeOwnersAndCountAction({
      currentFeature: currentFeature,
      userId: user.mongoId,
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getContactCampaignAction({
      search: searchCampaign ? `${searchCampaign}*` : "*",
    });
    // eslint-disable-next-line
  }, [searchCampaign]);

  const setTagId = (id) => {
    const ids = JSON.parse(JSON.stringify(newTagsIds));
    ids.push(id);
    setNewTagsIds(ids);
  };

  const onConvert = () => {};

  return (
    <Drawer anchor="right" open={open}>
      <div className={classes.root}>
        <div className={classes.title}>
          <h3>Convert to Contact</h3>
          <div style={{ cursor: "pointer" }}>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className={classes.title}>
          <h3>Tax Roll Owners</h3>
          <div>{shapeCount} selected</div>
        </div>
        <div className={classes.title}>
          <h4>Include map filters</h4>
          <div>
            <Switch
              checked={includeFilter}
              onChange={() => setIncludeFilter(!includeFilter)}
              name="includeFilter"
            />
          </div>
        </div>

        <div className={classes.field}>
          <label className={classes.bold}>Contact Status</label>
          <Controller
            control={control}
            name="contactStatus"
            defaultValue={contactStatusOptions[0].value}
            render={(props) => (
              <Select
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
                value={contactStatus}
                menuPlacement="auto"
                onChange={(e) => {
                  props.onChange(e.value);
                }}
                className={classes.fullWidth}
                isDisabled={stateApp.selectedMeta}
              >
                <MenuItem value="UnqualLead"> Unqualified Lead </MenuItem>
                <MenuItem value="QualLead"> Qualified Lead </MenuItem>
                <MenuItem value="Contact"> Contact </MenuItem>
              </Select>
            )}
          />
        </div>
        <div className={classes.field}>
          <label className={classes.bold}>Owner Name</label>
          <Controller
            control={control}
            name="contactOwner"
            render={(props) => (
              <ContactAutoComplete
                value={contactOwner}
                onChange={(e, user) => {
                  props.onChange(user.value);
                }}
              />
            )}
          />
        </div>
        <div className={classes.field}>
          <label className={classes.bold}>Campaign Name</label>
          <Controller
            control={control}
            name="campaign"
            render={(props) => (
              <AutoCompleteWithAddNew
                value={searchCampaign}
                onSearch={(value) => {
                  setSearchCampaign(value);
                }}
                setValue={(value) => {
                  props.onChange(value);
                }}
                options={campaignList.map((campaign) => ({
                  _id: campaign,
                  name: campaign,
                }))}
              />
            )}
          />
        </div>
        <div className={classes.field}>
          <Tags
            setTagId={setTagId}
            targetLabel="contact"
            targetSourceId="new"
          />
        </div>
        <Box pt={6} mt={6} mb={6} mr={2}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Grid item>
              <Button onClick={onClose}>Cancel</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                style={{ backgroundColor: "#00abed", color: "white" }}
                onClick={onConvert}
              >
                Convert
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Drawer>
  );
};

export default ConvertTaxOwnerToContact;
