import React, { useState, useEffect, useContext } from "react";
import { get } from "lodash";
import { useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import { Typography, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, FormControl, TextField } from "@material-ui/core";
import { InfoOutlined as InfoOutlinedIcon, MoreHoriz as MoreHorizIcon, Delete as DeleteIcon } from "@material-ui/icons";

// Components
import { AppContext } from "AppContext";
import MetadataDrawer from "components/Revenue/components/Common/MetadataDrawer";

// Queries & Mutations
import { UPDATE_CAMPAIGN } from "graphQL/useMutationCampaign";

const useStyles = makeStyles(() => ({}));

const CampaignInfo = ({ campaign, updateCampaignInformation }) => {
  // const classes = useStyles();
  // const [stateApp] = useContext(AppContext);

  return <></>;
};

export default CampaignInfo;
