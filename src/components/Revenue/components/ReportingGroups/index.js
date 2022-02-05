import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "AppContext";
import { Grid, Button, Select, MenuItem, TextField } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { useLazyQuery, useMutation } from "@apollo/client";
import { setStateIfDeepEqual } from "components/Shared/functions";
// actions
import { setRevenuePropertyData } from "actions";
import { ADD_GRID_VIEW } from "graphQL/useMutationAddGridView";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import ButtonDropDown from "components/Shared/M1nTable/components/ButtonGroup";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",

    '& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
      backgroundColor: "#ffff"
    }
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      height: "35px",
      fontWeight: "bold",
    },
  },
  propertyTableContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: "38px",
    paddingRight: "38px",
    marginTop: theme.spacing(2),
  },
  textField: {
    height: "100%",
    width: "100%",
    "& .MuiFormHelperText-contained": {
      justifyContent: "flex-end",
      display: "flex",
    },
  },
}));


export default function ReportingGroups() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  // redux
  const dispatch = useDispatch();
  const selectedFilters = useRef([]);

  const [getGridViews, { data: gridViews }] = useLazyQuery(GET_GRID_VIEWS);
  const [addGridView] = useMutation(ADD_GRID_VIEW);
  const [updateGridView] = useMutation(UPDATE_GRID_VIEW);
  const [config, setConfig] = useState({});

  const [reportingGroup, setReportingGroup] = React.useState('All Properties');
  const [filterToggle, setFilterToggle] = React.useState(false);
  // props to pass in table
  const esIndex = "properties_flat";
  const startPaginationAt = 25;

  const [propertiesCount, setPropertiesCount] = useState(0);
  const [esFilters, setESFilters] = useState([]);


  const onPropertiesCount = (count) => {
    setPropertiesCount(count);
  };

  // query for Properties Table
  const [getESPaginatedList, { data: elasticData, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: (filteredData) => {
      if (filteredData?.getESPaginatedList) {
        const count = filteredData?.getESPaginatedList?.total;
        onPropertiesCount(count);
      }
    },
  });

  useEffect(() => {
    getGridViews({
      variables: {
        module: 'Properties',
        userId: stateApp.user.mongoId,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // dipatching to redux
  useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: loading, data: elasticData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getESPaginatedList, elasticData]);

  const handleAddUpdate = () => {
    setConfig((config) => {
      if (config.type === 'update') {
        updateGridView({
          variables: {
            gridView: {
              _id: gridViews?.getGridViews?.gridViews.find((view) => view.name === reportingGroup)._id,
              name: config.name,
              filters: esFilters,
            },
          },
          refetchQueries: ["getGridViews"],
          awaitRefetchQueries: true,
        }).then((resp) => {
          if (resp.data.updateGridView.success) {
            setReportingGroup(config.name)
          }
          setConfig({ show: false })
        });;
      } else {
        addGridView({
          variables: {
            gridView: {
              name: config.name,
              module: 'Properties',
              type: "Custom",
              user: stateApp.user.mongoId,
              filters: esFilters,
              // columns: columns.map((col) => ({ name: col.name, display: col.options.display })),
            },
          },
          refetchQueries: ["getGridViews"],
          awaitRefetchQueries: true,

        }).then((resp) => {
          if (resp.data.addGridView.success) {
            setReportingGroup(config.name)
          }
          setConfig({ show: false })
        });
      }
      return config
    })
  }

  const ButtonActions = React.useMemo(() => {
    return [{
      isShow: false, text: 'Update Group', action: () => setConfig({ show: true, type: 'update', name: reportingGroup })
    }, { isShow: true, text: 'Save as New Group', action: () => setConfig({ show: true, type: 'new', name: reportingGroup + " - Copy" }) }]
  }, [reportingGroup]);


  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 40px" }}>
          <Grid item xs={3} md={3}>
            {config.show ? <TextField
              fullWidth={true}
              className={classes.textField}
              variant="outlined"
              id="reddit-input"
              value={config.name}
              autoFocus
              required
              helperText={"Return to save"}
              InputProps={{
                className: classes.textFieldInput,
                disableUnderline: true,
              }}
              onClick={(e) => e.stopPropagation()}
              InputLabelProps={{ className: classes.textFieldLabel }}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  handleAddUpdate()
                }
              }}
              onBlur={() => setConfig({ show: false })}
            /> : <Select
              className={classes.viewSwitcher}
              variant="outlined"
              value={reportingGroup}
              fullWidth
              onChange={(e) => {
                setReportingGroup(e.target.value)
                const gridView = gridViews?.getGridViews?.gridViews.find((view) => view.name === e.target.value)
                if (gridView) {
                  setESFilters(gridView.filters)
                  setFilterToggle(!filterToggle)
                  // selectGridView(gridView)
                } else {
                  setESFilters([])
                  setFilterToggle(!filterToggle)
                }
                console.log(selectedFilters.current)
              }}
            >
              <MenuItem value={'All Properties'}>All Properties</MenuItem>
              {
                gridViews?.getGridViews?.gridViews.map((view) => <MenuItem value={view.name}>{view.name}</MenuItem>)
              }
            </Select>
            }
          </Grid>


          {
            esFilters.length > 0 && <Grid item xs={4} md={4}>
              <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
                <Grid item>
                  {
                    reportingGroup === 'All Properties' ? <Button variant="contained" color="secondary" onClick={() => setConfig({ show: true, type: 'new', name: reportingGroup + " - Copy" })}>
                      Save as New Group
                    </Button>
                      : <ButtonDropDown variant="contained" color="secondary" options={ButtonActions} />
                  }
                </Grid>
              </Grid>
            </Grid>
          }
        </Grid>
      </div>

      <div className={classes.propertyTableContainer}>
        <RevenuePropertiesTable
          esIndex={esIndex}
          header="Properties"
          esFilters={esFilters}
          targetLabel="Revenue Properties"
          parent="RevenuePropertiesTable"
          loading={false}
          dense={true}
          filterToggle={filterToggle}
          setESFilters={setESFilters}
          onPropertiesCount={onPropertiesCount}
          startPaginationAt={startPaginationAt}
          revenueSearchQuery={stateApp.revenueSearchQuery}
        />
      </div>
    </>
  );
}
