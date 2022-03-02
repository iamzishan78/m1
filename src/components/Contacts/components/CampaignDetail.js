import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { Typography, Breadcrumbs } from "@material-ui/core";
import { NavigateNext as NavigateNextIcon } from "@material-ui/icons";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(() => ({
  header: {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    backgroundColor: "#F2F2F2",
    minHeight: "64px",
    display: "flex",
    position: "relative",
    alignItems: "center",
  },
  heading: {
    padding : '10px 20px 20px 30px',
    fontWeight: '600',
    fontSize: '20px'
  }
}));

const CampaignDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const campaignName = location.state.campaignName

  return (
    <div style={{}}>
      <div className={classes.header}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            paddingLeft: "25px",
          }}
        >
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link
              style={{
                marginLeft: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              color="inherit"
              onClick={() => history.push("/contacts/campaignManagement")}
            >
              Campaign
            </Link>

            <Typography style={{ color: "#18AADD", fontSize: "16px", marginLeft: "5px" }}>{campaignName}</Typography>
          </Breadcrumbs>
        </div>
      </div>
      <div className={classes.heading}>{campaignName}</div>
    </div>
  );
};

export default CampaignDetail;
