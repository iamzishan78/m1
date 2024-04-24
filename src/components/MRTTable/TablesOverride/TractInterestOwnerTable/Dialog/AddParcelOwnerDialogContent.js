import React, { useState, useEffect } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import { Grid } from '@material-ui/core';
import _ from "lodash";

import { useMutation, useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import { Controller, useForm } from 'react-hook-form';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { setStateIfDeepEqual } from 'components/Shared/functions';
import { PAGINATEDCONTACTSQUERY } from 'graphQL/useQueryPaginatedContacts';
import AutocompEntityNamesVirtualizeList from 'components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList';
import { showErrorMessage, showSuccessMessage } from '../../../../../../src/actions';
import { UPDATEPARCELOWNER } from 'graphQL/useMutationUpdateParcelOwner';
import { ADDCONTACT } from 'graphQL/useMutationAddContact';
import { ADDOWNERTOAPARCEL } from 'graphQL/useMutationAddOwnerToAParcel';
import { tableGlobalController } from 'hookstate/tableController';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import contactSubForm from 'components/Shared/FormsFieldsData/FormsJson/ParcelDetailInterestOwner/contactSubForm';
import TextFieldComponent from 'components/Shared/FormsFieldsData/Fields/TextField';
import AutoCompleteComponent from 'components/Shared/FormsFieldsData/Fields/AutoComplete';
import parcelOwnerForm from 'components/Shared/FormsFieldsData/FormsJson/ParcelDetailInterestOwner/parcelOwnerForm';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';
import { sideDialogController, initialState } from 'hookstate/sideDialogController';
import { globalStateController } from 'hookstate/globalStateController';

const useStyles = makeStyles(theme => ({
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
  }
}));


