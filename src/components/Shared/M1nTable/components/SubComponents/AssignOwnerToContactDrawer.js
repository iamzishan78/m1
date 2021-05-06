import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Container, Box, CircularProgress, IconButton } from "@material-ui/core";

import CloseSharp from "@material-ui/icons/CloseSharp";
import Typography from "@material-ui/core/Typography";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { AppContext } from "AppContext";
import { ASSIGN_OWNER_TO_CONTACT } from "graphQL/useMutationAssignOwnerToContact";
import ContactAutoComplete from "components/Shared/ContactAutoComplete";
import Loader from "components/Loaders";

const styles = () => ({
  topHeading: { fontWeight: "bold" },
  loading: { position: "absolute", left: "250px", bottom: "148px", zIndex: "150" },
});

const useStyles = makeStyles(styles);

export default function MultipleOwnerToContactDrawer({ onClose, rows, setRows, setM1nSelectedRowsIndexes }) {
  const [stateApp] = React.useContext(AppContext);
  const classes = useStyles();
  const [contactOwner, setContactOwner] = useState('');
  const [loading, setLoading] = useState(false);

  const [assignOwnerToContact] = useMutation(ASSIGN_OWNER_TO_CONTACT);

  const onDelete = (row) => {
    setRows(rows.filter((r) => r._id !== row._id));
  };

  const handleClose = () => {
    setM1nSelectedRowsIndexes([])
    onClose();
  }

  const onAssign = () => {
    let contactIds = rows.map((row) => row._id);
    const errorMsg = 'Failed to assign to contact owner'
    Loader.createToast('contact-creation', 'Contact owner assignment in progress')
    assignOwnerToContact({
      variables: { contactIds, contactOwner, userId: stateApp.user.mongoId },
      refetchQueries: ["getPaginatedContacts"],
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

    setM1nSelectedRowsIndexes([])
    onClose();
    setLoading(false);
  };

  return (
    <RightDialog open={true}>
      <Container maxWidth="sm" >
        <div >
          <Box p={3} pt={1}>
            <Grid container direction="row" spacing={4} justify="space-between" alignItems="center" >
              <Grid item>
                <Typography className={classes.topHeading} variant="h5" component="h2">
                  Contact Assignment
              </Typography>
              </Grid>
              <Grid item>
                <IconButton aria-label="delete" color="primary" onClick={handleClose}>
                  <CloseSharp />
                </IconButton>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Typography>
                Assign a contact owner to the selected contacts by choosing contact owner from the list below and clicking the assign button.
            </Typography>
            </Box>

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
                <Typography style={{ fontWeight: "bold" }}>Contact Owner</Typography>
              </Grid>
              <Grid item >
                <ContactAutoComplete
                  value={contactOwner}
                  onChange={(e, user) => {
                    setContactOwner(user.value);
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box pt={6} mt={6}>
            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
              <Grid item>
                <Button onClick={handleClose}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  component="span"
                  disabled={rows.length === 0}
                  style={{ backgroundColor: "#00abed", color: "white" }}
                  onClick={onAssign}
                >
                  Assign
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
