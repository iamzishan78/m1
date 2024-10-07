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
import { Controller, useForm, useWatch } from 'react-hook-form';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DynamicForm from './DynamicForm';
import { UPSERT_CUSTOM_ASSET_INFO } from 'graphQL/useMutationUpsertCustomAssetInfo';
import { useMutation, useLazyQuery } from '@apollo/client';
import { ALL_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';
import Loader from 'components/Loaders';

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

export default function AssetManagement() {
  const classes = useStyles();
  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      table_name: '',
      fields: [{ mappingKey: '', keyType: '', label: ''  }],
      creation_place: '',
    },
  });

  const [getAllCustomAsset, { data: allCustomAsset }] = useLazyQuery(
    ALL_CUSTOM_ASSET_INFO,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const fields = useWatch({ control, name: 'fields' });

  const [openDialog, setOpenDialog] = useState(false);
  const [allNewAssets, setAllNewAssets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentAssetId, setCurrentAssetId] = useState(null); // Track the asset ID for editing
  const tableName = watch('table_name', ''); // Watch the "table_name" field

  const [storeCustomAsset, { data }] = useMutation(UPSERT_CUSTOM_ASSET_INFO);

  const onSubmit = (data) => {
    Loader.createToast('create', 'create new Entity in Progress');
    setOpenDialog(false);
    setEditMode(false);

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
          Loader.successToast('create', message);
          getAllCustomAsset();
        } else Loader.errorToast('create', message);
      } else Loader.errorToast('create', 'Failed to create new nntity');
    });
  };

  const hasAddAtLeast1Key = fields.some(
    (field) => field.mappingKey && field.keyType && field.label
  );

  useEffect(() => {
    getAllCustomAsset();
  }, []);

  useEffect(() => {
    if (allCustomAsset) {
      setAllNewAssets(allCustomAsset?.getAllCustomAssetInfo?.res);
    }
  }, [allCustomAsset]);

  // Edit asset handler
  const handleEdit = (asset) => {
    setEditMode(true);
    setCurrentAssetId(asset.id);
    reset({
      table_name: asset.tableName,
      fields: asset.modelKeys,
      creation_place: asset.creationPlace,
    });
    setOpenDialog(true);
  };

  return (
    <>
      <div style={{ marginTop: '65px', marginLeft: '30px' }}>
        <Button
          className={classes.btnColor}
          style={{ margin: '25px 25px 25px 5px' }}
          variant="outlined"
          onClick={() => {
            // Reset the form to default values for creating a new asset
            reset({
              table_name: '',
              fields: [{ mappingKey: '', keyType: '', label: '' }],
              creation_place: '',
            });
            setEditMode(false); // Ensure it's not in edit mode
            setOpenDialog(true);
          }}
          disabled={false}
        >
          {'Create New Asset'}
        </Button>
      </div>

      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditMode(false); // Reset edit mode when dialog closes
        }}
      >
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
                  <IconButton
                    onClick={() => {
                      setOpenDialog(false);
                    }}
                  >
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
                  <DynamicForm control={control} watch={watch} setValue={setValue}/>
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
                      onClick={() => {
                        setOpenDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={
                        hasAddAtLeast1Key && tableName ? classes.btnColor : ''
                      }
                      style={{ margin: '25px 25px 25px 5px' }}
                      variant="outlined"
                      disabled={hasAddAtLeast1Key && tableName ? false : true}
                    >
                      {editMode ? 'Update Field' : 'Create Field'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>

      <div className={classes.assetsContainer}>
        {allNewAssets &&
          allNewAssets.map((model, index) => (
            <div key={index} className={classes.columnContainer}>
              <div className={classes.entityRow}>
                <h2>Entity: {model.tableName}</h2>
                <IconButton
                  onClick={() => handleEdit(model)}
                  className={classes.actionButton}
                >
                  <EditIcon />
                </IconButton>
              </div>
              <div className={classes.tableWrapper}>
                <table className={classes.assetTable}>
                  <thead>
                    <tr>
                      <th>Column Labels</th>
                      <th>Column Keys</th>
                      <th>Column Types</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.modelKeys.map((key, idx) => (
                      <tr key={idx}>
                        <td>{key.label}</td>
                        <td>{key.mappingKey}</td>
                        <td>{key.keyType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
