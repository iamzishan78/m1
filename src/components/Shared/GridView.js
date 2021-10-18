import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@material-ui/core";
import moment from "moment";
import SearchIcon from "@material-ui/icons/Search";
import { useLazyQuery, useMutation } from "@apollo/client";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { AppContext } from "../../AppContext";

import LeftDialog from "components/Shared/LeftDialog";
import { ADD_GRID_VIEW } from "graphQL/useMutationAddGridView";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
  details: {
    display: "block",
    "& div": {
      padding: "5px !important",
    },
  },
  searchField: {
    margin: "0 !important",
    padding: "10px !important",
  },
  summary: {
    backgroundColor: "#F2F2F2",
    height: "40px !important",
    minHeight: "40px !important",
  },
}));

function GridView({ selectedGridView, setSelectedGridView, setShowViewModal }) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const [allGridViews, setAllGridViews] = useState([]);
  const [addGridView, { data }] = useMutation(ADD_GRID_VIEW);
  const [getGridViews, { data: gridViews }] = useLazyQuery(GET_GRID_VIEWS);

  useEffect(() => {
    getGridViews();
  }, [getGridViews]);

  useEffect(() => {
    if (gridViews?.getGridViews?.gridViews) {
      setAllGridViews(gridViews.getGridViews.gridViews);
    }
  }, [gridViews]);

  return (
    <LeftDialog open width="325px">
      {/* <Button
        onClick={() => {
          addGridView({
            variables: {
              gridView: {
                name: "Recently Added",
                module: "Contacts",
                type: "Default",
                filters: [
                  {
                    field: "createAt",
                    value: {
                      range: {
                        createAt: {
                          gte: "",
                          lte: "",
                        },
                      },
                    },
                  },
                ],
              },
            },
          });
        }}
      >
        add
      </Button> */}
      <TextField
        value={""}
        onChange={(e) => {}}
        className={classes.searchField}
        margin="dense"
        variant="outlined"
        placeholder="Search views"
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <IconButton size="small">
                <SearchIcon htmlColor="#fff" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Accordion defaultExpanded style={{ margin: 0 }}>
        <AccordionSummary
          expandIcon={<KeyboardArrowUpIcon></KeyboardArrowUpIcon>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.summary}
        >
          Default
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedGridView({ name: 'All Contacts' });
              setShowViewModal(false);
            }}
          >
            All Contacts
          </div>
          {allGridViews.map((view) => {
            return view.type === "Default" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(view));
                  if (data.name === "My Contacts") {
                    data.filters[0].value = stateApp.user.name;
                  }
                  if (
                    data.name === "Recently Modified" ||
                    data.name === "Recently Added"
                  ) {
                    data.filters[0].value.range[data.filters[0].field].gte =
                      moment().subtract(30, "days").toISOString();
                    data.filters[0].value.range[data.filters[0].field].lte =
                      moment().toISOString();
                  }
                  setSelectedGridView(data);
                  setShowViewModal(false);
                }}
              >
                {view.name}
              </div>
            ) : (
              <></>
            );
          })}
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded style={{ margin: 0 }}>
        <AccordionSummary
          expandIcon={<KeyboardArrowUpIcon></KeyboardArrowUpIcon>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.summary}
        >
          Custom
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          {allGridViews.map((view) => {
            return view.type === "Custom" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedGridView(view);
                  setShowViewModal(false);
                }}
              >
                {view.name}
              </div>
            ) : (
              <></>
            );
          })}
          {/* <div>Out of state owners</div>
          <div>Follow up needed</div>
          <div>Permian</div> */}
        </AccordionDetails>
      </Accordion>
    </LeftDialog>
  );
}

export default GridView;
