import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Dialog,
  IconButton,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core';
import Loader from 'components/Loaders';
import { useMutation } from '@apollo/client';
import CloseIcon from '@material-ui/icons/Close';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { tableGlobalController } from 'hookstate/tableController';
import { UPSERT_CUSTOM_ASSET_INFO } from 'graphQL/useMutationUpsertCustomAssetInfo';
import DynamicForm from '../Forms/DynamicForm';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 30px',
  },

  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& svg': {
      fill: '#d9d9d9',
      '&:hover': {
        fill: '#b5b2b2',
      },
    },
  },

  btnColor: {
    color: 'white',
    backgroundColor: '#4576CF',
  },

  assetsContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },

  tableWrapper: {
    maxHeight: '500px', // Set the maximum height
    overflowY: 'auto', // Enable vertical scrolling
    width: '80%',
  },

  assetTable: {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      border: '1px solid #ddd',
      padding: '8px',
    },
    '& th': {
      backgroundColor: '#f2f2f2',
      position: 'sticky',
      top: '0', // Stick to the top of the container
    },
  },

  columnContainer: {
    width: '100%',
    marginLeft: '80px',
  },

  entityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },

  actionButton: {
    marginLeft: theme.spacing(1),
  },
}));

const options = [
  { label: 'Draw on Map', value: 'onMap' },
  { label: 'Add with RightDialog', value: 'RightDialog' },
];

function CustomAssetEntityDialog() {
  const classes = useStyles();
  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      table_name: '',
      fields: [{ mappingKey: '', keyType: '', label: '' }],
      creation_place: '',
    },
  });

  const fields = useWatch({ control, name: 'fields' });
  const tableName = watch('table_name', ''); // Watch the "table_name" field

  const { stateValues } = tableGlobalController.useState([
    'AssetCustomEntityDialog',
  ]);
  const { type, isOpen } = stateValues.AssetCustomEntityDialog || {};

  const [storeCustomAsset] = useMutation(UPSERT_CUSTOM_ASSET_INFO);

  const handleClose = async () => {
    tableGlobalController.updateState({
      AssetCustomEntityDialog: {},
    });
  };

  const onSubmit = (data) => {
    Loader.createToast('create', 'create new Entity in Progress');
    handleClose();

    storeCustomAsset({
      variables: {
        tableName: data.table_name,
        modelKeys: data.fields,
        creationPlace: data.creation_place,
      },
    }).then((res) => {
      if (res?.data?.upsertCustomAssetInfo) {
        const { success, message } = res.data.upsertCustomAssetInfo;
        if (success) {
          tableGlobalController.refetch();
          Loader.successToast('create', message);
        } else Loader.errorToast('create', message);
      } else Loader.errorToast('create', 'Failed to create new nntity');
    });
  };

  const hasAtLeastOneKey = fields.some(
    (field) => field.mappingKey && field.keyType && field.label
  );

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className={classes.header}>
            <Grid
              container
              justify="space-between"
              direction="row"
              display="flex"
            >
              <Grid item>
                <h3>Add New Custom Entity on Asset Management Tab</h3>
              </Grid>
              <Grid item xs={6} className={classes.dialogActions}>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>

          <div>
            <div>
              <div style={{ padding: '5px 35px' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Controller
                      control={control}
                      name="table_name"
                      render={(props) => (
                        <TextField
                          size="small"
                          type="text"
                          variant="outlined"
                          value={props.value}
                          inputRef={props.ref}
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) => {
                            props.onChange(e.target.value);
                          }}
                          label="Table Name"
                          placeholder="Table Name"
                          fullWidth
                          defaultValue=""
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      control={control}
                      name={`creation_place`}
                      render={(props) => (
                        <TextField
                          select
                          size="small"
                          type="text"
                          variant="outlined"
                          value={props.value}
                          inputRef={props.ref}
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) => {
                            props.onChange(e.target.value);
                          }}
                          label="Creationn Place"
                          placeholder="creation place"
                          fullWidth
                          defaultValue=""
                        >
                          {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item>
                  <h3>Add Model Keys for this Entity in this table </h3>
                </Grid>
                <DynamicForm
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />
              </div>

              <div
                style={{
                  borderTop: '1px solid #EEF1F4',
                }}
              >
                <div style={{ float: 'right' }}>
                  <Button
                    style={{ margin: '25px 5px 25px 0px' }}
                    variant="outlined"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={
                      hasAtLeastOneKey && tableName ? classes.btnColor : ''
                    }
                    style={{ margin: '25px 25px 25px 5px' }}
                    variant="outlined"
                    disabled={hasAtLeastOneKey && tableName ? false : true}
                  >
                    {type === 'addCustomAsset'
                      ? 'Create Asset'
                      : 'Update Asset'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default CustomAssetEntityDialog;
