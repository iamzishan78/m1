import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useMutation } from "@apollo/client";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Tabs, Tab, RadioGroup, Radio, FormControlLabel, TextField } from "@material-ui/core";

import { UPSERT_WORKSPACE_SETTINGS } from "graphQL/useMutationWorksapceSettings";

import Filters from "./Filters";
import { workspaceTenantName } from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  contenContainer: {
    padding: "40px",
    "& span": {
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  actionsContainer: {
    padding: "0px 35px",
  },
  options: {
    marginTop: "20px",
    "& .MuiFormControl-marginDense": {
      marginTop: "0px !important",
    },
  },
}));

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

export default function RevenueStatements() {
  const classes = useStyles();

  const [tab, setTab] = useState(0);
  const [settings, setSettings] = useState();
  const [addOrUpdateWorkspaceSettings] = useMutation(UPSERT_WORKSPACE_SETTINGS);

  const { user, workspaceSettings } = useSelector(({ app }) => app);

  useEffect(() => {
    if (workspaceSettings) {
      setSettings(workspaceSettings.settings);
    }
  }, [workspaceSettings]);

  const onChangeType = (type, value = settings?.map?.unitNra?.value) => {
    addOrUpdateWorkspaceSettings({
      variables: {
        workspaceSettings: {
          name: workspaceTenantName(),
          modifier: user._id,
          settings: { map: { unitNra: { type, value } } },
        },
      },
      refetchQueries: ["getWorkspaceSettings"],
      awaitRefetchQueries: true,
    });
  };

  return (
    <div
      style={{
        marginTop: "65px",
      }}
    >
      <div className={classes.actionsContainer}>
        <div className={classes.tabsHeader}>
          <StyledTabs value={tab} onChange={(event, tab) => setTab(tab)} aria-label="ant example">
            <StyledTab id="settings" label="Settings" />
            {/* <StyledTab id="validations" label="Validations" disabled /> */}
          </StyledTabs>
        </div>
      </div>
      <Filters />

      <div className={classes.contenContainer}>
        <span>Select the method by which Net Royalty Acres (NRA) should be calculated for unit owners:</span>

        <div className={classes.options}>
          <RadioGroup column value={settings?.map?.unitNra?.type ?? "standard"} onChange={(event) => onChangeType(event.target.value)}>
            <FormControlLabel value="standard" control={<Radio />} label="Standard Calculation = Unit Acres * (Sum of Decimal Interests)" />
            <div>
              <FormControlLabel value="custom" control={<Radio />} label="Custom Calculation = Unit Acres * (Sum of Decimal Interests) / " />
              <TextField
                variant="outlined"
                margin="dense"
                disabled={settings?.map?.unitNra?.type !== "custom"}
                onBlur={(event) => onChangeType("custom", event.target.value)}
                value={settings?.map?.unitNra?.value}
                onChange={(event) => {
                  const _settings = {
                    ...settings,
                    map: {
                      ...settings.map,
                      unitNra: {
                        ...settings.map.unitNra,
                        value: event.target.value,
                      },
                    },
                  };
                  setSettings(_settings);
                }}
              />
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
