import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Container, Box, CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseSharp from "@material-ui/icons/CloseSharp";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";
import RemoveSharpIcon from "@material-ui/icons/RemoveSharp";
import Typography from "@material-ui/core/Typography";
import AlertDialogSlide from "../../../../Contacts/components/RightDialog";
import { showSuccessMessage, showErrorMessage } from "../../../../../actions";
import { MERGE_CONTACTS } from "../../../../../graphQL/useMutationMergeContact";
import { AppContext } from "../../../../../AppContext";


const styles = (theme) => ({
  // root: {
  //   margin: 0,
  //   padding: theme.spacing(2),
  // },
  topHeading: {},
  gridWidthScroll: {
    backgroundColor: "#fff",
    "& .formLabel": {
      color: "#757575",
      fontWeight: "bold",
      width: "100%",
      marginBottom: "0",
    },
  },
  dealContainer: {
    // display: "flex",
    // padding: "10px 10px 30px 10px",
  },
});

const useStyles = makeStyles(styles);

export default function MergeContactDrawer({ onClose, rows, setRows, setM1nSelectedRowsIndexes }) {
  const [stateApp] = React.useContext(AppContext);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [primaryContact, setPrimaryContact] = useState(rows[0]);
  const [loading, setLoading] = useState(false);

  const [mergeContacts] = useMutation(MERGE_CONTACTS);

  const onMerge = () => {
    let secondaryContacts = rows.filter(
      (row) => row._id !== primaryContact._id
    );
    secondaryContacts = secondaryContacts.reduce((ids, row) => {
      ids.push(row._id);
      return ids;
    }, []);
    setLoading(true);
    mergeContacts({
      variables: { primary: primaryContact._id, secondary: secondaryContacts, mergedBy: stateApp.user.mongoId, },
      refetchQueries: [
        "getPaginatedContacts",
      ],
      awaitRefetchQueries: true
    }).then(
      res => {
        dispatch(showSuccessMessage("Contacts Merged Successfully"));
        setM1nSelectedRowsIndexes([])
        onClose();
        setLoading(false);
      },
      err => {
        console.log(err)
        setLoading(false);
        dispatch(showErrorMessage("Failed to merge"));
      }
    );;

  };

  const onDelete = (row) => {
    setRows(rows.filter((r) => r._id !== row._id));
  };

  const handleClose = () => {
    setM1nSelectedRowsIndexes([])
    onClose();
  }

  return (
    <AlertDialogSlide open={true}>
      <Container maxWidth="sm" className={classes.gridWidthScroll}>
      <div className={classes.dealContainer}>

        <Box p={3} pt={1}>
          <Grid
            container
            direction="row"
            spacing={4}
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography
                className={classes.topHeading}
                style={{ fontWeight: "bold" }}
                variant="h5"
                component="h2"
              >
                Merge Contacts
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
              Please select a primary contact below - data form the secondary
              contacts will be merged then secondary contact will be deleted.
            </Typography>
          </Box>

          <Box pt={3}>
            <Typography style={{ fontWeight: "bold" }}>Contacts</Typography>

            <Typography>{rows.length} selected</Typography>
          </Box>
        </Box>

        {rows.map((row) => (
          <Grid container direction="row" spacing={2} alignItems="center">
            <Grid item md={1}>
              {primaryContact._id === row._id ? (
                <IconButton>
                  <DoneSharpIcon
                    fontSize="small"
                    style={{
                      background: "#00af48",
                      color: "white",
                      borderRadius: 3,
                    }}
                  />
                </IconButton>
              ) : (
                  <IconButton onClick={() => setPrimaryContact(row)}>
                    <RemoveSharpIcon
                      fontSize="small"
                      style={{
                        background: "#f70000",
                        color: "white",
                        borderRadius: 3,
                      }}
                    />
                  </IconButton>
                )}
            </Grid>

            <Grid item md={10}>
              <Typography style={{ backgroundColor: "#edfbff" }}>
                <Box display='inline' pr={2}>{row.name}</Box> {row.address1} {row.address2} {row.city}, {row.state} {row.zip}
              </Typography>
            </Grid>

            <Grid item md={1}>
              <IconButton aria-label="delete" onClick={() => onDelete(row)}>
                <CloseSharp />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Box p={3}>
          <Typography>
            Note: Merging contacts is an irreversible action.
          </Typography>
        </Box>

        <Box pt={6} mt={6}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Grid item>
              <Button onClick={handleClose}>Cancel</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                disabled={rows.length < 2}
                style={{ backgroundColor: "#00abed", color: "white" }}
                onClick={onMerge}
              >
                Merge
              </Button>
            </Grid>
          </Grid>
        </Box>
        </div>
      </Container>

      {loading && (
        <div
          style={{
            position: "absolute",
            left: "250px",
            bottom: "148px",
            zIndex: "150",
          }}
        >
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      )}
    </AlertDialogSlide>
  );
}
