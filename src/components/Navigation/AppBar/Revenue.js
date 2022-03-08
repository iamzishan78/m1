import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Grid, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useMutation } from "@apollo/client";

import RevenueSearch from "components/Navigation/components/RevenueSearch";
import { SIDE_PANEL_MENU_ITEMS_LIST } from "components/Revenue/Revenue";
import { ADD_PROPERTY } from "graphQL/useMutationAddProperty";
import { ADD_CHECK_DATA } from "graphQL/useMutationAddCheck";
import ButtonDropDown from "components/Shared/M1nTable/components/ButtonGroup";

export default function RevenueAppBar(props) {
  const { classes } = props;
  let history = useHistory();
  const { activeModule, actionsPanelState } = useSelector((state) => state.Revenue);

  const [addProperty] = useMutation(ADD_PROPERTY, {
    onCompleted: (data) => {
      if (data?.addProperty?.property)
        history.push(`/revenue/property/details/${data.addProperty.property._id}`)
    }
  });

  const [addCheck] = useMutation(ADD_CHECK_DATA, {
    onCompleted: (data) => {
      if (data?.addCheck?.newCheck)
        history.push(`/revenue/statement/details/${data.addCheck.newCheck._id}`);

    }
  });

  const RevenueStatementAction = React.useMemo(() => {
    return [{
      isShow: false, text: `Add Statement`, action: () => {
        addCheck({ variables: { check: { source: 'Manual Entry' } } })
      }
    },
    { isShow: true, text: 'Import Statement', action: () => { 
      history.push("/bulkupload");
    } },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule]);

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      alignItems="center"
      style={{ marginLeft: actionsPanelState ? "433px" : "7px" }}
    >
      <Grid item md={8}>
        <Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
          <Grid item md={2.5}>
            <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
              {activeModule.title}
            </Typography>
          </Grid>
          {(
            activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.REVENUE_STATEMENTS.title ||
            activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.PROPERTIES.title
          ) && (
              <Grid item md={5} style={{ marginLeft: "20px" }}>
                <RevenueSearch activeModule={activeModule} />
              </Grid>
            )}
        </Grid>
      </Grid>
      {(activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.REVENUE_STATEMENTS.title) && (
        <Grid item>
          <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>

            <ButtonDropDown variant="contained" color="primary" options={RevenueStatementAction} />
          </div>
        </Grid>
      )}
      {(activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.PROPERTIES.title) && (
        <Grid item>
          <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>
            <Button color="primary" variant="contained" startIcon={<Add />} onClick={() => {
              addProperty({
                variables: {
                  property: {
                    source: 'Manual Entry',
                    status: 'Unapproved'
                  }
                }
              })
            }}
            >
              Add New Property
            </Button>
          </div>
        </Grid>
      )}
    </Grid>
  );
}
