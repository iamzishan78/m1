import React, { useMemo } from "react";
import { groupBy } from "lodash";
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

function Datasets({ layerMap, headerButton }) {

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
      <div style={{ background: '#0e111a', paddingBottom: '10px' }} >
        {datasets?.map(({ name, Icon, categoryCount }) => (
          <Grid style={{ paddingLeft: '10px', marginBottom: '15px' }} key={name}>
            <Box borderColor={'#05aff0'} borderLeft={4}>
              <Grid container direction="column" justifyContent="center" style={{ paddingLeft: '10px' }}>
                <Grid item md={12}>
                  <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                    <Grid item style={{ display: 'flex', flexDirection: 'inline' }}>
                      <Icon />
                      <Typography style={{ color: '#ffff' }}>{name}</Typography>
                    </Grid>
                    <Grid item style={{ paddingRight: '20px', display: 'flex', position: 'relative', top: '7px' }}>
                      <GridOnIcon style={{ color: '#3b4663' }} />
                      <MoreVertIcon style={{ color: '#3b4663' }} />
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
