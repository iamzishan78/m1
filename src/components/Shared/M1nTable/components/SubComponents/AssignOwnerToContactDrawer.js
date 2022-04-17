import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Container, Box, CircularProgress, InputAdornment, IconButton } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from "@material-ui/icons/Search";

import CloseSharp from "@material-ui/icons/CloseSharp";
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import Typography from "@material-ui/core/Typography";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { AppContext } from "AppContext";
import { ASSIGN_OWNER_TO_CONTACT } from "graphQL/useMutationAssignOwnerToContact";
import ContactAutoComplete from "components/Shared/ContactAutoComplete";
import FieldBulkAutoComplete from "components/Shared/FieldBulkAutoComplete";
import Loader from "components/Loaders";
import TextField from "@material-ui/core/TextField";
import { UPDATEBULKCONTACT } from "graphQL/useMutationUpdateBulkContact";
import AutoCompleteWithAddNew from "components/Shared/AutoCompleteWithAddNew";



const styles = () => ({
  topHeading: { fontWeight: "bold" },
  loading: { position: "absolute", left: "250px", bottom: "148px", zIndex: "150" },
});

const useStyles = makeStyles(styles);

export default function MultipleOwnerToContactDrawer({ onClose, rows, setRows, setM1nSelectedRowsIndexes, getContactCampaignAction, campaignList }) {
  const [stateApp] = React.useContext(AppContext);
  const classes = useStyles();
  const [contactOwner, setContactOwner] = useState('');
  const [field, setField] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const fieldsToUpdate = [
    { title: 'Campaign Name', value: "campaignName" },
    { title: 'Contact Owner', value: "contactOwner" },
    { title: 'Stage', value: "status" },
    { title: 'Status', value: "contactStatus" },
    { title: 'Entity Type', value: "ownerType" },
  ];

  useEffect(() => {
    getContactCampaignAction({
      search: fieldKey ? `${fieldKey}*` : "*",
    });
    // eslint-disable-next-line
  }, [fieldKey]);

  const [assignOwnerToContact] = useMutation(ASSIGN_OWNER_TO_CONTACT);
  const [updateBulkContact] = useMutation(UPDATEBULKCONTACT);

  const onDelete = (row) => {
    setRows(rows.filter((r) => r._id !== row._id));
  };

  const handleClose = () => {
    setM1nSelectedRowsIndexes([])
    onClose();
  }

  const onFieldToUpdateChange = (field) => {
    setIsDisabled(true)
    setField(field)
  }

  const onAssign = () => {
    let contactIds = rows.map((row) => row._id);

    const errorMsg = 'Failed to assign to contact owner'
    Loader.createToast('contact-creation', 'Contact Bulk Update in progress')

    if (field === 'Contact Owner') {
      assignOwnerToContact({
        variables: { contactIds, contactOwner, userId: stateApp.user.mongoId },
        refetchQueries: ["getESContacts", "getESSimpleSearch"],
        awaitRefetchQueries: true
      }).then(
        res => {
          if (res.data && res.data.assignOwnerToContact) {
            const { success, message } = res.data.assignOwnerToContact
            if (success) {
              Loader.successToast('contact-creation', message)
            } else {
              Loader.errorToast('contact-creation', message)
            }
          } else {
            Loader.errorToast('contact-creation', errorMsg)
          }
        },
        err => { console.log(err); Loader.errorToast('contact-creation', errorMsg) }
      );
    }
    else {
      const fieldToUpdate = { [fieldsToUpdate.find(fieldtoUpdate => fieldtoUpdate.title === field).value]: fieldKey }

      updateBulkContact({
        variables: {
          contactIds: contactIds,
          keysToUpdate: fieldToUpdate,
          ignoreResponse: false,
        },
        refetchQueries: ["getESContacts", "getESSimpleSearch"],
        awaitRefetchQueries: true,
      }).then(res => {
        if (res.data && res.data.updateBulkContact) {
          const success = res.data.updateBulkContact.some(res => res.success)
          if (success) {
            Loader.successToast('contact-creation', "updated")
          } else {
            Loader.errorToast('contact-creation', "updated")
          }
        } else {
          Loader.errorToast('contact-creation', "failed")
        }
      },
        err => { console.log(err); Loader.errorToast('contact-creation', errorMsg) });
    }




    setM1nSelectedRowsIndexes([])
    onClose();
    setLoading(false);
  };

  function SelectedField() {
    let filterKey = ''
    switch (field) {
      case 'Contact Owner':
        return <ContactAutoComplete
          value={contactOwner}
          onChange={(e, user) => {
            setIsDisabled(false)
            setContactOwner(user.value);
          }}
        />
      case 'Campaign Name':
        // filterKey = 'campaignName.keyword'
        return <AutoCompleteWithAddNew
          value={fieldKey}
          onSearch={(value) => {
            setIsDisabled(false)
            setFieldKey(value);
          }}
          setValue={(value) => {
          }}
          options={campaignList.map((campaign) => ({
            _id: campaign,
            name: campaign,
          }))}
        />
      case 'Stage':
        filterKey = 'status.keyword'
        break
      case 'Status':
        filterKey = 'contactStatus.keyword'
        break
      case 'Entity Type':
        filterKey = 'ownerType.keyword'
      // .. etc
      default:

    }

    if (filterKey) {
      return <FieldBulkAutoComplete
        value={fieldKey || []}
        placeholder={`Select ${field}`}
        filterKey={filterKey}
        onChange={(e, fieldKey) => {
          setIsDisabled(false)
          setFieldKey(fieldKey.value);
        }}
      />
    }
    else return ''


  }

  return (
    <RightDialog open={true}>
      <Container maxWidth="sm" >
        <div >
          <Box p={3} pt={1}>
            <Grid container direction="row" spacing={4} justify="space-between" alignItems="center" >
              <Grid item>
                <Typography className={classes.topHeading} variant="h5" component="h2">
                  Bulk Update
                </Typography>
              </Grid>
              <Grid item>
                <IconButton aria-label="delete" color="primary" onClick={handleClose}>
                  <KeyboardTabIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* <Box mt={2}>
              <Typography>
                Assign a contact owner to the selected contacts by choosing contact owner from the list below and clicking the assign button.
              </Typography>
            </Box> */}

            <Box pt={3}>
              <Typography style={{ fontWeight: "bold" }}>Contacts</Typography>
              <Typography>{rows.length} selected</Typography>
            </Box>
          </Box>

          <Box ml={3}>
            {rows.map((row) => (
              <Grid container direction="row" spacing={2} alignItems="center" key={row.id}>
                <Grid item md={11}>
                  <Typography style={{ backgroundColor: "#edfbff" }}>
                    <Grid container alignItems='center' style={{ paddingLeft: 10 }}>
                      <Grid item md={4}>{row.name}</Grid>
                      <Grid item md={8}>{row.address1} {row.address2} {row.city}, {row.state} {row.zip}</Grid>
                    </Grid>
                  </Typography>
                </Grid>
                <Grid item md={1}>
                  <IconButton aria-label="delete" onClick={() => onDelete(row)}>
                    <CloseSharp />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
          <Box p={3} pt={3}>
            <Grid container direction="column"  >
              <Grid item>
                <Typography style={{ fontWeight: "bold" }}>Search for the fields you would like to update from the list below</Typography>
              </Grid>
              <Grid item >
                <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  disableClearable
                  options={fieldsToUpdate.map((field) => field.title)}
                  onChange={(e, field) => {
                    setFieldKey("")
                    onFieldToUpdateChange(field)
                  }}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Field"
                      variant="outlined"

                      InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon htmlColor="#757575" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Typography style={{ fontWeight: "bold", marginTop: "30px" }}>{field}</Typography>
              </Grid>
              <Grid item>
                <SelectedField />
              </Grid>
            </Grid>
          </Box>

          <Box pt={6} mt={6} pb={6}>
            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
              <Grid item>
                <Button onClick={handleClose}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  component="span"
                  disabled={isDisabled}
                  style={isDisabled ? {} : { backgroundColor: "#00abed", color: "white" }}
                  onClick={onAssign}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Container>

      {loading && (
        <div className={classes.loading}>
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      )}
    </RightDialog>
  );
}
