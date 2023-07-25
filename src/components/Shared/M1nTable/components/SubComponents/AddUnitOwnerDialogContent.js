import React, { useContext, useState, useEffect } from "react";
import { get } from "lodash";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { CircularProgress,Grid, Dialog, OutlinedInput, InputAdornment, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteIcon from "@material-ui/icons/Delete";
import { UPDATECONTACT } from "graphQL/useMutationUpdateContact";

import { AppContext } from "AppContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADD_OWNER_TOA_SHAPE } from "graphQL/useMutationAddOwnerToAShape";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "actions";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import { addTrailingZeros } from "components/Shared/functions";
import { Controller, useForm } from "react-hook-form";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";
import { CurrencyFormatCustom } from "components/Shared/Forms/Formatting/CurrencyFormatCustom";
import ContactStatus from 'components/ContactDetailCard/components/AutoCompleteWithAddNew';
import EntityType from "components/ContactDetailCard/components/FieldContent/EntityType";
import { contactStatusOptions } from "components/ContactDetailedInfo/helper";
import CampaignNameField from "components/ContactDetailCard/components/FieldContent/CampaignNameField";
import AssociatedDealField from "components/ContactDetailCard/components/FieldContent/AssociatedDealField";
import DeleteConfirmationDialogContent from "./DeleteConfirmationDialogContent";
import KeyboardTabBlackIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import { Status } from "components/ContactDetailCard/components/FieldContent";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

const useStyles = makeStyles((theme) => ({
  maxWidth: {
    width: "100%",
  },
  dialogContent: {
    "& header": {
      position: "absolute",
      left: "0",
      top: "55px",
    },
  },
  primary: {
    color: "black",
    backgroundColor: "#E0E0E0",
  },
  secondary: {
    color: "white",
    backgroundColor: "#26ACD8",
  },
  dialogAction: {
    "& .Mui-disabled": {
      backgroundColor: "transparent",
    },
  },
  move: {
    zIndex: 10000,
  },
  baseValueChanged: {
    width: "100%",
    "& .MuiInputBase-input": {
      color: "dodgerblue",
      fontWeight: "bold",
    },
  },
}));

export default function AddUnitOwnerDialogContent({ selectedRow, setSelectedRow, uAcres, uUnitPricing, ...props }) {
  const dispatch = useDispatch();
  const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);
  const [stateApp, setStateApp] = useContext(AppContext);
  const { control, reset, setValue, getValues, watch } = useForm();
  const [isNraOverridden, setIsNRAOverridden] = useState(false);
  const [isOfferPriceOverridden, setIsOfferPriceOverridden] = useState(false)
  const [statusOptions, setStatusOptions] = useState([]);
  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
  const [ownerTypeOfConctact, setOwnerTypeOfConctact] = useState();
  const [anchorEl, setAnchorEl] = useState();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const watchedNra = watch('nra')

  const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    getFilters({
      variables: {
        esIndex: "contacts_flat",
        filterKey: "status.keyword",
        size: 50,
      },
    });
  }, [])

  useEffect(() => {
    if (selectedRow) {
      const {
        working_interest,
        royalty_interest,
        orri,
        nri,
        nra,
        seller_asking_price,
        competitor_offer_price,
        offer_price,
        customLayer,
        name,
        ownerEntity,
        contactStatus,
        ownerType,
        contact,
        deals
      } = selectedRow;
      setNameAutValue({ name, _id: ownerEntity });
      const owner = {
        working_interest: working_interest || null,
        royalty_interest: royalty_interest || null,
        orri: orri || null,
        nri: nri || null,
        nra: nra || null,
        seller_asking_price: seller_asking_price || null,
        competitor_offer_price: competitor_offer_price || null,
        offer_price: parseFloat(parseFloat(offer_price).toFixed(2)) || null,
        contactStatus: contactStatus || contact.contactStatus,
        ownerType,
        customLayer,
        campaignName: contact.campaignName,
        deals
      }
      let calculatedNRA = calculateNRA(royalty_interest, orri, nri);
      let calculatedOfferPrice = calculateOfferPrice(nra)
      if (!isNaN(parseFloat(calculatedNRA)))
        setIsNRAOverridden(calculatedNRA !== nra && !isNaN(parseFloat(nra)))

      if (!isNaN(parseFloat(calculatedOfferPrice)))
        setIsOfferPriceOverridden(calculatedOfferPrice !== owner.offer_price && !isNaN(parseFloat(offer_price)))

      reset(owner);
    }
  }, [selectedRow]);

  useEffect(() => {
    if (filtersData?.getESFilterList?.hits) {
      const allFiltersData = filtersData.getESFilterList.hits.map((hit) => hit.key);
      let filterData = filtersData.getESFilterList.hits.map((hit) => hit.key);
      for (let i = 0; i < contactStatusOptions.length; i++) {
        filterData = filterData.filter((d) => d !== contactStatusOptions[i].value && d !== contactStatusOptions[i].label);
      }
      for (let i = 0; i < contactStatusOptions.length; i++) {
        if (
          (contactStatusOptions[i].notInclude && allFiltersData.find((d) => d === contactStatusOptions[i].value)) ||
          !contactStatusOptions[i].notInclude
        ) {
          filterData.push(contactStatusOptions[i].label);
        }
      }
      setStatusOptions(filterData);
    }
  }, [filtersData]);

  // CONTACT

  const [addOwnerToAShape, { data: mutationData }] = useMutation(ADD_OWNER_TOA_SHAPE);

  const [updateShapeOwners, { data: updateData }] = useMutation(UPDATE_SHAPE_OWNERS);

  const [updateContact] = useMutation(UPDATECONTACT);

  useEffect(() => {
    let type = null;
    if (mutationData && mutationData.addOwnerToAShape) {
      type = { name: "add", success: mutationData.addOwnerToAShape.success };
    } else if (updateData && updateData.updateShapeOwners) {
      type = { name: "update", success: updateData.updateShapeOwners.success };
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
        dispatch(showErrorMessage("Error occurred"));
      }

      setStateApp((state) => ({
        ...state,
        universalCircularLoaderAct: false,
      }));
    }
  }, [mutationData, updateData]);

  useEffect(() => {
    if (nameAutValue) {
      if (nameAutValue.contactStatus) {
        setValue('contactStatus', nameAutValue.contactStatus)
      }
    }
  }, [nameAutValue])

  useEffect(() => {
    if (!isOfferPriceOverridden && getValues().nra) setValue("offer_price", calculateOfferPrice(getValues().nra));
  }, [watchedNra])

  const emptyStates = () => {
    setNameAutValue(null);
    // setSelectedRow(null);
  };

  const handleClickDialogClose = () => {
    props.onClose();
    emptyStates();
  };

  const handleAddUpdate = (ownerToAdd) => {
    if (ownerToAdd.nra) {
      ownerToAdd.nra = addTrailingZeros(parseFloat(ownerToAdd.nra).toFixed(8));
    }

    if (selectedRow) {
      ownerToAdd._id = selectedRow._id;
      updateShapeOwners({
        variables: {
          shapeType: props.shapeType,
          shapeOwners: [
            {
              shapeId: props.shapeId ?? get(selectedRow, "customLayer._id"),
              relatedObject: ownerToAdd.ownerEntity._id || ownerToAdd.ownerEntity,
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          ],
        },
        refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList", "getCustomLayer"],
        awaitRefetchQueries: true,
      });
    } else {
      addOwnerToAShape({
        variables: {
          shapeType: props.shapeType,
          shapeOwner: {
            shapeId: props.shapeId ?? get(selectedRow, "customLayer._id"),
            relatedObject: ownerToAdd.ownerEntity._id || ownerToAdd.ownerEntity,
            ...ownerToAdd,
            createBy: stateApp.user.mongoId,
            lastUpdateBy: stateApp.user.mongoId,
          },
        },
        refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList", "getCustomLayer"],
        awaitRefetchQueries: true,
      });
    }

    setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
  }

  const handleClickAdd = (e) => {
    e.preventDefault();
    if (nameAutValue) {
      const ownerToAdd = { ...getValues() };
      // if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
      // else ownerToAdd.ownerEntity = nameAutValue._id;

      Object.keys(ownerToAdd).forEach((key) => {
        if (["working_interest", "royalty_interest", "orri", "nri", "nra"].includes(key))
          ownerToAdd[key] = addTrailingZeros(ownerToAdd[key]);
      });
      if (nameAutValue._id && nameAutValue.name) {
        // now that we are using descriptors we ONLY want the contact _id
        ownerToAdd.ownerEntity = nameAutValue._id;
        ownerToAdd.name = nameAutValue.name;
      }

      if ((ownerToAdd.contactStatus && selectedRow?.contactStatus !== ownerToAdd.contactStatus) ||
        (ownerToAdd.ownerType && selectedRow?.ownerType !== ownerToAdd.ownerType) ||
        (ownerToAdd.campaignName && selectedRow?.campaignName !== ownerToAdd.campaignName)
      ) {
        updateContact({
          variables: {
            contact: {
              _id: ownerToAdd.ownerEntity._id || ownerToAdd.ownerEntity,
              contactStatus: ownerToAdd.contactStatus,
              lastUpdateBy: stateApp.user.mongoId,
              ownerType: ownerToAdd.ownerType,
              campaignName: ownerToAdd.campaignName
            }
          }
        })
      }
      handleAddUpdate(ownerToAdd);
    }
  };

  const calculateNRA = (interest1, interest2, interest3, unitAcres = uAcres) => {
    if (!interest3 && (!interest1 && !interest2)) return null;

    let nra = parseFloat(unitAcres || 0) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0));

    if (interest3) nra = parseFloat(interest3 || 0) * parseFloat(unitAcres || 0)

    if (workspaceSettings.settings?.map?.unitNra?.type === "custom" && workspaceSettings.settings?.map?.unitNra?.value)
      nra = nra / Number(workspaceSettings.settings?.map?.unitNra?.value);

    nra = addTrailingZeros(nra.toFixed(8));
    return nra;
  };

  const calculateOfferPrice = (nra) => {
    return parseFloat((parseFloat(nra || 0) * parseFloat(uUnitPricing || 0)).toFixed(2));
  };

  

  const openConfirmationDialog = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const deleteFunc = () => {
    setLoading(true);
      updateShapeOwners({
        variables: {
          shapeType: props.shapeType,
          shapeOwners: { _id:selectedRow?._id, isDeleted: true },
        },
        refetchQueries: ["getESSimpleSearch", "getCustomLayer"],
        awaitRefetchQueries: true,
      }).finally(()=>{
        setLoading(false);
      });
    
  };
  const classes = useStyles();
  return (
    <div className={classes.move}>
      {deleteDialogOpen && (
        <Dialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete Interest Owner`}
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Do you want to delete the selected interest owner?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
      <React.Fragment>
        <RightDialog open={true} handleClickDialogClose={props.onClose} width={"450px"}>
          <Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
            <Grid item md={10} xs={10}>
              <DialogTitle id="customized-dialog-title" style={{ fontWeight: "bold" }}>
                {selectedRow ? "Update" : "Add"} Unit Ownership
              </DialogTitle>
            </Grid>
            {/* <Grid item md={1} xs={1} style={{ marginLeft: "20px" }}>
              <IconButton
                size="small"
                component="span"
                style={{
                  background: "transparent",
                  align: "center",
                  float: "right",
                }}
                onClick={props.onClose}
              >
                <KeyboardTabBlackIcon />
              </IconButton>
            </Grid> */}
            <Grid item md={1} xs={1} style={{ marginLeft: "20px" }}>
            <div style={{ "float": "right",display:'flex',marginRight:'10px' }}>
                <>
                  <IconButton
                    disabled={loading}
                    size="small"
                    style={{ margin: "0 8px" }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                      <MoreHorizIcon size="medium" onClick={handleMenuClick} />
                    )}
                  </IconButton>
                  <Menu
                    id="dealMenu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    className={classes.menu}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <MenuItem 
                      onClick={openConfirmationDialog}
                    >
                      <ListItemIcon>
                        <DeleteIcon size="medium" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
                <IconButton
                size="small"
                component="span"
                style={{
                  background: "transparent",
                  align: "center",
                  float: "right",
                }}
                onClick={props.onClose}
              >
                <KeyboardTabBlackIcon />
              </IconButton>
            </div>
          </Grid>
          </Grid>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>Name</h3>
                <AutocompEntityNamesList userId={stateApp.user.mongoId} setOwnerTypeOfConctact={setOwnerTypeOfConctact} nameAutValue={nameAutValue} setNameAutValue={setNameAutValue} />
              </Grid>
              <Grid item xs={12}>
                <h3>Entity Type</h3>
                <Controller
                  control={control}
                  name="ownerType"
                  render={(props) => (
                    <EntityType
                      className={classes.maxWidth}
                      setDocumentType={(value) => {
                        let val = value.name
                        const data = contactStatusOptions.find(s => s.label === val)
                        if (data) {
                          val = data.value
                        }
                        setValue('ownerType', val);
                      }}
                      value={ownerTypeOfConctact ?? ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Working Interest</h3>

                <Controller
                  control={control}
                  name="working_interest"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Royalty Interest</h3>
                <Controller
                  control={control}
                  name="royalty_interest"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        if (!isNraOverridden) setValue("nra", calculateNRA(e.target.value, getValues().orri, getValues().nri));
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Overriding Royalty Interest (ORRI)</h3>
                <Controller
                  control={control}
                  name="orri"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        if (!isNraOverridden) { setValue("nra", calculateNRA(getValues().royalty_interest, e.target.value, getValues().nri)); }
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Net Revenue Interest (NRI)</h3>

                <Controller
                  control={control}
                  name="nri"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        if (!isNraOverridden) { setValue("nra", calculateNRA(getValues().royalty_interest, getValues().orri, e.target.value)); }
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />

                {/* <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.nri}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      nri: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                  onWheel={(e) => e.target.blur()}
                /> */}
              </Grid>
              <Grid item xs={12}>
                <h3>Net Royalty Acres (NRA)</h3>
                <Controller
                  control={control}
                  name="nra"
                  render={(params) => (
                    <TextField
                      size="small"
                      type="number"
                      value={params.value}
                      inputRef={params.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        const value = addTrailingZeros(e.target.value);
                        const nra = calculateNRA(getValues().royalty_interest, getValues().orri, getValues().nri)
                        setIsNRAOverridden(parseFloat(value) !== parseFloat(nra))
                        params.onChange(e.target.value);
                      }}
                      className={isNraOverridden ? classes.baseValueChanged : classes.maxWidth}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {isNraOverridden && (
                              <IconButton
                                aria-label="toggle royality-acres"
                                onClick={() => {
                                  setIsNRAOverridden(false)
                                  setValue("nra", calculateNRA(getValues().royalty_interest, getValues().orri, getValues().nri));
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
                <h3>Seller Asking Price</h3>

                <Controller
                  control={control}
                  name="seller_asking_price"
                  render={(props) => (
                    <TextField
                      size="small"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      InputProps={{
                        inputComponent: CurrencyFormatCustom,
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Competitor Offer Price</h3>
                <Controller
                  control={control}
                  name="competitor_offer_price"
                  render={(props) => (
                    <TextField
                      size="small"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      InputProps={{
                        inputComponent: CurrencyFormatCustom,
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Offer Price</h3>

                <Controller
                  control={control}
                  name="offer_price"
                  render={(props) => (
                    <TextField
                      size="small"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value).toFixed(2)
                        const calculatedOfferPrice = calculateOfferPrice(getValues().nra)
                        setIsOfferPriceOverridden(parseFloat(value) !== parseFloat(calculatedOfferPrice))
                        props.onChange(value);
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
                                  setIsOfferPriceOverridden(false)
                                  setValue("offer_price", calculateOfferPrice(getValues().nra));
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
                <h3>Status</h3>

                <Controller
                  control={control}
                  defaultValue={''}
                  name="contactStatus"
                  render={(props) => (
                    <ContactStatus
                      className={classes.maxWidth}
                      setValue={(value) => {
                        let val = value.name
                        props.onChange(val);
                      }}
                      value={props.value ? props.value : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Stage</h3>

                <Controller
                  control={control}
                  defaultValue={''}
                  name="contactStatus"
                  render={(props) => (
                    <Status
                        className={classes.maxWidth}
                        options={statusOptions}
                        setDocumentType={(value) => {
                          let val = value.name;
                          const data = contactStatusOptions.find((s) => s.label === val);
                          if (data) {
                            val = data.value;
                          }
                          props.onChange(val)
                        }}
                        {...props}
                      />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Campaign Names</h3>

                <Controller
                  control={control}
                  defaultValue={''}
                  name="campaignName"
                  render={(params) => (
                    <CampaignNameField
                      {...params}
                      className={classes.maxWidth}
                      onChange={(values, id) => {
                        params.onChange(values);
                      }}
                      fullWidth
                      targetLabel="Contact"
                      simpleChips
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Associated Deals</h3>

                <Controller
                  control={control}
                  name="deals"
                  render={(params) => (
                    <AssociatedDealField
                      {...params}
                      className={classes.maxWidth}
                      onChange={(values, id) => {
                        params.onChange(values);
                      }}
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
            <Button className={classes.primary} onClick={handleClickDialogClose} color="primary" style={{ marginBottom: "40px" }}>
              Cancel
            </Button>
            <Button
              className={classes.secondary}
              disabled={!nameAutValue || !nameAutValue.name || nameAutValue.name === "" ? true : false}
              onClick={handleClickAdd}
              color="secondary"
              style={{ marginBottom: "40px", marginRight: "20px" }}
            >
              {selectedRow ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </RightDialog>
      </React.Fragment>
    </div>
  );
}
