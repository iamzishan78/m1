import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Box, CircularProgress, InputAdornment, IconButton } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from "@material-ui/icons/Search";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { Modals } from "styles/Modal";

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
import { timeZoneOptions } from "components/ContactDetailCard/components/FieldContent/timeZoneList";
import Tags from "components/Shared/Tagger";

const styles = () => ({
  topHeading: { fontWeight: "bold" },
  loading: { position: "absolute", left: "250px", bottom: "148px", zIndex: "150" },
  dialogTitle: {
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  fullWidth: {
    width: '100%'
  }
});
  
const useStyles = makeStyles(styles);

export default function MultipleOwnerToContactDrawer({ onClose, rows, setRows, setM1nSelectedRowsIndexes, showSuccessMessage, getContactCampaignAction, campaignList }) {
  const [stateApp] = React.useContext(AppContext);
  const classes = useStyles();
  const modalClass = Modals();
  const [contactOwner, setContactOwner] = useState('');
  const [field, setField] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [loading, setLoading] = useState(false);

  const fieldsToUpdate = [
    { title: "Campaign Name", value: "campaignName" },
    { title: "Contact Owner", value: "contactOwner" },
    { title: "Entity Type", value: "ownerType" },
    { title: "Stage", value: "status" },
    { title: "Status", value: "contactStatus" },
    { title: "Industry Type", value: "industryType" },
    { title: "Lead Source", value: "leadSource" },
    { title: "Territory", value: "territory" },
    { title: "Time Zone", value: "timeZone" },
    { title: "Tags", value: "contactStatus" },
  ];

  useEffect(() => {
    if (
      ![
        "Industry Type",
        "Lead Source",
        "Territory",
        "Time Zone",
        "Tags",
      ].includes(field)
    )
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

  const onFieldToUpdateChange = (field) => {
    setField(field);
    setFieldKey('');
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
              showSuccessMessage("Contacts Updated Successfuly")
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
          lastUpdateBy: stateApp.user.mongoId,
          ignoreResponse: false,
        },
        refetchQueries: ["getESContacts", "getESSimpleSearch"],
        awaitRefetchQueries: true,
      }).then(res => {
        if (res.data && res.data.updateBulkContact) {
          const success = res.data.updateBulkContact.some(res => res.success)
          if (success) {
            Loader.successToast('contact-creation', "updated")
            showSuccessMessage(`${field} Bulk Updated Successfully`)
          } else {
            Loader.errorToast('contact-creation', "updated")
          }
        } else {
          Loader.errorToast('contact-creation', "failed")
        }
      },
        err => { console.log(err); Loader.errorToast('contact-creation', errorMsg) });
    }




    onClose();
    setLoading(false);
  };

  function SelectedField() {
    let contactIds = rows.map((row) => row._id);
    let filterKey = ''
    switch (field) {
      case "Contact Owner":
        return (
          <ContactAutoComplete
            value={contactOwner}
            onChange={(e, user) => {
              setContactOwner(user.value);
            }}
          />
        );
      case "Campaign Name":
        // filterKey = 'campaignName.keyword'
        return (
          <AutoCompleteWithAddNew
            value={fieldKey}
            onSearch={(value) => {
              setFieldKey(value);
            }}
            setValue={(value) => {}}
            options={campaignList.map((campaign) => ({
              _id: campaign,
              name: campaign,
            }))}
          />
        );
      case "Stage":
        filterKey = "status.keyword";
        break;
      case "Status":
        filterKey = "contactStatus.keyword";
        break;
      case "Entity Type":
        filterKey = "ownerType.keyword";
      case "Industry Type":
      case "Lead Source":
      case "Territory":
        return (
          <TextField
            placeholder={"Type something..."}
            onChange={({ target }) => {
              console.log("target is ", target)
              setFieldKey(target.value)
            }}
            className={classes.fullWidth}
          />
        );
      case "Time Zone":
        return (
          <Autocomplete
            id="combo-box-demo"
            options={timeZoneOptions}
            getOptionLabel={(option) => option.title}
            setValue={(value) => {}}
            onChange={(e, fieldKey) => {
              setFieldKey(fieldKey.title);
            }}
            renderInput={(params) => (
              <TextField
                size="small"
                placeholder={"Select Timezone"}
                {...params}
              />
            )}
          />
        );
      case "Tags": 
        return (
          <Tags
            width="100%"
            multipleIds={contactIds}
            targetLabel="contact"
            shareable={false}
          />
        );
      // .. etc
      default:
    }

    if (filterKey) {
      return <FieldBulkAutoComplete
        value={fieldKey || []}
        placeholder={`Select ${field}`}
        filterKey={filterKey}
        onChange={(e, fieldKey) => {
          setFieldKey(fieldKey.value);
        }}
      />
    }
    else return ''
  }

  return (
    <RightDialog open={true} width={"700px"}>
      <MuiDialogTitle disableTypography className={classes.dialogTitle}>
        <Typography className={classes.topHeading} variant="h5" component="h1">
          Bulk Update
        </Typography>
        <IconButton aria-label="close" onClick={onClose} size="medium">
          <KeyboardTabIcon fontSize="large" />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent>
        <Box p={0} pt={2} pb={2}>
          {rows.map((row) => (
            <Grid
              container
              direction="row"
              spacing={2}
              alignItems="center"
              key={row.id}
            >
              <Grid item md={11}>
                <Typography style={{ backgroundColor: "#edfbff" }}>
                  <Grid
                    container
                    alignItems="center"
                    style={{ paddingLeft: 10 }}
                  >
                    <Grid item md={4}>
                      {row.name}
                    </Grid>
                    <Grid item md={8}>
                      {row.address1} {row.address2} {row.city}, {row.state}{" "}
                      {row.zip}
                    </Grid>
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
        <Box p={0} pt={2} pb={2}>
          <Grid container direction="column">
            <Grid item>
              <Typography style={{ fontWeight: "bold", paddingBottom: "10px" }}>
                Search for the field you would like to update from the list
                below
              </Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={fieldsToUpdate.map((field) => field.title)}
                onChange={(e, field) => {
                  console.log(" field selected ", field);
                  setFieldKey("");
                  onFieldToUpdateChange(field);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select field to update"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
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
              <Typography style={{ fontWeight: "bold", marginTop: "30px" }}>
                {field}
              </Typography>
            </Grid>
            <Grid item>
              <SelectedField />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions className={modalClass.actionButtons}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          component="span"
          disabled={!fieldKey}
          style={!fieldKey ? {} : { backgroundColor: "#00abed", color: "white" }}
          onClick={onAssign}
        >
          Update
        </Button>
      </DialogActions>

      {loading && (
        <div className={classes.loading}>
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      )}
    </RightDialog>
  );
}
