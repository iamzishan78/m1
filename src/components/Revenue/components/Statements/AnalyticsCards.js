import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography, IconButton } from "@material-ui/core";
import FilterIcon from "components/Common/SvgIcons/Filter";

const useStyles = makeStyles(() => ({
  card: { borderRadius: "8px" },
  cardHeaderTypography: {
    fontWeight: "bolder",
    marginBottom: "25px",
  },
  cardNumberTypography: {
    fontWeight: 900,
    fontSize: "xx-large",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "160px",
    textAlign: "left",
  },
  issuesBadges: {
    display: "flex",
    alignItems: "center",
    color: "#ff0000",
    height: "20px",
  },
  tooltip: {
    position: "absolute",
    top: 72,
    color: "rgb(255, 0, 0)",
    width: 200,
    left: -148,
  },
  filterIcon: {
    color: 'grey',
    cursor: 'pointer',
    height: '100%',
    width: '100%',
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: "120%",
    textAlign: "left"
  },
  filterButton: {
    padding: 5,
    "& .MuiIconButton-label": {
      height: 24,
      width: 24
    },
    "& svg": {
      flex: 1,
    },
    "& .filter-alt": {
      display: "none"
    },
    "&.active .filter-alt": {
      display: 'block'
    },
    "&.active .filter-outlined": {
      display: 'none'
    },
    "&:hover .filter-alt": {
      display: 'inline-block'
    },
    "&:hover .filter-outlined": {
      display: 'none'
    },
  }
}));

const Filter = ({ status, onClick }) => {
  const classes = useStyles();

  return <IconButton
    className={[classes.filterButton, "filterButton", status && "active" || ""]}
    onClick={onClick}
  >
    <FilterIcon className={"filter-alt"} />
    <FilterIcon variant="outlined" className="filter-outlined" />
  </IconButton>
}


export default function AnalyticsCards(props) {
  const classes = useStyles();
  const [filtersState, setFiltersState] = useState({ approved: false, unapproved: false, potentialIssues: false });

  const handleFilterActions = (type) => {
    let filter = ' '
    if (type === 'approved')
      filter = { field: "approvalStatus.keyword", value: 'Approved' }
    if (type === 'unapproved')
      filter = { field: "approvalStatus.keyword", value: 'Unapproved' }
    if (type === 'potentialIssues')
      filter = { field: "isAmountValidated", value: 'false', type: 'term' }

    let revert = {}
    if (type !== 'potentialIssues')
      revert = { [type === 'approved' ? 'unapproved' : 'approved']: false }
    props.setAnalyticFilters(filter, !filtersState[type]); setFiltersState({ ...filtersState, ...revert, [type]: !filtersState[type] })
  }

  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Statements
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props.checks}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Approved
              <Filter status={filtersState['approved']} onClick={() => { handleFilterActions('approved') }} />
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props.approvedCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Needs Approval
              <Filter status={filtersState['unapproved']} onClick={() => { handleFilterActions('unapproved') }} />
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: "#b9b908" }}>
              {props.unapprovedCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3} style={{ position: "relative" }}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent} >
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Potential Issues
              <Filter status={filtersState['potentialIssues']} onClick={() => { handleFilterActions('potentialIssues') }} />
            </Typography>
            {/* hiding until we have more warning types/rules --kc 02/06/2022 */}
            {/* <div className={classes.issuesBadges}>
              <div style={{ marginRight: 6 }}>
                <WarningIcon />
              </div>
              <div>{props.potentialIssues.length}</div>
            </div> */}
            <Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: "red" }}>
              {props.potentialIssuesCount}
            </Typography>
          </CardContent>

        </Card>
      </Grid>
    </Grid>
  );
}
