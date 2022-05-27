import React, { useCallback, useContext, useMemo } from "react";
import { groupBy } from "lodash";
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

import { deepEqualObjects } from "../../functions";

import { StyledListItemSecondaryAction, StyledMenuSecondaryHeaderItem, } from "./style";
import { AppContext } from "AppContext";
import { useDispatch } from "react-redux";
import { setMapGridCardState, toggleMapGridCardAtived } from "actions";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    background: '#0e111a',
    overflow: 'auto',
    height: '274px',
    paddingTop: '10px',

    "& .item": {
      "&:hover": {
        background: "#506187",
        "& .actionIcon": {
          color: '#FFFF'
        }
      },
      cursor: "pointer",
      paddingLeft: '10px',
      marginBottom: '15px',
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

  const datasets = useMemo(() => {
    const groupLayers = groupBy(layerMap, 'groupId')
    const datasets = layerMap.filter((layer) => layer.type === 'group' && layer.name !== 'Agreements')
    datasets.forEach((dataset) => {
      dataset.categoryCount = groupLayers[dataset.id].length
      dataset.Icon = FileDatasetIcon
    })
    datasets.unshift({ name: 'M1 Platform', categoryCount: 6, Icon: DatabaseIcon })
    return datasets
  }, [layerMap])

  const getBorderColor = useCallback((name) => (stateApp.selectedDataset === name ? '#05aff0' : '#263451'), [stateApp.selectedDataset])

  const onItemClick = (name) => {
    if (name === 'M1 Platform' && stateApp.selectedDataset !== name) {
      // setStateApp((state) => ({
      //   ...state,
      //   layerGridCard: true,
      // }));
      dispatch(toggleMapGridCardAtived());
      // dispatch(setMapGridCardState({ mapGridCardActivated: true }));
    }

    setStateApp((state) => ({ ...state, selectedDataset: name }))
  }

  return (
    <>
      <StyledMenuSecondaryHeaderItem>
        <ListItemText primary={'Datasets'} />
        {headerButton && (
          <StyledListItemSecondaryAction>
            <Button onClick={headerButton.fn} color="secondary" variant="outlined" startIcon={headerButton.icon}>
              Add Data
            </Button>
          </StyledListItemSecondaryAction>
        )}
      </StyledMenuSecondaryHeaderItem>
      <div className={classes.root}>
        {datasets?.map(({ name, Icon, categoryCount }) => (
          <Grid className="item" key={name} onClick={() => onItemClick(name)}>
            <Box borderColor={getBorderColor(name)} borderLeft={4} margin={1} marginLeft={0}>
              <Grid container direction="column" justifyContent="center" style={{ paddingLeft: '10px' }}>
                <Grid item md={12}>
                  <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                    <Grid item style={{ display: 'flex', flexDirection: 'inline' }}>
                      <Icon />
                      <Typography style={{ color: '#ffff' }}>{name}</Typography>
                    </Grid>
                    <Grid item className='actionIcons'>
                      <GridOnIcon className='actionIcon' />
                      <MoreVertIcon className='actionIcon' />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12}>
                  <Typography variant="body2" gutterBottom style={{ color: '#3b4663', paddingLeft: '10px' }}>{categoryCount} categories</Typography>
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
