import React, { useEffect, useMemo, useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Grid } from '@material-ui/core';
import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';

import { useMutation, useLazyQuery } from '@apollo/client';
import { ADD_OWNER_TOA_SHAPE } from 'graphQL/useMutationAddOwnerToAShape';
import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from 'actions';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { useForm } from 'react-hook-form';
import AutocompEntityNamesList from 'components/Shared/Forms/Fields/AutocompEntityNamesList';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import { tableGlobalController } from 'hookstate/tableController';
import { sideDialogController, unitInterestOwnerState } from 'hookstate/sideDialogController';
import { globalStateController } from 'hookstate/globalStateController';
import unitInterestOwnerForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/UnitDetailInterestOwner/unit_interest_owner_form_schema';
import CommonForm from 'components/Shared/FormsFieldsData/CommonForm';
import AddIcon from "@material-ui/icons/Add";
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

const useStyles = makeStyles((theme) => ({
  maxWidth: {
    width: '100%',
  },
  dialogContent: {
    '& header': {
      position: 'absolute',
      left: '0',
      top: '55px',
    },
  },
  primary: {
    color: 'black',
    backgroundColor: '#E0E0E0',
  },
  secondary: {
    color: 'white',
    backgroundColor: '#26ACD8',
  },
  dialogAction: {
    '& .Mui-disabled': {
      backgroundColor: 'transparent',
    },
  },
  move: {
    zIndex: 10000,
  },
  baseValueChanged: {
    width: '100%',
    '& .MuiInputBase-input': {
      color: 'dodgerblue',
      fontWeight: 'bold',
    },
  },
  addContactButton: {
    float: "right",
    display: "flex",
    alignItems: "center",
    // marginTop: "15px",
    cursor: "pointer",
  },
  addContactButtonSelected: {
    float: "right",
    display: "flex",
    alignItems: "center",
    // marginTop: "15px",
    cursor: "pointer",
    color: `${theme.palette.secondary.main} !important`,
  },

  personAddIcon: {
    color: `${theme.palette.secondary.main} !important`,
    fill: `${theme.palette.secondary.main} !important`,
  },
  addDataButton: {
    backgroundColor: "white",
    color: "black",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.common.white,
      opacity: 0.15,
    },
  },
}));

// Extracting values for getting value from autocomplete object
const extractValueRecursively = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = extractValueRecursively(obj[key]?.value !== undefined ? obj[key]?.value : obj[key]);
      return acc;
    }, {});
  }

  return obj;
};


