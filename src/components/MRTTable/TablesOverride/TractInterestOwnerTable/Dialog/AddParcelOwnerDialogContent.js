import React, { useContext, useState, useEffect } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';

import { useMutation, useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { addTrailingZeros } from 'components/Shared/functions';
import { Controller, useForm } from 'react-hook-form';
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
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import contactSubForm from 'components/Shared/FormsFieldsData/FormsJson/ParcelDetailInterestOwner/contactSubForm';
import TextFieldComponent from 'components/Shared/FormsFieldsData/Fields/TextField';
import AutoCompleteComponent from 'components/Shared/FormsFieldsData/Fields/AutoComplete';
import parcelOwnerForm from 'components/Shared/FormsFieldsData/FormsJson/ParcelDetailInterestOwner/parcelOwnerForm';
import { sideDialogController } from 'hookstate/sideDialogController';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';

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
  const [stateApp, setStateApp] = useContext(AppContext);
  const { control: contactSubFormControl, watch } = useForm();
  const { control: parcelOwnerFormControl } = useForm();
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
  const [leaseStatusList, setLeaseStatusList] = useState([]);
  const [isAcresOverridden, setIsAcresOverridden] = useState(false);
  const [isOfferPriceOverridden, setIsOfferPriceOverridden] = useState(false);
  const [isMaxOfferPriceOverridden, setIsMaxOfferPriceOverridden] = useState(false);
  const [isOfferPriceNMAOverridden, setIsOfferPriceNMAOverridden] = useState(false);
  const [isMaxOfferPriceNMAOverridden, setIsMaxOfferPriceNMAOverridden] = useState(false);
  const [parcelOwnersRadioBValue, setParcelOwnersRadioBValue] = useState('true');
  const [showAddNewContactFields, setShowAddNewContactFields] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);

  const [nameAutValue, setNameAutValue] = useState({ name: '', _id: null });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState('');
  const setNameAutInputValue = newState => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const formValues = watch();

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
        contact,
        max_offer_price_nma,
        nonExecRightsOnly,
        leaseStatus,
        campaignPriority,
        campaignName,
        seller_asking_price,
        competitor_offer_price,
        actual_offer_price

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
        seller_asking_price: seller_asking_price || null,
        competitor_offer_price: competitor_offer_price || null,
        actual_offer_price: actual_offer_price || null,
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
        nonExecRightsOnly,
        leaseStatus,
        customLayer,
        campaignPriority,
        campaignName,
        deals,
        status: contact?.status,
        contactStatus: contact?.contactStatus,
        max_offer_price: parseFloat(parseFloat(max_offer_price)?.toFixed(2)),
        offer_price: parseFloat(parseFloat(offer_price)?.toFixed(2)),
        offer_price_nma: parseFloat(parseFloat(offer_price_nma)?.toFixed(2)),
        max_offer_price_nma: parseFloat(parseFloat(max_offer_price_nma)?.toFixed(2))
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

      let calculatedOfferPrice = calculateOfferPrice(nra, uUnitPricing);
      let calculatedMaxOfferPrice = calculateOfferPrice(nra, uMaxUnitPricing);
      let calculatedOfferPriceNMA = calculateOfferPrice(net_acres, uUnitPricingNMA);
      let calculatedMaxOfferPriceNMA = calculateOfferPrice(net_acres, uMaxUnitPricingNMA);
      if (!isNaN(parseFloat(calculatedOfferPrice)))
        setIsOfferPriceOverridden(calculatedOfferPrice !== parseFloat(parseFloat(offer_price).toFixed(2)) && !isNaN(parseFloat(offer_price)));
      if (!isNaN(parseFloat(calculatedMaxOfferPrice)))
        setIsMaxOfferPriceOverridden(calculatedMaxOfferPrice !== parseFloat(parseFloat(max_offer_price).toFixed(2)) && !isNaN(parseFloat(max_offer_price)));
      if (!isNaN(parseFloat(calculatedOfferPriceNMA)))
        setIsOfferPriceNMAOverridden(calculatedOfferPriceNMA !== parseFloat(parseFloat(offer_price_nma).toFixed(2)) && !isNaN(parseFloat(offer_price_nma)));
      if (!isNaN(parseFloat(calculatedMaxOfferPriceNMA)))
        setIsMaxOfferPriceNMAOverridden(calculatedMaxOfferPriceNMA !== parseFloat(parseFloat(max_offer_price_nma).toFixed(2)) && !isNaN(parseFloat(max_offer_price_nma)));
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
            'getCustomLayer'
          ],
          awaitRefetchQueries: true,
        });
      } else {
        const relatedObject = showAddNewContactFields ? {
          ...ownerToAdd,
          ...formValues,
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

  const tableState = sideDialogController.useCompleteState();
  const tableStateValues = tableState?.get({ noproxy: true });

  // console.log('tableStateValues', tableStateValues)

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
              {!showAddNewContactFields && <h3 style={{ float: "left" }}>Name</h3>}
              {!selectedRow && (<div className={showAddNewContactFields ? classes.addContactButtonSelected : classes.addContactButton} onClick={() => setShowAddNewContactFields(!showAddNewContactFields)}>
                <PersonAddOutlinedIcon className={showAddNewContactFields ? classes.personAddIcon : null} />
                <p>&nbsp;Add new</p>
              </div>)}
              {!showAddNewContactFields &&
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
              }
            </Grid>

            {showAddNewContactFields &&
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
