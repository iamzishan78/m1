import React, { useContext, useState, useEffect } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';

import { useMutation, useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { addTrailingZeros } from 'components/Shared/functions';
import { Controller, useForm } from 'react-hook-form';
import EntityType from 'components/ContactDetailCard/components/FieldContent/EntityType';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import { popupController } from 'hookstate/popupStateController';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { setStateIfDeepEqual } from 'components/Shared/functions';
import { PAGINATEDCONTACTSQUERY } from 'graphQL/useQueryPaginatedContacts';
import AutocompEntityNamesVirtualizeList from 'components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList';
import { showErrorMessage, showSuccessMessage } from '../../../../../../src/actions';
import { UPDATEPARCELOWNER } from 'graphQL/useMutationUpdateParcelOwner';
import { ADDCONTACT } from 'graphQL/useMutationAddContact';
import { ADDOWNERTOAPARCEL } from 'graphQL/useMutationAddOwnerToAParcel';
import { AppContext } from 'AppContext';
import { tableGlobalController } from 'hookstate/tableController';
import { calculateStandardNraForTract } from 'utils/calculatedNraHelper';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const qtrOptions = ['E2', 'NE', 'NW', 'N2', 'SE', 'SW', 'S2', 'W2'];

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

const toNumber = value => (value ? parseInt(value.replace(/\$/g, '').replace(/\,/g, '')) : null);

export default function AddParcelOwnerDialogContent({ selectedRow, setSelectedRow, ...props }) {
  const dispatch = useDispatch();
  const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);
  const calculateOfferPrice = (nra, offer) => {
    return parseFloat((parseFloat(nra || 0) * parseFloat(offer || 0)).toFixed(2));
  };
  const { uUnitPricingNMA, uMaxUnitPricingNMA, uUnitPricing, uMaxUnitPricing } = props?.customLayer?.shapeJson?.properties;
  const tenantName = window.sessionStorage.getItem('tenantName');
  const [stateApp, setStateApp] = useContext(AppContext);
  const { control } = useForm();
  const [newOwner, setNewOwner] = useState({
    surface_interest: null,
    ownerType: null,
    cost_bearing: null,
    cost_bearing_high_value: null,
    cost_free_high_value: null,
    mineral_interest: null,
    royalty_interest: null,
    orri: null,
    unknown_interest: null,
    record_title: null,
    operating_rights: null,
    nri: null,
    net_acres: null,
    company_net_acres: null,
    depthFrom: '',
    depthTo: '',
    nra: null,
    qtr: [null, null, null, null],
    customLayer: props.customLayerId,
    deals: [],
  });
  const [newContact, setNewContact] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mobilePhone: '',
    homePhone: '',
    primaryEmail: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });
  const [isNraOverridden, setIsNRAOverridden] = useState(false);
  const [isAcresOverridden, setIsAcresOverridden] = useState(false);
  const [isOfferPriceOverridden, setIsOfferPriceOverridden] = useState(false);
  const [isMaxOfferPriceOverridden, setIsMaxOfferPriceOverridden] = useState(false);
  const [isOfferPriceNMAOverridden, setIsOfferPriceNMAOverridden] = useState(false);
  const [isMaxOfferPriceNMAOverridden, setIsMaxOfferPriceNMAOverridden] = useState(false);
  const [parcelOwnersRadioBValue, setParcelOwnersRadioBValue] = useState('true');
  const [showAddNewContactFields, setShowAddNewContactFields] = useState(false);

  const [nameAutValue, setNameAutValue] = useState({ name: '', _id: null });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState('');
  const setNameAutInputValue = newState => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(() => {
    if (selectedRow) {
      const {
        cost_bearing,
        cost_bearing_high_value,
        cost_free_high_value,
        surface_interest,
        ownerType,
        mineral_interest,
        royalty_interest,
        orri,
        unknown_interest,
        record_title,
        operating_rights,
        nri,
        depthFrom,
        depthTo,
        company_net_acres,
        net_acres,
        nra,
        customLayer,
        name,
        ownerEntity,
        qtr,
        deals,
        grossAcres,
        max_offer_price,
        offer_price,
        offer_price_nma,
        max_offer_price_nma
      } = selectedRow;
      setNameAutValue({ name, _id: ownerEntity });

      setNewOwner({
        surface_interest: surface_interest ? parseFloat(surface_interest).toFixed(8) : null,
        ownershipType: ownerType || null,
        cost_bearing: cost_bearing || null,
        cost_bearing_high_value: toNumber(cost_bearing_high_value) || null,
        cost_free_high_value: toNumber(cost_free_high_value) || null,
        mineral_interest: mineral_interest ? parseFloat(mineral_interest).toFixed(8) : null,
        royalty_interest: royalty_interest ? parseFloat(royalty_interest).toFixed(8) : null,
        orri: orri ? parseFloat(orri).toFixed(8) : null,
        unknown_interest: unknown_interest || null,
        record_title: record_title || null,
        operating_rights: operating_rights || null,
        nri: nri || null,
        net_acres: net_acres || null,
        company_net_acres: company_net_acres || null,
        nra: nra || null,
        depthFrom: depthFrom || '',
        depthTo: depthTo || '',
        qtr: qtr || [null, null, null, null],
        customLayer,
        deals,
        max_offer_price,
        offer_price,
        offer_price_nma,
        max_offer_price_nma
      });

      const calculatedNRA = calculateStandardNraForTract(
        grossAcres,
        mineral_interest,
        royalty_interest,
        orri,
        workspaceSettings
      );
      if (!isNaN(parseFloat(calculatedNRA)))
        setIsNRAOverridden(
          !isNaN(parseFloat(nra)) && parseFloat(calculatedNRA) !== parseFloat(nra)
        );

      const calculatedAcres = calculateNetAcres(mineral_interest);
      if (!isNaN(parseFloat(calculatedAcres)))
        setIsAcresOverridden(
          !isNaN(parseFloat(net_acres)) &&
          parseFloat(calculatedAcres) !== parseFloat(net_acres)
        );

      if (depthTo === 'All depths' && depthFrom === 'All depths') setParcelOwnersRadioBValue('true');
      else setParcelOwnersRadioBValue('false');
    }
  }, [selectedRow]);

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
    if (get(addContactData, 'addContact.contact')) {
      setNameAutValue({
        name: addContactData.addContact.contact.name,
        _id: addContactData.addContact.contact._id,
      });
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
            nameAutValue && nameAutValue.name
              ? `${nameAutValue.name} was successfully ${type.name}ed`
              : `The owner was successfully ${type.name}ed`
          )
        );

        handleClickDialogClose();
      } else {
        dispatch(showErrorMessage('Error occurred'));
      }

      setStateApp(state => ({
        ...state,
        universalCircularLoaderAct: false,
      }));
      tableGlobalController.refetch()
    }
  }, [mutationData, updateData]);

  const emptyStates = () => {
    setNewOwner({
      surface_interest: null,
      ownershipType: null,
      cost_bearing: null,
      cost_bearing_high_value: null,
      cost_free_high_value: null,
      mineral_interest: null,
      royalty_interest: null,
      orri: null,
      unknown_interest: null,
      record_title: null,
      operating_rights: null,
      company_net_acres: null,
      nri: null,
      net_acres: null,
      depthFrom: '',
      depthTo: '',
      nra: null,
      qtr: [null, null, null, null],
      customLayer: props.customLayerId,
      deals: [],
    });
    setParcelOwnersRadioBValue('true');
    setNameAutValue(null);
    setNameAutInputValue('');
    setSelectedRow && setSelectedRow(null);
  };

  const handleClickDialogClose = () => {
    props.onClose();
    emptyStates();
  };

  const handleClickAdd = e => {
    e.preventDefault();
    if (nameAutValue) {
      const ownerToAdd = { ...newOwner };
      if (ownerToAdd.nra) {
        ownerToAdd.nra = addTrailingZeros(parseFloat(ownerToAdd.nra).toFixed(8));
      }
      if (parcelOwnersRadioBValue === 'true') {
        ownerToAdd.depthFrom = 'All depths';
        ownerToAdd.depthTo = 'All depths';
      }

      if (nameAutValue._id && nameAutValue.name) {
        // now that we are using descriptors we ONLY want the contact _id
        ownerToAdd.ownerEntity = nameAutValue._id;
        ownerToAdd.name = nameAutValue.name;
      }

      if (selectedRow) {
        ownerToAdd._id = selectedRow._id;
        updateParcelOwner({
          variables: {
            parcelOwner: {
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: [
            'getparcelOwners',
            'getContactParcelInterests',
            'getContactParcelInterest',
            'getESSimpleSearch',
          ],
          awaitRefetchQueries: true,
        });
      } else {
        const relatedObject = showAddNewContactFields ? {
          ...ownerToAdd,
          ...newContact,
        } : (ownerToAdd?.ownerEntity._id || ownerToAdd?.ownerEntity);
        addOwnerToAParcel({
          variables: {
            parcelOwner: {
              newOwner: showAddNewContactFields,
              ...ownerToAdd,
              relatedObject,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: [
            'getCustomLayer',
            // causing timing issue since getCustomLayer also calls this query
            'getparcelOwners',
            'getContactParcelInterests',
            'getContactParcelInterest',
            'getESSimpleSearch',
          ],
          awaitRefetchQueries: true,
        });
      }

      setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));
    }
  };

  const selectedParcel = popupController.getValue('selectedParcel');

  const calculateNetAcres = interest => {
    const selectedParcel = popupController.getValue('selectedParcel');
    if (!interest) return null;
    const netAcres = addTrailingZeros(
      selectedParcel?.sdGrossAcres ? (selectedParcel.sdGrossAcres * interest).toFixed(8) : null
    );
    return netAcres;
  };

  const classes = useStyles();
  return (
    <div className={classes.move}>
      <RightDialog open handleClickDialogClose={props.onClose} width="700px">
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
                background: 'transparent',
                align: 'center',
                float: 'right',
              }}
              onClick={props.onClose}
            >
              <KeyboardTabBlackIcon />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h3 style={{ float: "left" }}>Name</h3>
              {!selectedRow && (<div className={showAddNewContactFields ? classes.addContactButtonSelected : classes.addContactButton} onClick={() => setShowAddNewContactFields(!showAddNewContactFields)}>
                <PersonAddOutlinedIcon className={showAddNewContactFields ? classes.personAddIcon : null} />
                <p>&nbsp;Add new</p>
              </div>)}
              <AutocompEntityNamesVirtualizeList
                mongoEntitiesArray={mongoEntitiesArray}
                setMongoEntitiesArray={setMongoEntitiesArray}
                nameAutValue={nameAutValue}
                setNameAutValue={setNameAutValue}
                nameAutInputValue={nameAutInputValue}
                setNameAutInputValue={setNameAutInputValue}
                hasNextPage={hasNextPage}
                isNextPageLoading={isNextPageLoading}
                loadNextPage={loadNextPage}
                disabled={showAddNewContactFields}
                placeholder={"Search existing contact"}
                addNew
                addNewOnClick={value => {
                  const contact = { name: value };
                  addContact({
                    variables: {
                      contact: {
                        ...contact,
                        createBy: stateApp.user.mongoId,
                        lastUpdateBy: stateApp.user.mongoId,
                      },
                    },
                    refetchQueries: ['getPaginatedContacts', 'getContact'],
                    awaitRefetchQueries: true,
                  });
                }}
              />
            </Grid>
            {!showAddNewContactFields &&
              <Grid item xs={12}>
                <h3>Entity Type</h3>
                <Controller
                  control={control}
                  name="ownershipType"
                  render={(props) => (
                    <EntityType
                      className={classes.maxWidth}
                      setDocumentType={(value) => {
                        setNewOwner({
                          ...newOwner,
                          ownerType: value ? addTrailingZeros(value.name) : null,
                        });
                      }}
                      value={newOwner?.ownershipType || newOwner?.ownerType || nameAutValue?.ownerType || ""}
                    />
                  )}
                />
              </Grid>
            }

            {showAddNewContactFields &&
              <>
                <Grid item xs={12}>
                  <h3>First Name</h3>
                  <TextField
                    id="firstName"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.firstName}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        firstName: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Middle Name</h3>
                  <TextField
                    id="middleName"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.middleName}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        middleName: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Last Name</h3>
                  <TextField
                    id="lastName"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.lastName}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        lastName: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Entity Type</h3>
                  <EntityType
                    className={classes.maxWidth}
                    setDocumentType={value => {
                      let val = value.name;
                      const data = contactStatusOptions.find(s => s.label === val);
                      if (data) {
                        val = data.value;
                      }
                      setNewContact({
                        ...newContact,
                        ownerType: val,
                      });
                    }}
                    value={newContact.ownerType ?? ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <h3>Home phone</h3>
                  <TextField
                    id="homePhone"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.homePhone}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        homePhone: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <h3>Mobile Phone</h3>
                  <TextField
                    id="mobilePhone"
                    size="small"
                    // placeholder="E.g. xxx-xxx-xxxx"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.mobilePhone}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        mobilePhone: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Email</h3>
                  <TextField
                    id="email"
                    size="small"
                    // placeholder="E.g. jacob@m1neral.com"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.primaryEmail}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        primaryEmail: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Address #1</h3>
                  <TextField
                    id="address1"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    autoComplete="nope"
                    value={newContact.address1}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        address1: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Address #2</h3>
                  <TextField
                    id="address2"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    autoComplete="nope"
                    value={newContact.address2}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        address2: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>City</h3>
                  <TextField
                    id="city"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.city}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        city: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <h3>State</h3>
                  <TextField
                    id="state"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.state}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        state: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <h3>Zip Code</h3>
                  <TextField
                    id="zipCode"
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newContact.zip}
                    onChange={e => {
                      setNewContact({
                        ...newContact,
                        zip: e.target.value,
                      });
                    }}
                  />
                </Grid>
              </>
            }

            <Grid item xs={12}>
              <h3>Surface Interest</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.surface_interest}
                onChange={e => {
                  const { value } = e.target;
                  setNewOwner({
                    ...newOwner,
                    surface_interest: value ? addTrailingZeros(e.target.value) : null,
                  });
                }}
                onBlur={e => {
                  const value = e.target.value || 0
                  setNewOwner({
                    ...newOwner,
                    surface_interest: parseFloat(value).toFixed(8),
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Mineral Interest</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.mineral_interest}
                onChange={e => {
                  const { value } = e.target;
                  const net_acres = !isAcresOverridden ? calculateNetAcres(value) : newOwner.net_acres;
                  const nra = !isNraOverridden
                    ? calculateStandardNraForTract(selectedParcel?.sdGrossAcres, value, newOwner.royalty_interest, newOwner.orri, workspaceSettings)
                    : newOwner.nra;
                  setNewOwner(newOwner => ({
                    ...newOwner,
                    mineral_interest: value ? addTrailingZeros(value) : null,
                    net_acres,
                    nra,
                  }));
                }}
                onBlur={e => {
                  const value = e.target.value || 0
                  setNewOwner({
                    ...newOwner,
                    mineral_interest: parseFloat(value).toFixed(8),
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Royalty Interest</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.royalty_interest}
                onChange={e => {
                  const { value } = e.target;
                  setNewOwner({
                    ...newOwner,
                    royalty_interest: value ? addTrailingZeros(e.target.value) : null,
                    nra: !isNraOverridden ? calculateStandardNraForTract(selectedParcel?.sdGrossAcres, newOwner.mineral_interest, e.target.value, newOwner.orri, workspaceSettings) : newOwner.nra,
                  });
                }}
                onBlur={e => {
                  const value = e.target.value || 0
                  setNewOwner({
                    ...newOwner,
                    royalty_interest: parseFloat(value).toFixed(8),
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Overriding Royalty Interest (ORRI)</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.orri}
                onChange={e => {
                  const { value } = e.target;
                  setNewOwner({
                    ...newOwner,
                    orri: value ? addTrailingZeros(e.target.value) : null,
                    nra: !isNraOverridden ? calculateStandardNraForTract(selectedParcel?.sdGrossAcres, newOwner.mineral_interest, newOwner.royalty_interest, value, workspaceSettings) : newOwner.nra,
                  });
                }}
                onBlur={e => {
                  const value = e.target.value || 0
                  setNewOwner({
                    ...newOwner,
                    orri: parseFloat(value).toFixed(8),
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <h3>Record Title</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.record_title}
                onChange={e => {
                  const { value } = e.target;
                  setNewOwner({
                    ...newOwner,
                    record_title: value ? addTrailingZeros(e.target.value) : null,
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid> */}
            <Grid item xs={12}>
              <h3>Working Interest</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.operating_rights}
                onChange={e => {
                  const { value } = e.target;
                  setNewOwner({
                    ...newOwner,
                    operating_rights: value ? addTrailingZeros(e.target.value) : null,
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <h3>Net Revenue Interest (NRI)</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.nri}
                onChange={e => {
                  const { value } = e.target;
                  const netAcres = calculateNetAcres(newOwner.mineral_interest);
                  setNewOwner({
                    ...newOwner,
                    nri: value ? addTrailingZeros(e.target.value) : null,
                    nra: !isNraOverridden
                      ? calculateStandardNraForTract(selectedParcel?.sdGrossAcres, newOwner.mineral_interest, newOwner.royalty_interest, newOwner.orri, workspaceSettings)
                      : newOwner.nra,
                  });
                }}
                onBlur={e => {
                  const value = e.target.value || 0
                  setNewOwner({
                    ...newOwner,
                    nri: parseFloat(value).toFixed(8),
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid> */}
            <Grid item xs={12}>
              <h3>Net Acres</h3>
              <TextField
                type="number"
                size="small"
                className={isAcresOverridden ? classes.baseValueChanged : classes.maxWidth}
                value={newOwner.net_acres}
                onChange={e => {
                  const value = addTrailingZeros(e.target.value);
                  const netAcres = calculateNetAcres(newOwner.mineral_interest);
                  setIsAcresOverridden(parseFloat(netAcres) !== parseFloat(value));
                  setNewOwner(newOwner => ({
                    ...newOwner,
                    net_acres: value,
                    nra: !isNraOverridden
                      ? calculateStandardNraForTract(selectedParcel?.sdGrossAcres, newOwner.mineral_interest, newOwner.royalty_interest, newOwner.orri, workspaceSettings)
                      : newOwner.nra,
                    offer_price_nma: calculateOfferPrice(value, uUnitPricingNMA),
                    max_offer_price_nma: calculateOfferPrice(value, uMaxUnitPricingNMA),
                  }));
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isAcresOverridden && (
                        <IconButton
                          aria-label="toggle royality-acres"
                          onClick={() => {
                            const netAcres = calculateNetAcres(newOwner.mineral_interest);
                            setIsAcresOverridden(false);
                            setNewOwner(newOwner => ({
                              ...newOwner,
                              net_acres: netAcres,
                              nra: !isNraOverridden
                                ? calculateStandardNraForTract(selectedParcel?.sdGrossAcres, newOwner.mineral_interest, newOwner.royalty_interest, newOwner.orri, workspaceSettings)
                                : newOwner.nra,
                            }));
                          }}
                        >
                          <AutorenewIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Target Offer Price (per NMA)</h3>

              <Controller
                control={control}
                name="offer_price_nma"
                render={props => (
                  <TextField
                    size="small"
                    value={newOwner?.offer_price_nma}
                    inputRef={props.ref}
                    onWheel={e => e.target.blur()}
                    onChange={e => {
                      const value = parseFloat(e.target.value).toFixed(2);
                      const calculatedOfferPrice = calculateOfferPrice(newOwner?.net_acres, uUnitPricingNMA);
                      setIsOfferPriceNMAOverridden(parseFloat(value) !== parseFloat(calculatedOfferPrice));
                      props.onChange(value);
                      setNewOwner(newOwner => ({
                        ...newOwner,
                        offer_price_nma: value,
                      }));
                    }}
                    className={isOfferPriceNMAOverridden ? classes.baseValueChanged : classes.maxWidth}
                    InputProps={{
                      inputComponent: CurrencyFormatCustom,
                      endAdornment: (
                        <InputAdornment position="end">
                          {isOfferPriceNMAOverridden && (
                            <IconButton
                              aria-label="toggle offer_price_nma"
                              onClick={() => {
                                setIsOfferPriceNMAOverridden(false);
                                setNewOwner(newOwner => ({
                                  ...newOwner,
                                  offer_price_nma: calculateOfferPrice(newOwner?.net_acres, uUnitPricingNMA),
                                }));
                              }}
                            >
                              <AutorenewIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    defaultValue=""
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Max Offer Price (per NMA)</h3>

              <Controller
                control={control}
                name="max_offer_price_nma"
                render={props => (
                  <TextField
                    size="small"
                    value={newOwner?.max_offer_price_nma}
                    inputRef={props.ref}
                    onWheel={e => e.target.blur()}
                    onChange={e => {
                      const value = parseFloat(e.target.value).toFixed(2);
                      const calculatedOfferPrice = calculateOfferPrice(newOwner?.net_acres, uMaxUnitPricingNMA);
                      setIsMaxOfferPriceNMAOverridden(parseFloat(value) !== parseFloat(calculatedOfferPrice));
                      props.onChange(value);
                      setNewOwner(newOwner => ({
                        ...newOwner,
                        max_offer_price_nma: value,
                      }));
                    }}
                    className={isMaxOfferPriceNMAOverridden ? classes.baseValueChanged : classes.maxWidth}
                    InputProps={{
                      inputComponent: CurrencyFormatCustom,
                      endAdornment: (
                        <InputAdornment position="end">
                          {isMaxOfferPriceNMAOverridden && (
                            <IconButton
                              aria-label="toggle max_offer_price_nma"
                              onClick={() => {
                                setIsMaxOfferPriceNMAOverridden(false);
                                setNewOwner(newOwner => ({
                                  ...newOwner,
                                  max_offer_price_nma: calculateOfferPrice(newOwner?.net_acres, uMaxUnitPricingNMA),
                                }));
                              }}
                            >
                              <AutorenewIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    defaultValue=""
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Net Royalty Acres (NRA)</h3>
              <TextField
                id="standard-number"
                type="number"
                size="small"
                className={isNraOverridden ? classes.baseValueChanged : classes.maxWidth}
                value={newOwner.nra}
                onChange={e => {
                  const value = addTrailingZeros(e.target.value);
                  const nra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, newOwner.mineral_interest, newOwner.royalty_interest, newOwner.orri, workspaceSettings);
                  setIsNRAOverridden(parseFloat(nra) !== parseFloat(value));
                  setNewOwner({
                    ...newOwner,
                    nra: value || null,
                    offer_price: calculateOfferPrice(value, uUnitPricing),
                    max_offer_price: calculateOfferPrice(value, uMaxUnitPricing)
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isNraOverridden && (
                        <IconButton
                          aria-label="toggle royality-acres"
                          onClick={() => {
                            const nra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, newOwner.mineral_interest, newOwner.royalty_interest, newOwner.orri, workspaceSettings)
                            setIsNRAOverridden(false);
                            setNewOwner({ ...newOwner, nra });
                          }}
                        >
                          <AutorenewIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Target Offer Price (per NRA)</h3>

              <Controller
                control={control}
                name="offer_price"
                render={props => (
                  <TextField
                    size="small"
                    value={newOwner?.offer_price}
                    inputRef={props.ref}
                    onWheel={e => e.target.blur()}
                    onChange={e => {
                      const value = parseFloat(e.target.value).toFixed(2);
                      const calculatedOfferPrice = calculateOfferPrice(newOwner?.nra, uUnitPricing);
                      setIsOfferPriceOverridden(parseFloat(value) !== parseFloat(calculatedOfferPrice));
                      props.onChange(value);
                      setNewOwner(newOwner => ({
                        ...newOwner,
                        offer_price: value,
                      }));
                    }}
                    className={isOfferPriceOverridden ? classes.baseValueChanged : classes.maxWidth}
                    InputProps={{
                      inputComponent: CurrencyFormatCustom,
                      endAdornment: (
                        <InputAdornment position="end">
                          {isOfferPriceOverridden && (
                            <IconButton
                              aria-label="toggle offer_price"
                              onClick={() => {
                                setIsOfferPriceOverridden(false);
                                setNewOwner(newOwner => ({
                                  ...newOwner,
                                  offer_price: calculateOfferPrice(newOwner?.nra, uUnitPricing),
                                }));
                              }}
                            >
                              <AutorenewIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    defaultValue=""
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Max Offer Price (per NRA)</h3>

              <Controller
                control={control}
                name="max_offer_price"
                render={props => (
                  <TextField
                    size="small"
                    value={newOwner?.max_offer_price}
                    inputRef={props.ref}
                    onWheel={e => e.target.blur()}
                    onChange={e => {
                      const value = parseFloat(e.target.value).toFixed(2);
                      const calculatedOfferPrice = calculateOfferPrice(newOwner?.nra, uMaxUnitPricing);
                      setIsMaxOfferPriceOverridden(parseFloat(value) !== parseFloat(calculatedOfferPrice));
                      props.onChange(value);
                      setNewOwner(newOwner => ({
                        ...newOwner,
                        max_offer_price: value,
                      }));
                    }}
                    className={isMaxOfferPriceOverridden ? classes.baseValueChanged : classes.maxWidth}
                    InputProps={{
                      inputComponent: CurrencyFormatCustom,
                      endAdornment: (
                        <InputAdornment position="end">
                          {isMaxOfferPriceOverridden && (
                            <IconButton
                              aria-label="toggle max_offer_price"
                              onClick={() => {
                                setIsMaxOfferPriceOverridden(false);
                                setNewOwner(newOwner => ({
                                  ...newOwner,
                                  max_offer_price: calculateOfferPrice(newOwner?.nra, uMaxUnitPricing),
                                }));
                              }}
                            >
                              <AutorenewIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    defaultValue=""
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Company Net Acres</h3>
              <TextField
                type="number"
                size="small"
                className={classes.maxWidth}
                value={newOwner.company_net_acres}
                onChange={e => {
                  const { value } = e.target;
                  setNewOwner({
                    ...newOwner,
                    company_net_acres: value ? addTrailingZeros(e.target.value) : null,
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
            {tenantName === 'Providence' && (
              <>
                <Grid item xs={12}>
                  <h3>Cost Bearing</h3>
                  <TextField
                    id="standard-number"
                    type="text"
                    size="small"
                    className={classes.maxWidth}
                    value={newOwner.cost_bearing}
                    onChange={e => {
                      const { value } = e.target;
                      setNewOwner({
                        ...newOwner,
                        cost_bearing: value || null,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Cost Free High Value</h3>
                  <TextField
                    id="standard-number"
                    type="text"
                    size="small"
                    className={classes.maxWidth}
                    value={newOwner.cost_free_high_value}
                    InputProps={{
                      inputComponent: CurrencyFormatCustom,
                    }}
                    onChange={e => {
                      const value = addTrailingZeros(e.target.value);
                      setNewOwner({
                        ...newOwner,
                        cost_free_high_value: Number(value) || null,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Cost Bearing High Value</h3>
                  <TextField
                    id="standard-number"
                    type="text"
                    size="small"
                    className={classes.maxWidth}
                    InputProps={{
                      inputComponent: CurrencyFormatCustom,
                    }}
                    value={newOwner.cost_bearing_high_value}
                    onChange={e => {
                      const value = addTrailingZeros(e.target.value);
                      setNewOwner({
                        ...newOwner,
                        cost_bearing_high_value: Number(value) || null,
                      });
                    }}
                  />
                </Grid>
              </>
            )}
            {props?.customLayer?.state !== 'TX' && (
              <>
                <Grid item xs={3}>
                  <h3>QTR 1</h3>
                  <Autocomplete
                    options={qtrOptions}
                    getOptionLabel={option => option}
                    value={newOwner.qtr[0]}
                    onChange={(e, newInputValue) => {
                      const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                      qtr[0] = newInputValue || '';
                      setNewOwner({
                        ...newOwner,
                        qtr,
                      });
                    }}
                    renderInput={params => (
                      <TextField {...params} size="small" className={classes.maxWidth} multiline />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <h3>QTR 2</h3>
                  <Autocomplete
                    options={qtrOptions}
                    getOptionLabel={option => option}
                    value={newOwner.qtr[1]}
                    onChange={(e, newInputValue) => {
                      const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                      qtr[1] = newInputValue || '';
                      setNewOwner({
                        ...newOwner,
                        qtr,
                      });
                    }}
                    renderInput={params => (
                      <TextField {...params} size="small" className={classes.maxWidth} multiline />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <h3>QTR 3</h3>
                  <Autocomplete
                    options={qtrOptions}
                    getOptionLabel={option => option}
                    value={newOwner.qtr[2]}
                    onChange={(e, newInputValue) => {
                      const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                      qtr[2] = newInputValue || '';
                      setNewOwner({
                        ...newOwner,
                        qtr,
                      });
                    }}
                    renderInput={params => (
                      <TextField {...params} size="small" className={classes.maxWidth} multiline />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <h3>QTR 4</h3>
                  <Autocomplete
                    options={qtrOptions}
                    getOptionLabel={option => option}
                    value={newOwner.qtr[3]}
                    onChange={(e, newInputValue) => {
                      const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                      qtr[3] = newInputValue || '';
                      setNewOwner({
                        ...newOwner,
                        qtr,
                      });
                    }}
                    renderInput={params => (
                      <TextField {...params} size="small" className={classes.maxWidth} multiline />
                    )}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <h3>Depth Restrictions</h3>
              <RadioGroup
                row
                value={parcelOwnersRadioBValue}
                onChange={event => {
                  setParcelOwnersRadioBValue(event.target.value);
                }}
              >
                <FormControlLabel value="true" control={<Radio />} label="All Depths" />
                <FormControlLabel value="false" control={<Radio />} label="Footages/Formations" />
              </RadioGroup>
            </Grid>

            {parcelOwnersRadioBValue === 'false' && (
              <Grid item xs={12}>
                <h3>Depth From</h3>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  multiline
                  value={newOwner.depthFrom}
                  onChange={e => {
                    setNewOwner({
                      ...newOwner,
                      depthFrom: e.target.value,
                    });
                  }}
                />
              </Grid>
            )}
            {parcelOwnersRadioBValue === 'false' && (
              <Grid item xs={12}>
                <h3>Depth To</h3>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  multiline
                  value={newOwner.depthTo}
                  onChange={e => {
                    setNewOwner({
                      ...newOwner,
                      depthTo: e.target.value,
                    });
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <h3>Associated Deals</h3>

              <Controller
                control={control}
                name="deals"
                render={params => (
                  <AssociatedDealField
                    {...params}
                    className={classes.maxWidth}
                    onChange={(values, id) => {
                      setNewOwner({
                        ...newOwner,
                        deals: values || [],
                      });
                      params.onChange(values);
                    }}
                    value={newOwner?.deals}
                    fullWidth
                    targetLabel="Contact"
                    simpleChips
                  />
                )}
              />
            </Grid>
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
            disabled={((!nameAutValue || !nameAutValue.name || nameAutValue.name === '') && !showAddNewContactFields) ? true : false}
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