export default function AddParcelOwnerDialogContent({ selectedRow, setSelectedRow, ...props }) {
  const dispatch = useDispatch();

  const formState = sideDialogController.useCompleteState()
  const formStateValues = formState?.get({ noproxy: true });

  const { user } = globalStateController.useState(['user']);
  const getUser = user.get({ noproxy: true });

  const { control: contactSubFormControl } = useForm();
  const { control: parcelOwnerFormControl, reset } = useForm();

  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState('');
  const setNameAutInputValue = newState => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  // CONTACT

  const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
    PAGINATEDCONTACTSQUERY,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    }
  );

  const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);

  const [addOwnerToAParcel, { data: mutationData }] = useMutation(ADDOWNERTOAPARCEL);

  const [updateParcelOwner, { data: updateData }] = useMutation(UPDATEPARCELOWNER);

  useEffect(() => {
    if (_.get(addContactData, 'addContact.contact')) {
      const contact = {
        name: addContactData.addContact.contact.name,
        _id: addContactData.addContact.contact._id,
      }
      sideDialogController.updateState({ name: contact?.name, ownerEntity: contact?._id, relatedObject: contact?._id })
    }
  }, [addContactData]);

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray([...allContacts?.paginatedContacts?.edges?.map(el => el.node)]);
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
    }
    setIsNextPageLoading(false);
  }, [allContacts]);

  useEffect(() => {
    // will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [nameAutInputValue]);

  const loadNextPage = async pageVariables => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
    return null;
  };

  useEffect(() => {
    let type = null;
    if (mutationData && mutationData.addOwnerToAParcel) {
      type = { name: 'add', success: mutationData.addOwnerToAParcel.success };
    } else if (updateData && updateData.updateParcelOwner) {
      type = { name: 'updat', success: updateData.updateParcelOwner.success };
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

      window.setStateApp((stateApp) => ({
        ...stateApp,
        universalCircularLoaderAct: false,
      }));
      tableGlobalController.refetch()
    }
  }, [mutationData, updateData]);

  const handleClickDialogClose = () => {
    props.onClose();
    sideDialogController.reset()
  };

  const handleClickAdd = e => {
    e.preventDefault();
    const qtr = [formStateValues?.qtr1 || null, formStateValues?.qtr2 || null, formStateValues?.qtr3 || null, formStateValues?.qtr4 || null]
    sideDialogController.updateState({ qtr: qtr, customLayer: props.customLayerId })

    addOwnerToAParcel({
      variables: {
        parcelOwner: {
          ...formStateValues,
          createBy: getUser?._id,
          lastUpdateBy: getUser?._id,
        },
      },
      refetchQueries: [
        'getCustomLayer',
        'getparcelOwners',
        'getContactParcelInterests',
        'getContactParcelInterest',
        'getESSimpleSearch',
      ],
      awaitRefetchQueries: true,
    });

    setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));
  };

  useEffect(() => {
    if (selectedRow) {
      const filteredSelectedRow = _.pick(selectedRow, Object.keys(initialState));
      const rowData = _.merge({}, initialState, filteredSelectedRow);

      (rowData?.depthFrom === "All depths" && rowData?.depthTo === "All depths") ? rowData.depthBoth = "true" : rowData.depthBoth = "false"
      sideDialogController.updateState(rowData)
      reset(rowData)
    }
  }, [selectedRow]);

  const classes = useStyles();

  return (
    <div className={classes.move}>
      <RightDialog open handleClickDialogClose={handleClickDialogClose} width="500px">
        <Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
          <Grid item md={10} xs={10}>
            <DialogTitle id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
              {selectedRow ? 'Update' : 'Add'} Tract Ownership
            </DialogTitle>
          </Grid>
          <Grid item md={1} xs={1} style={{ marginRight: '30px' }}>
            <IconButton
              size="small"
              component="span"
              style={{
                float: 'right',
              }}
              onClick={handleClickDialogClose}
            >
              <KeyboardTabBlackIcon />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {!formStateValues?.newOwner && <h3 style={{ float: "left" }}>Name</h3>}
              {!selectedRow && (<div className={formStateValues?.newOwner ? classes.addContactButtonSelected : classes.addContactButton}
                onClick={() => {
                  sideDialogController.updateState({ newOwner: !formStateValues?.newOwner })
                }}>
                <PersonAddOutlinedIcon className={formStateValues?.newOwner ? classes.personAddIcon : null} />
                <p>&nbsp;Add new</p>
              </div>)}
              {!formStateValues?.newOwner &&
                <AutocompEntityNamesVirtualizeList
                  mongoEntitiesArray={mongoEntitiesArray}
                  setMongoEntitiesArray={setMongoEntitiesArray}
                  nameAutValue={formStateValues?.name}
                  setNameAutValue={(contact) => {
                    sideDialogController.updateState({ name: contact?.name, ownerEntity: contact?._id, relatedObject: contact?._id })
                  }}
                  nameAutInputValue={nameAutInputValue}
                  setNameAutInputValue={setNameAutInputValue}
                  hasNextPage={hasNextPage}
                  isNextPageLoading={isNextPageLoading}
                  loadNextPage={loadNextPage}
                  disabled={formStateValues?.newOwner}
                  placeholder={"Search existing contact"}
                  addNew
                  addNewOnClick={value => {
                    const contact = { name: value };
                    sideDialogController.updateState({ name: value })
                    addContact({
                      variables: {
                        contact: {
                          ...contact,
                          createBy: getUser?._id,
                          lastUpdateBy: getUser?._id,
                        },
                      },
                      refetchQueries: ['getPaginatedContacts', 'getContact'],
                      awaitRefetchQueries: true,
                    });
                  }}
                />
              }
            </Grid>

            {formStateValues?.newOwner &&
              <>
                {contactSubForm({}).map((item, index) => (
                  <React.Fragment key={index}>
                    {
                      item.renderField === "autoComplete" ? (
                        <AutoCompleteComponent
                          key={index}
                          item={item}
                          control={contactSubFormControl}
                        />
                      ) : (
                        <TextFieldComponent
                          key={index}
                          item={item}
                          control={contactSubFormControl}
                        />
                      )
                    }
                  </React.Fragment>
                ))}
              </>
            }

            {parcelOwnerForm({}).map((item, index) => (
              <React.Fragment key={index}>
                {
                  item.renderField === "autoComplete" ? (
                    <AutoCompleteComponent
                      key={index}
                      item={item}
                      control={parcelOwnerFormControl}
                    />
                  ) : item.renderField === "campaignName" ? (
                    <Grid item xs={12}>
                      <h3>{item.label}</h3>

                      <Controller
                        control={parcelOwnerFormControl}
                        name={item.name}
                        render={props => (
                          <CampaignNameField
                            {...props}
                            value={props?.value}
                            className={classes.maxWidth}
                            onChange={(values, id) => {
                              sideDialogController.updateState({ [item.name]: values })
                              props.onChange(values);
                            }}
                            fullWidth
                            targetLabel="Contact"
                            simpleChips
                          />
                        )}
                      />
                    </Grid>
                  ) : item.renderField === "associatedDeals" ? (
                    <Grid item xs={12}>
                      <h3>{item.label}</h3>

                      <Controller
                        control={parcelOwnerFormControl}
                        name={item.name}
                        render={props => (
                          <AssociatedDealField
                            {...props}
                            className={classes.maxWidth}
                            onChange={(values, id) => {
                              sideDialogController.updateState({ [item.name]: values })
                              props.onChange(values);
                            }}
                            value={props.value}
                            fullWidth
                            targetLabel="Contact"
                            simpleChips
                          />
                        )}
                      />
                    </Grid>
                  ) : item.renderField === "depth_restrictions" ? (
                    <RadioGroup
                      key={index}
                      item={item}
                      control={parcelOwnerFormControl}
                    />
                  ) : (
                    <TextFieldComponent
                      key={index}
                      item={item}
                      control={parcelOwnerFormControl}
                    />
                  )
                }
              </React.Fragment>
            ))}

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
          >
            {selectedRow ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </RightDialog>
    </div>
  );
}