export default function AddUnitOwnerDialogContent({ selectedRow, setSelectedRow, uAcres, uUnitPricing, uMaxUnitPricing, metaDataCategory, ...props }) {
  const dispatch = useDispatch();

  const formState = sideDialogController("unitInterestDialog").useCompleteState()
  const formStateValues = formState?.get({ noproxy: true });
  const [metafields, setMetaFields] = useState([]);

  const { user } = globalStateController.useState(['user']);
  const getUser = user.get({ noproxy: true });

  const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);
  const { control, reset, setValue, getValues, watch } = useForm();

  // CONTACT

  const [addOwnerToAShape, { data: mutationData }] = useMutation(ADD_OWNER_TOA_SHAPE);

  const [updateShapeOwners, { data: updateData }] = useMutation(UPDATE_SHAPE_OWNERS);

  const [updateContact] = useMutation(UPDATECONTACT);

  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

  useEffect(() => {
    sideDialogController("unitInterestDialog").updateState({
      uAcres, uUnitPricing, uMaxUnitPricing
    })

  }, [uAcres, uUnitPricing, uMaxUnitPricing])

  useEffect(() => {
    sideDialogController("unitInterestDialog").updateState({
      workspaceSettings
    })
  }, [workspaceSettings])

  useEffect(() => {
    if (selectedRow) {
      const filteredSelectedRow = _.pick(selectedRow, Object.keys(unitInterestOwnerState));
      const rowData = _.merge({}, unitInterestOwnerState, filteredSelectedRow);

      rowData.contactStatus = selectedRow?.contact?.contactStatus
      rowData.status = selectedRow?.contact?.status
      rowData.relatedObject = selectedRow?.contactId || selectedRow?.ownerEntity
      sideDialogController("unitInterestDialog").updateState(rowData)
      reset(rowData)
    }
  }, [selectedRow]);

  useEffect(() => {
    let type = null;
    if (mutationData && mutationData.addOwnerToAShape) {
      type = { name: 'add', success: mutationData.addOwnerToAShape.success };
    } else if (updateData && updateData.updateShapeOwners) {
      type = { name: 'update', success: updateData.updateShapeOwners.success };
    }

    if (type) {
      if (type.success) {
        dispatch(
          showSuccessMessage(
            formStateValues?.name
              ? `${formStateValues?.name} was successfully ${type.name}ed`
              : `The owner was successfully ${type.name}ed`
          )
        );

        handleClickDialogClose();
      } else {
        dispatch(showErrorMessage('Error occurred'));
      }

      window.setStateApp(state => ({
        ...state,
        universalCircularLoaderAct: false,
      }));
      tableGlobalController.refetch()
    }
  }, [mutationData, updateData]);


  const handleClickDialogClose = () => {
    props.onClose();
    sideDialogController("unitInterestDialog").reset()
    reset()
  };

  const handleUpdateContact = ownerToAdd => {
    if (
      ((ownerToAdd.contactStatus || selectedRow?.contactStatus) &&
        selectedRow?.contactStatus !== ownerToAdd.contactStatus) ||
      ((ownerToAdd.status || selectedRow?.status) &&
        selectedRow?.status !== ownerToAdd.status) ||
      ((ownerToAdd.ownerType || selectedRow?.ownerType) &&
        selectedRow?.ownerType !== ownerToAdd.ownerType) ||
      ((ownerToAdd.campaignPriority || selectedRow?.campaignPriority) &&
        selectedRow?.campaignPriority !== ownerToAdd.campaignPriority) ||
      ((ownerToAdd.campaignName || selectedRow?.campaignName) &&
        selectedRow?.campaignName !== ownerToAdd.campaignName) ||
      ownerToAdd.campaignName ||
      selectedRow?.campaignName !== ownerToAdd.campaignName
    ) {
      updateContact({
        variables: {
          contact: {
            _id: ownerToAdd.ownerEntity._id || ownerToAdd.ownerEntity,
            contactStatus: ownerToAdd.contactStatus && (ownerToAdd.contactStatus.value || ownerToAdd.contactStatus),
            status: ownerToAdd.status && (ownerToAdd.status.value || ownerToAdd.status),
            lastUpdateBy: getUser?._id,
            ownerType: ownerToAdd.ownerType && (ownerToAdd.ownerType.value || ownerToAdd.ownerType),
            campaignPriority: ownerToAdd.campaignPriority && (ownerToAdd.campaignPriority.value || ownerToAdd.campaignPriority),
          },
        },
      });
    }

  };

  const handleClickAdd = e => {
    e.preventDefault();
    const unitOwnerFormValue = getValues();
    sideDialogController("unitInterestDialog").updateState({
      ...unitOwnerFormValue,
    })

    const ownerType = formStateValues.ownerType && (formStateValues.ownerType.value || formStateValues.ownerType);

    if (formStateValues?.newOwner) {
      sideDialogController("unitInterestDialog").updateState({
        relatedObject: {
          ...unitOwnerFormValue,
          ownerType
        }
      })
    } else {
      handleUpdateContact(formStateValues)
    }
    if (selectedRow) {
      // Update shape owner object for autocompletes
      const shapeOwner = extractValueRecursively({
        _id: selectedRow?._id,
        ...formStateValues,
        deals: formStateValues?.deals || [],
        relatedObject: formStateValues.relatedObject,
        createBy: getUser?._id,
        lastUpdateBy: getUser?._id,
        shapeId: props.shapeId ?? get(selectedRow, 'customLayer._id'),
      });
      updateShapeOwners({
        variables: {
          shapeType: props.shapeType,
          shapeOwners: shapeOwner,
          userId: getUser?._id,
        },
        refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getCustomLayer'],
        awaitRefetchQueries: true,
      });
    } else {
      console.log(props)
      // Update shape owner object for autocompletes
      const shapeOwner = extractValueRecursively({
        ...formStateValues,
        deals: formStateValues?.deals || [],
        relatedObject: formStateValues.relatedObject,
        createBy: getUser?._id,
        lastUpdateBy: getUser?._id,
        shapeId: props.shapeId ?? get(selectedRow, 'customLayer._id'),
      });
      addOwnerToAShape({
        variables: {
          shapeType: props.shapeType,
          shapeOwner,
        },
        refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getCustomLayer'],
        awaitRefetchQueries: true,
      });
    }
    setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));
  };

  useEffect(() => {
    if (!metaDataCategory) return;

    getMetaData({
      variables: {
        user: getUser?._id,
        category: metaDataCategory,
      },
    });
  }, [metaDataCategory, user]);

  useEffect(() => {
    if (!metaDataRes?.getMetaData?.metaData) return;

    setMetaFields(metaDataRes?.getMetaData?.metaData);
  }, [metaDataRes]);


  const classes = useStyles();

  const formSchema = useMemo(() => {
    return unitInterestOwnerForm({
      getValues,
      setValue,
      newOwner: formStateValues?.newOwner,
      metafields,
    });
  }, [formStateValues?.newOwner, formState?.rerenderJson, metafields, formState.uUnitPricing, formState.uAcres, formState.uMaxUnitPricing]);

  return (
    <div className={classes.move}>
      <React.Fragment>
        <RightDialog open={true} handleClickDialogClose={handleClickDialogClose} width={'450px'}>
          <Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
            <Grid item md={10} xs={10}>
              <DialogTitle id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
                {selectedRow ? 'Update' : 'Add'} Unit Ownership
              </DialogTitle>
            </Grid>
            <Grid item md={1} xs={1} style={{ marginLeft: '20px' }}>
              <div style={{ float: 'right', display: 'flex', marginRight: '10px' }}>
                <IconButton
                  size="small"
                  component="span"
                  style={{
                    background: 'transparent',
                    align: 'center',
                    float: 'right',
                  }}
                  onClick={handleClickDialogClose}
                >
                  <KeyboardTabBlackIcon />
                </IconButton>
              </div>
            </Grid>
          </Grid>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              {/* {!selectedRow &&
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addDataButton}
                  startIcon={<AddIcon />}
                  onClick={() => {
                    globalStateController.updateState({
                      showFieldModal: true,
                    });
                    props.onClose()
                  }}
                >
                  Add Custom Data
                </Button>
              } */}

              <Grid item xs={12}>
                {!formStateValues?.newOwner && <h3 style={{ float: "left" }}>Name</h3>}
                {!selectedRow && (<div className={formStateValues?.newOwner ? classes.addContactButtonSelected : classes.addContactButton}
                  onClick={() => {
                    sideDialogController("unitInterestDialog").updateState({ newOwner: !formStateValues?.newOwner })
                  }}>
                  <PersonAddOutlinedIcon className={formStateValues?.newOwner ? classes.personAddIcon : null} />
                  <p>&nbsp;Add new</p>
                </div>)}
                {!formStateValues?.newOwner &&
                  <AutocompEntityNamesList
                    userId={getUser?._id}
                    nameAutValue={formStateValues?.name}
                    setNameAutValue={(contact) => {
                      sideDialogController("unitInterestDialog").updateState({ name: contact?.name, ownerEntity: contact?._id, relatedObject: contact?._id })
                    }}
                    placeholder={"Search existing contact"}
                  />
                }
              </Grid>


              <CommonForm
                formSchema={formSchema}
                control={control}
                reset={reset}
                watch={watch}
                dialogKey={"unitInterestDialog"}
              />

            </Grid>
          </DialogContent>
          <DialogActions className={classes.dialogAction}>
            <Button
              className={classes.primary}
              onClick={handleClickDialogClose}
              color="primary"
              style={{ marginBottom: '40px' }}
            >
              Cancel
            </Button>
            <Button
              className={classes.secondary}
              disabled={((!formStateValues?.name) && !formStateValues?.newOwner) ? true : false}
              onClick={handleClickAdd}
              color="secondary"
              style={{ marginBottom: '40px', marginRight: '20px' }}
              data-testid='action-button'
            >
              {selectedRow ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </RightDialog>
      </React.Fragment>
    </div>
  );
}
