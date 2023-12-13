import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Box, CircularProgress } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseSharp from '@material-ui/icons/CloseSharp';
import DoneSharpIcon from '@material-ui/icons/DoneSharp';
import RemoveSharpIcon from '@material-ui/icons/RemoveSharp';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import { List } from 'react-virtualized';
import { Modals } from 'styles/Modal';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { showSuccessMessage, showErrorMessage } from 'actions';
import { MERGE_CONTACTS } from 'graphQL/useMutationMergeContact';
import { tableGlobalController } from 'hookstate/tableController';
import { globalStateController } from 'hookstate/globalStateController';

const styles = () => ({
  topHeading: { fontWeight: 'bold' },
  loading: { position: 'absolute', left: '250px', bottom: '148px', zIndex: '150' },
  dialogTitle: {
    padding: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loaderWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

const useStyles = makeStyles(styles);

export default function MergeContactDrawer({ onClose, rows, setRows }) {
  const { user } = globalStateController.useState(['user']);
  const getUser = user.get({ noproxy: true });
  const dispatch = useDispatch();
  const classes = useStyles();
  const modalClass = Modals();
  const [primaryContact, setPrimaryContact] = useState(rows[0]);
  const [loading, setLoading] = useState(false);
  const [rowsLoading, setRowsLoading] = useState(false);

  const [mergeContacts] = useMutation(MERGE_CONTACTS, {
    refetchQueries: ['getESContacts', 'getESSimpleSearch'],
    awaitRefetchQueries: true,
    onCompleted: () => {
      tableGlobalController.refetch();
    },
  });

  const onMerge = () => {
    let secondaryContacts = rows.filter(row => row._id !== primaryContact._id);
    secondaryContacts = secondaryContacts.reduce((ids, row) => {
      ids.push(row._id);
      return ids;
    }, []);
    setLoading(true);
    mergeContacts({
      variables: { primary: primaryContact._id, secondary: secondaryContacts, mergedBy: getUser?._id },
    }).then(
      () => {
        dispatch(showSuccessMessage('Contacts Merged Successfully'));
        onClose();
        setLoading(false);
      },
      err => {
        // eslint-disable-next-line no-console
        console.log(err);
        setLoading(false);
        dispatch(showErrorMessage('Failed to merge'));
      }
    );
  };

  const onDelete = row => {
    setRows(rows.filter(r => r._id !== row._id));
  };

  useEffect(() => {
    if (!rows || rows.length === 0) {
      setRowsLoading(true);
    } else {
      setRowsLoading(false);
    }
  }, [rows]);

  console.log('rows', rows)
  return (
    <RightDialog open width="700px">
      {rowsLoading ? (
        <div className={modalClass.loaderWrapper}>
          <CircularProgress color="secondary" className={modalClass.loader} size={80} disableShrink />
        </div>
      ) : (
        <>
          <MuiDialogTitle disableTypography className={classes.dialogTitle}>
            <Typography style={{ fontWeight: 'bold' }} variant="h5" component="h2">
              Merge Contacts
            </Typography>
            <IconButton aria-label="delete" color="primary" onClick={onClose}>
              <KeyboardTabIcon fontSize="large" />
            </IconButton>
          </MuiDialogTitle>
          <DialogContent>
            <Box mt={2}>
              <Typography>
                Please select a primary contact below - data form the secondary contacts will be merged then secondary
                contact will be deleted.
              </Typography>
            </Box>

            <Box pt={3}>
              <Typography style={{ fontWeight: 'bold' }}>Contacts</Typography>

              <Typography>{rows.length} selected</Typography>
            </Box>

            {rows && rows.length > 0 && (
              <List
                width={650}
                height={750}
                rowCount={rows.length}
                rowHeight={60}
                // eslint-disable-next-line react/no-unstable-nested-components
                rowRenderer={({ index, style }) => {
                  const row = rows[index];
                  return (
                    <Grid container direction="row" spacing={2} alignItems="center" key={row?._id} style={style}>
                      <Grid item md={1}>
                        {primaryContact?._id === row?._id ? (
                          <IconButton>
                            <DoneSharpIcon
                              fontSize="small"
                              style={{
                                background: '#00af48',
                                color: 'white',
                                borderRadius: 3,
                              }}
                            />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => setPrimaryContact(row)}>
                            <RemoveSharpIcon
                              fontSize="small"
                              style={{
                                background: '#f70000',
                                color: 'white',
                                borderRadius: 3,
                              }}
                            />
                          </IconButton>
                        )}
                      </Grid>

                      <Grid item md={10}>
                        <Typography style={{ backgroundColor: '#edfbff' }}>
                          <Grid container justify="center" alignItems="center">
                            <Grid item md={4}>
                              {row.name}
                            </Grid>
                            <Grid item md={8}>
                              {row.address1} {row.address2} {row.city}
                              {(row.address1 || row.address2 || row.city) && (row.state || row.zip) ? ', ' : ' '}
                              {row.state} {row.zip}
                            </Grid>
                          </Grid>
                        </Typography>
                      </Grid>

                      {rows.length >= 2 && (
                        <Grid item md={1}>
                          <IconButton
                            aria-label="delete"
                            disabled={primaryContact?._id === row?._id}
                            onClick={() => onDelete(row)}
                          >
                            <CloseSharp />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  );
                }}
              />
            )}

            <Box p={3}>
              <Typography>Note: Merging contacts is an irreversible action.</Typography>
            </Box>

            {rows.length < 2 && (
              <Typography style={{ fontWeight: 'bold', color: 'red', marginLeft: '25px' }}>
                ** Please cancel and reselct two or more contacts to merge **
              </Typography>
            )}
          </DialogContent>

          <DialogActions className={modalClass.actionButtons}>
            <Button onClick={onClose}>Cancel</Button>
            {rows.length >= 2 && (
              <Button
                variant="contained"
                component="span"
                disabled={rows.length < 2}
                style={{ backgroundColor: '#00abed', color: 'white' }}
                onClick={onMerge}
              >
                Merge
              </Button>
            )}
          </DialogActions>

          {loading && (
            <div
              style={{
                position: 'absolute',
                left: '250px',
                bottom: '148px',
                zIndex: '150',
              }}
            >
              <CircularProgress size={80} disableShrink color="secondary" />
            </div>
          )}
        </>
      )}
    </RightDialog>
  );
}
