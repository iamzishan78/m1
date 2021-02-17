import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Container, Box } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseSharp from "@material-ui/icons/CloseSharp";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";
import RemoveSharpIcon from "@material-ui/icons/RemoveSharp";
import Typography from "@material-ui/core/Typography";
import AlertDialogSlide from "../../../../Contacts/components/RightDialog";
import { showSuccessMessage } from "../../../../../actions";
import { COMMENTSBYOBJECTSIDS } from "../../../../../graphQL/useQueryCommentsByObjectsIds";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  topHeading: {},
});

const useStyles = makeStyles(styles);

export default function MergeContactDrawer({ onClose, rows, setRows }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [primaryContact, setPrimaryContact] = useState(rows[0]);

  const [
    getCommentsByObjectsIds,
    { data: dataCommentsMultiIds },
  ] = useLazyQuery(COMMENTSBYOBJECTSIDS, {
    fetchPolicy: "cache-and-network",
  });

  const ids = rows.reduce((ids, row) => {
    ids.push(row._id);
    return ids;
  }, []);

  useEffect(() => {
    getCommentsByObjectsIds({
      variables: {
        objectsIdsArray: ids,
      },
    });
  }, []);

  const onMerge = () => {
    dispatch(showSuccessMessage("All records saved successfully"));
    onClose();
  };

  const onDelete = (row) => {
    setRows(rows.filter((r) => r._id !== row._id));
  };

  return (
    <AlertDialogSlide open={true}>
      <Container maxWidth="sm">
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
              <IconButton aria-label="delete" color="primary" onClick={onClose}>
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
                {row.name} {row.address1} {row.address2} {row.city} {row.state}
              </Typography>
            </Grid>

            <Grid item md={1}>
              <IconButton aria-label="delete" onClick={() => onDelete(row)}>
                <DeleteIcon />
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
              <Button onClick={onClose}>Cancel</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                disabled={rows.length > 1}
                style={{ backgroundColor: "#00abed", color: "white" }}
                onClick={onMerge}
              >
                Merge
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AlertDialogSlide>
  );
}
