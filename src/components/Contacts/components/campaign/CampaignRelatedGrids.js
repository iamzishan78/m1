import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UnitIcon from 'components/Shared/svgIcons/unit';
import Contact from 'components/Shared/svgIcons/contact';

import Card from '@material-ui/core/Card';
import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import CampaignUnitsTable from 'components/Table//Unit/CampaignUnitsTable';
import CampaignContactsTable from 'components/Table/Contact/CampaignContactsTable';

import UnitInterestOwnersTable from 'components/Table/Unit/UnitInterestOwnersTable';
import { campaignInitialData } from './data';
import MRTTable from 'components/MRTTable';

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    '& .MuiInput-inputTypeSearch': {
      width: '96%',
    },
  },
  dockMenu: {
    width: '100%',
  },
  mainPanelsDiv: {
    height: '100%',
    maxHeight: 'calc(100vh - 493px)',
    position: 'relative',
    '&::-webkit-scrollbar': {
      width: '0.75em',
      height: '0.75em',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#929292',
      borderRadius: 10,
    },
    '& div': {
      '&>.MuiPaper-root': {
        '&>:nth-child(3)': {
          [theme.breakpoints.up('xl')]: {
            height: 'calc(50vh + 50px) !important',
          },
          [theme.breakpoints.down('xl')]: {
            height: 'calc(35vh) !important',
          },
        },
      },
    },
  },
  selectorOptions: {
    backgroundColor: '#F2F2F2',
    overflow: 'overlay',
  },
}));

function CamapignRelatedGrids({ campaign }) {
  const classes = useStyles();
  const [searchTapValue, SearchTapValue] = useState(campaignInitialData[0]);

  const setSearchTapValue = state => {
    if (searchTapValue !== state) {
      SearchTapValue(state);
    }
  };

  const campaignUnitInterestoverrideMeta = useMemo(() => ({
    defaultFilters: [
      { field: 'shape.layer.keyword', value: 'unit' },
      { field: 'campaignName.keyword', value: campaign?.name || '' },
      { field: "contact.IsDeleted", value: "false" },
      { field: "shape.IsDeleted", value: "false" }
    ],
    gridViewSettings: {
      label: 'Unit Interest Management',
      module: 'UnitInterest',
      Icon: UnitIcon,
      defaultView: {
        name: 'All Units Interest',
        type: 'Default',
      },
      handleDefaultView: (view, user) => {
        if (view?.name === 'My Unit Interest') {
          view.filters[0].value = user._id;
        }
        return view;
      },
      cssOverride: {
        top: '532px',
        left: '274px',
        maxHeight: '40%',
      },
    },
    deletedKeys: {
      mainRecord: { key: '_id' },
      campaignName: {
        key: 'campaignName',
        func: (campaignName) => campaignName.filter(c => c !== campaign?.name)
      },
    },
    height: '35vh',
  }), [campaign?.name]);

  const campaignUnitoverrideMeta = useMemo(() => ({
    defaultFilters: [
      { field: 'layer.keyword', value: 'unit' },
      { field: 'shapeJson.properties.campaignName.keyword', value: campaign?.name || '' },
    ],
    gridViewSettings: {
      label: 'Unit Management',
      module: 'Units',
      Icon: UnitIcon,
      defaultView: {
        name: 'All Units',
        type: 'Default',
      },
      handleDefaultView: (view, user) => {
        if (view?.name === 'My Units') {
          view.filters[0].value = user._id;
        }
        return view;
      },
      cssOverride: {
        top: '532px',
        left: '274px',
        maxHeight: '40%',
      },
    },
    deletedKeys: {
      mainRecord: { key: '_id' },
      parentRecord: { key: '', func: () => campaign?._id },
      customlayers: {
        key: 'shapeJson',
        func: (shapeJson) => {
          return {
            shapeJson: {
              ...shapeJson,
              properties: {
                ...shapeJson.properties,
                campaignName: shapeJson?.properties?.campaignName?.filter?.(name => name !== campaign?.name) || []
              }
            }
          }
        }
      },
    },
    isCampaignRefetch: true,
    height: '35vh',
  }), [campaign?.name]);

  const campaignContactoverrideMeta = useMemo(() => ({
    defaultFilters: [
      { field: 'campaignName.keyword', value: campaign?.name || '' },
    ],
    gridViewSettings: {
      label: 'Contact Management',
      module: 'Contacts',
      Icon: Contact,
      defaultView: {
        name: 'All Contacts',
        type: 'Default',
      },
      handleDefaultView: (view, user) => {
        if (view?.name === 'My Contacts') {
          view.filters[0].value = user.name;
        }
        if (view?.name === 'Recently Modified' || view.name === 'Recently Added') {
          view.filters[0].value.range[view.filters[0].field].gte = moment().subtract(30, 'days').toISOString();
          view.filters[0].value.range[view.filters[0].field].lte = moment().toISOString();
        }
        return view;
      },
      cssOverride: {
        top: '532px',
        left: '274px',
        maxHeight: '40%',
      },
    },
    deletedKeys: {
      mainRecord: { key: '_id' },
      parentRecord: { key: '', func: () => campaign?._id },
    },
    isCampaignRefetch: true,
    showAddContactButton: false,
    height: '35vh',
  }), [campaign?.name]);

  return (
    <div className={classes.card}>
      <Card className={classes.dockMenu}>
        <div style={{ position: 'relative' }}>
          {/* //// search panel //// */}
          <Grid container direction="row" style={{ height: '100%' }}>
            <Grid item md={2} className={classes.selectorOptions}>
              <Typography variant="h6" component="h1" style={{ fontWeight: 'bold', padding: '10px 0px 0px 20px' }}>
                Campaign Details
              </Typography>

              <List component="nav" aria-label="main mailbox folders">
                {campaignInitialData.map(row => {
                  const { Icon } = row;
                  return (
                    <ListItem
                      button
                      selected={row.value === searchTapValue.value}
                      onClick={() => setSearchTapValue(row)}
                    >
                      <ListItemIcon style={{ minWidth: '40px' }}>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText id={row.label} primary={row.label} />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>

            <Grid item md={10} style={{ padding: '0px 0px', overflow: 'overlay' }}>
              <div style={{ position: 'relative' }} classes={classes.gridTables}>
                {(searchTapValue.value === 'contacts' && campaign?.name) && (
                  // <CampaignContactsTable campaign={campaign} />
                  <MRTTable name="CampaignContactTable" overrideMeta={campaignContactoverrideMeta} />
                )}
                {(searchTapValue.value === 'units' && campaign?.name) && (
                  // <CampaignUnitsTable campaign={campaign} header="Units" />
                  <MRTTable name="CampaignUnitTable" overrideMeta={campaignUnitoverrideMeta} />
                )}
                {(searchTapValue.value === 'unitInterests' && campaign?.name) && (
                  // <UnitInterestOwnersTable esIndex="shapeowners_flat" campaignName={campaign?.name} />
                  <MRTTable name="CampaignUnitInterestTable" overrideMeta={campaignUnitInterestoverrideMeta} />
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </Card>
    </div>
  );
}

export default CamapignRelatedGrids;
