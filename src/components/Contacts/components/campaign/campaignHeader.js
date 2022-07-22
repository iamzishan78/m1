import React from "react";
import moment from "moment";
import { Grid, TextField } from "@material-ui/core";
import { headerStyles } from "./styles";

import UsersListWithIcon from "components/Shared/UsersListWithIcon";

const CampaignHeader = ({ campaign, updateCampaignInformation }) => {
  const classes = headerStyles();

  return (
    <Grid display="flex" justifyContent="space-between" alignItems="center">
      <Grid item xs="4" md="4">
        <UsersListWithIcon
          label="Supervisor"
          placeholder="Assign Supervisor"
          selectedUserId={campaign.owner?._id}
          onChangeUser={(user) => updateCampaignInformation("owner", user.value)}
        />
      </Grid>
      <Grid container direction="row" display="flex" justify="flex-start" style={{ padding: "15px 0px 10px" }}>
        <label style={{ marginTop: "10px", padding: 0 }}>Created Date</label>
        <Grid item>
          <TextField
            style={{ marginTop: 0 }}
            size="small"
            margin="dense"
            type="date"
            variant="outlined"
            placeholder="from"
            fullWidth
            value={moment(campaign.createdAt).format("yyyy-MM-DD")}
            onChange={({ target }) => updateCampaignInformation("createdAt", target.value)}
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
      <Grid item xs="6" md="5"></Grid>
    </Grid>
  );
};

export default CampaignHeader;
