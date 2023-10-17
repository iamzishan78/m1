import React from "react";
import { get } from "lodash";
import moment from "moment";
import { Grid, TextField, Card, CardContent, Typography, Switch, FormControlLabel } from "@material-ui/core";
import { headerStyles } from "./styles";

import UsersListWithIcon from "components/Shared/UsersListWithIcon";
import vf_number from "components/Shared/valueformatters/vf_number";

const CampaignHeader = ({ campaign, updateCampaignInformation }) => {
  const classes = headerStyles();

  return (
    <Grid container display="flex" justifyContent="space-between" alignItems="center">
      <Grid item md={4}>
        <Grid container display="flex" justifyContent="space-between" alignItems="center">
          <Grid item xs="12" md="12">
            <UsersListWithIcon
              label="Supervisor"
              placeholder="Assign Supervisor"
              selectedUserId={get(campaign, "owner._id")}
              onChangeUser={(user) => updateCampaignInformation("owner", user.value)}
            />
          </Grid>
          <Grid item container direction="row" display="flex" justify="space-between" style={{ padding: "15px 0px 10px" }}>
            <label style={{ marginTop: "10px", padding: 0 }}>Created Date</label>
            <Grid item style={{ width: "75%" }}>
              <TextField
                style={{ marginTop: 0 }}
                size="small"
                margin="dense"
                type="date"
                variant="outlined"
                placeholder="from"
                fullWidth
                value={moment(get(campaign, "createdAt")).format("yyyy-MM-DD")}
                onChange={(event) => {
                  updateCampaignInformation("createdAt", event ? String(event.target.value) : null);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  classes: {
                    root: classes.dateRoot,
                    focused: classes.focused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={8}>
        <div className={classes.cardsWrapper}>
          <Card variant="outlined" className={`${classes.card} ${classes.leftCard}`}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
                Status
              </Typography>
              <FormControlLabel
                label={get(campaign, "status", "Open")}
                labelPlacement="start"
                control={
                  <Switch
                    checked={get(campaign, "status", "Open") === "Open"}
                    onChange={({ target }) => updateCampaignInformation("status", target.checked ? "Open" : "Closed")}
                    size="small"
                  />
                }
                className={classes.statusControl}
              />
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
                Units
              </Typography>
              <Typography id="unitCounts" variant="h6" component="div" className={classes.cardNumberTypography}>
                {get(campaign, "unitCount", 0)}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
                Contacts
              </Typography>
              <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
                {get(campaign, "contacts", 0)}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
                Total Unit NRA
              </Typography>
              <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
                {vf_number(Math.round(get(campaign, "totalNra", 0)))}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Grid>
  );
};

export default CampaignHeader;
