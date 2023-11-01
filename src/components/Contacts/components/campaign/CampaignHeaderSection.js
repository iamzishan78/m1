import React, { useContext, useEffect } from 'react';
import { get, isEqual } from 'lodash';
import moment from 'moment';
import {
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { headerStyles } from './styles';

import UsersListWithIcon from 'components/Shared/UsersListWithIcon';
import vf_number from 'components/Shared/valueformatters/vf_number';
import { AppContext } from 'AppContext';
import MetaField from 'components/Table/helpers/MetaField';
import { useLazyQuery } from '@apollo/client';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import CommonFieldList from 'components/Shared/Forms/Fields/CommonFieldList';
import { useForm } from 'react-hook-form';

const CampaignHeader = ({ campaign, updateCampaignInformation }) => {
  const [stateApp, setStateApp] = useContext(AppContext);
  const classes = headerStyles();

  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: 'Campaign Name',
      },
    });
  }, [getMetaData, stateApp.user?.mongoId]);

  const { control } = useForm();

  const offClickHandler = (key, value) => {
    const oldCustomData = campaign.custom_data || {};
    const customData = {
      ...oldCustomData,
      [key.replaceAll('custom_data.', '')]: value,
    };
    if (!isEqual(customData, oldCustomData))
      updateCampaignInformation('custom_data', customData);
  };

  return (
    <Grid container display="flex" direction="column">
      <Grid container display="flex" justifyContent="space-between" alignItems="center">
        <Grid item md={4}>
          <Grid
            container
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs="12" md="12">
              <UsersListWithIcon
                label="Supervisor"
                placeholder="Assign Supervisor"
                selectedUserId={get(campaign, 'owner._id')}
                onChangeUser={user => updateCampaignInformation('owner', user.value)}
              />
            </Grid>
            <Grid
              item
              container
              direction="row"
              display="flex"
              justify="space-between"
              style={{ padding: '15px 0px 10px' }}
            >
              <label style={{ marginTop: '10px', padding: 0 }}>Created Date</label>
              <Grid item style={{ width: '75%' }}>
                <TextField
                  style={{ marginTop: 0 }}
                  size="small"
                  margin="dense"
                  type="date"
                  variant="outlined"
                  placeholder="from"
                  fullWidth
                  value={moment(get(campaign, 'createdAt')).format('yyyy-MM-DD')}
                  onChange={event => {
                    updateCampaignInformation(
                      'createdAt',
                      event ? String(event.target.value) : null
                    );
                  }}
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
          </Grid>
        </Grid>
        <Grid item md={8}>
          <div className={classes.cardsWrapper}>
            <Card variant="outlined" className={`${classes.card} ${classes.leftCard}`}>
              <CardContent className={classes.cardContent}>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.cardHeaderTypography}
                >
                  Status
                </Typography>
                <FormControlLabel
                  label={get(campaign, 'status', 'Open')}
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={get(campaign, 'status', 'Open') === 'Open'}
                      onChange={({ target }) =>
                        updateCampaignInformation(
                          'status',
                          target.checked ? 'Open' : 'Closed'
                        )
                      }
                      size="small"
                    />
                  }
                  className={classes.statusControl}
                />
              </CardContent>
            </Card>
            <Card variant="outlined" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.cardHeaderTypography}
                >
                  Units
                </Typography>
                <Typography
                  id="unitCounts"
                  variant="h6"
                  component="div"
                  className={classes.cardNumberTypography}
                >
                  {get(campaign, 'unitCount', 0)}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.cardHeaderTypography}
                >
                  Contacts
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.cardNumberTypography}
                >
                  {get(campaign, 'contacts', 0)}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.cardHeaderTypography}
                >
                  Total Unit NRA
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.cardNumberTypography}
                >
                  {vf_number(Math.round(get(campaign, 'totalNra', 0)))}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>

      <Grid container style={{ paddingTop: '1rem', paddingBottom: '1.5rem' }}>
        <CommonFieldList
          data={campaign || {}}
          fields={metaDataRes?.getMetaData?.metaData || []}
          control={control}
          offClickHandler={offClickHandler}
        />
      </Grid>

      <Grid>
        {stateApp.showFieldModal && (
          <MetaField
            customDataPrefix="custom_data"
            customDataPostfix=".keyword"
            columns={[]}
            category="Campaign Name"
          />
        )}
        {stateApp.user?.rolePrivileges !== 'READ_ONLY' && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.addDataButton}
              startIcon={<AddIcon />}
              onClick={() =>
                setStateApp(stateApp => ({ ...stateApp, showFieldModal: true }))
              }
            >
              Add Custom Data
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default CampaignHeader;
