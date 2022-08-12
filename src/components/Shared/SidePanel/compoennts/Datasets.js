import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import DatabaseIcon from "../../svgIcons/DatabaseIcon";
import GridOnIcon from "@material-ui/icons/GridOn";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FileDatasetIcon from "../../svgIcons/FileDatasetIcon";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AddData from "@material-ui/icons/NoteAddOutlined";

import { copy, deepEqualObjects } from "../../functions";

import { StyledListItemSecondaryAction, StyledMenuSecondaryHeaderItem, } from "./style";
import { AppContext } from "AppContext";
import { useDispatch } from "react-redux";
import { setMapGridCardState, toggleMapGridCardAtived } from "actions";
import { snapGridSideBarData } from "components/MapGridCard/components/data";
import { GET_DATASETS } from "graphQL/useQueryDataset";
import { USER_MAP_SETTINGS_QUERY } from "graphQL/useQueryUserMapSettings";
import { scrollbarStyle } from "styles/common";


const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    background: '#0e111a',
    overflow: 'auto',
    height: '274px',
    paddingTop: '10px',
    ...scrollbarStyle,

    "& .item": {
      "&:hover": {
        background: "#506187",
        "& .actionIcon": {
          color: '#FFFF'
        },
        "& .dIcon": {
          fill: '#ffff ',
        },
      },
      cursor: "pointer",
      paddingLeft: '10px',
      marginBottom: '15px',
    },

    "& .dIcon": {
      fill: '#506187',
    },

    "& .actionIcons": {
      paddingRight: '20px', display: 'flex', position: 'relative', top: '7px',
      "& .actionIcon": {
        color: '#3b4663'
      }
    },
    fontFamily: "Poppins",

    position: "relative",
    disabledLayerTitle: {
      "& span": { color: "rgb(127, 149, 199) !important" },
    },
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
      minWidth: "40px", // for some reason controls the icon spacing
    },
    "& .MuiTypography-root": {
      color: theme.palette.common.white,
    },
    paddingLeft: "10px",
    justifyContent: "center",
    alignItems: "center",
  }),
  subContainer: (props) => ({
    marginLeft: theme.spacing(props.depth * 2),
  }),
  item: {
    paddingLeft: '10px', marginBottom: '15px'
  }
}));

function Datasets({ layerMap, headerButton }) {

  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const dispatch = useDispatch();

  const [getDatasets, { data: _datasets }] = useLazyQuery(GET_DATASETS);
  const [userMapSettings, { data: mapSettings }] = useLazyQuery(USER_MAP_SETTINGS_QUERY);

  useEffect(() => {
    userMapSettings({ variables: { user: stateApp.user._id, type: 'DatasetVisibility' } })
    getDatasets({ variables: { userId: stateApp.user._id } })
  }, [])

  const datasets = useMemo(() => {
    if (_datasets?.getDatasets?.length && layerMap.length && mapSettings?.userMapSettings?.message) {
      const datasets = copy(_datasets.getDatasets)
      const settings = mapSettings?.userMapSettings?.settings?.settings || {}

      datasets.forEach((dataset) => {
        dataset.name = dataset.sourceName
        if (dataset.sourceName === 'M1 Platform') {
          dataset.Icon = DatabaseIcon
          dataset.visibility = true
          dataset.categoryCount = snapGridSideBarData.length
          dataset.categories = snapGridSideBarData
        } else {
          dataset.Icon = FileDatasetIcon
          dataset.categoryCount = dataset.categories.length
          dataset.visibility = typeof settings[dataset._id] === 'undefined' ? true : settings[dataset._id]
          dataset.categories.forEach((category) => {
            category.file = dataset.file
            category.layerName = category.name
          })
        }
      })
      setStateApp((state) => ({ ...state, datasets }));
      return datasets.filter((dataset) => dataset.visibility)
    } else
      return []
  }, [_datasets, layerMap, mapSettings])

  const getBorderColor = useCallback((name) => (stateApp?.selectedDataset?.sourceName === name ? '#05aff0' : '#263451'), [stateApp.selectedDataset])

  const onItemClick = (dataset) => {
    dispatch(setMapGridCardState({ mapGridCardActivated: false }));
    if (dataset.sourceName === 'M1 Platform' && stateApp?.selectedDataset?.sourceName !== dataset.sourceName) {
      setStateApp((state) => ({ ...state, layerGridCard: false }));
      dispatch(setMapGridCardState({ mapGridCardActivated: true }));
    } else {
      setStateApp((state) => ({
        ...state,
        selectedLayer: { ...dataset.categories[0] },
        layerGridCard: true,
      }));
      dispatch(setMapGridCardState({ mapGridCardActivated: true }));
    }

    setStateApp((state) => ({ ...state, selectedDataset: dataset }))
  }

  return (
    <>
      <StyledMenuSecondaryHeaderItem>
        <ListItemText primary={'Data Sources'} />
        {headerButton && (
          <StyledListItemSecondaryAction>
            <Button onClick={() => headerButton.fn('manageSource')} color="secondary" variant="outlined" startIcon={headerButton.icon}>
              Add Data
            </Button>
          </StyledListItemSecondaryAction>
        )}
      </StyledMenuSecondaryHeaderItem>
      <div className={classes.root}>
        {datasets?.map(({ sourceName, Icon, categories, ...rest }) => (
          <Grid className="item" key={sourceName} onClick={() => onItemClick({ sourceName, Icon, categories, ...rest })}>
            <Box borderColor={getBorderColor(sourceName)} borderLeft={4} margin={1} marginLeft={0}>
              <Grid container direction="column" justifyContent="center" style={{ paddingLeft: '10px' }}>
                <Grid item md={12}>
                  <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                    <Grid item style={{ display: 'flex', flexDirection: 'inline' }}>
                      <Icon className='dIcon' />
                      <Typography style={{
                        color: '#ffff', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '254px'
                      }}>{sourceName}</Typography>
                    </Grid>
                    <Grid item className='actionIcons'>
                      <GridOnIcon className='actionIcon' />
                      {/* <MoreVertIcon className='actionIcon' /> */}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12}>
                  <Typography variant="body2" gutterBottom style={{ color: 'lightgray', paddingLeft: '25px' }}>{rest.categoryCount} categories</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </div>
    </>
  );
}

export default React.memo(Datasets, deepEqualObjects);
