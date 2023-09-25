import React, { useContext, useState, useEffect } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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
import { popupState } from 'hookstate/popupStateController';
import RightDialog from '../../../../ContactDetailCard/components/RightDialog';
import { setStateIfDeepEqual } from '../../../functions';
import { PAGINATEDCONTACTSQUERY } from '../../../../../graphQL/useQueryPaginatedContacts';
import AutocompEntityNamesVirtualizeList from './AutocompEntityNamesVirtualizeList';
import { showErrorMessage, showSuccessMessage } from '../../../../../actions';
import { UPDATEPARCELOWNER } from '../../../../../graphQL/useMutationUpdateParcelOwner';
import { ADDCONTACT } from '../../../../../graphQL/useMutationAddContact';
import { ADDOWNERTOAPARCEL } from '../../../../../graphQL/useMutationAddOwnerToAParcel';
import { Modals } from '../../../../../styles/Modal';
import { AppContext } from '../../../../../AppContext';
import { tableGlobalController } from 'hookstate/tableController';

const entities = [
  'Corporation',
  'Educational Institution',
  'Governmental Body',
  'Individual',
  'Non Profit',
  'Religious Institution',
  'Trust',
  'Unknown',
];
const types = [
  'Fee Interest',
  'Leasehold',
  'Mineral Interest',
  'Non-Executive Mineral Interest (NEMI)',
  'Overriding Royalty (ORRI)',
  'Royalty Interest (NPRI)',
  'Surface Rights',
  'Unknown',
  'Working Interest',
];

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
}));

const toNumber = value => (value ? parseInt(value.replace(/\$/g, '').replace(/\,/g, '')) : null);

export default function AddParcelOwnerDialogContent({ selectedRow, setSelectedRow, ...props }) {
  const dispatch = useDispatch();
  const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);

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
  const [isNraOverridden, setIsNRAOverridden] = useState(false);
  const [isAcresOverridden, setIsAcresOverridden] = useState(false);
  const [parcelOwnersRadioBValue, setParcelOwnersRadioBValue] = useState('true');

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
        ownershipType,
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
      } = selectedRow;
      setNameAutValue({ name, _id: ownerEntity });

      setNewOwner({
        surface_interest: surface_interest || null,
        ownershipType: ownershipType || null,
        cost_bearing: cost_bearing || null,
        cost_bearing_high_value: toNumber(cost_bearing_high_value) || null,
        cost_free_high_value: toNumber(cost_free_high_value) || null,
        mineral_interest: mineral_interest || null,
        royalty_interest: royalty_interest || null,
        orri: orri || null,
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
      });

      const calculatedNRA = calculateNRA(royalty_interest, orri, nri, net_acres, grossAcres);
      if (!isNaN(parseFloat(calculatedNRA))) setIsNRAOverridden(calculatedNRA !== nra && !isNaN(parseFloat(nra)));

      const calculatedAcres = calculateNetAcres(mineral_interest);
      if (!isNaN(parseFloat(calculatedAcres)))
        setIsAcresOverridden(calculatedAcres !== net_acres && !isNaN(parseFloat(net_acres)));

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
      // if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
      // else ownerToAdd.ownerEntity = nameAutValue._id;
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
        addOwnerToAParcel({
          variables: {
            parcelOwner: {
              ...ownerToAdd,
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

  const selectedParcel = popupState?.selectedParcel?.get({ noproxy: true });

  const calculateNetAcres = interest => {
    if (!interest) return null;
    const netAcres = addTrailingZeros(
      selectedParcel?.sdGrossAcres ? (selectedParcel.sdGrossAcres * interest).toFixed(8) : null
    );
    return netAcres;
  };

  const calculateNRA = (
    interest1,
    interest2,
    interest3,
    net_acres = newOwner.net_acres,
    gross_acers = selectedParcel?.sdGrossAcres
  ) => {
    if (!interest3 && !interest1 && !interest2) return null;

    let nra = parseFloat(net_acres || 0) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) * 8;

    if (interest3) nra = parseFloat(interest3 || 0) * parseFloat(gross_acers || 0);

    if (
      workspaceSettings.settings?.map?.unitNra?.type === 'custom' &&
      workspaceSettings.settings?.map?.unitNra?.value
    ) {
      nra /= Number(workspaceSettings.settings?.map?.unitNra?.value);
    }

    nra = addTrailingZeros(nra.toFixed(8));
    return nra;
  };

  const classes = useStyles();
  return (
    <div className={classes.move}>
      <RightDialog open handleClickDialogClose={props.onClose} width="700px">
        <Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
          <Grid item md={10} xs={10}>
            <DialogTitle id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
              {selectedRow ? 'Update' : 'Add'} Tract Ownership
              {/* {selectedRow && (
              <IconButton
                style={{ float: "right", marginRight: "5px" }}
                onClick={() => {
                  props.setM1nSelectedRowsIds([selectedRow._id]);
                  props.handleExpandClick(null, null, null, "deleteParcelOwnership");
                }}
                className={modalClass.titleClose}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )} */}
            </DialogTitle>
          </Grid>
          <Grid item md={1} xs={1} style={{ marginLeft: '20px' }}>
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
              <h3>Name</h3>

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
            <Grid item xs={12}>
              <h3>Entity Type</h3>
              <Controller
                control={control}
                name="ownershipType"
                render={props => (
                  <EntityType
                    className={classes.maxWidth}
                    setDocumentType={value => {
                      setNewOwner({
                        ...newOwner,
                        ownerType: value ? addTrailingZeros(value.name) : null,
                      });
                    }}
                    value={newOwner.ownershipType || ''}
                  />
                )}
              />
            </Grid>
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
                    ? calculateNRA(newOwner.royalty_interest, newOwner.orri, newOwner.nri, net_acres)
                    : newOwner.nra;
                  setNewOwner(newOwner => ({
                    ...newOwner,
                    mineral_interest: value ? addTrailingZeros(value) : null,
                    net_acres,
                    nra,
                  }));
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
                    nra: !isNraOverridden ? calculateNRA(value, newOwner.orri, newOwner.nri) : newOwner.nra,
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
                    nra: !isNraOverridden ? calculateNRA(value, newOwner.royalty_interest, newOwner.nri) : newOwner.nra,
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
            {/* <Grid item xs={12}>
                <h3>Unknown Interest</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.unknown_interest}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      unknown_interest: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </Grid> */}
            <Grid item xs={12}>
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
            </Grid>
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
            <Grid item xs={12}>
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
                      ? calculateNRA(newOwner.orri, newOwner.royalty_interest, value, netAcres)
                      : newOwner.nra,
                  });
                }}
                onWheel={e => e.target.blur()}
              />
            </Grid>
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
                      ? calculateNRA(newOwner.orri, newOwner.royalty_interest, newOwner.nri, value)
                      : newOwner.nra,
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
                                ? calculateNRA(newOwner.orri, newOwner.royalty_interest, newOwner.nri, netAcres)
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
                  const nra = calculateNRA(newOwner.royalty_interest, newOwner.orri, newOwner.nri);
                  setIsNRAOverridden(parseFloat(nra) !== parseFloat(value));
                  setNewOwner({
                    ...newOwner,
                    nra: value || null,
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isNraOverridden && (
                        <IconButton
                          aria-label="toggle royality-acres"
                          onClick={() => {
                            const nra = calculateNRA(newOwner.royalty_interest, newOwner.orri, newOwner.nri);
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
            disabled={!!(!nameAutValue || !nameAutValue.name || nameAutValue.name === '')}
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
