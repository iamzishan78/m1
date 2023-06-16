import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, DialogActions, IconButton, Box, Grid, Typography } from '@material-ui/core';
import { CloseSharp } from '@material-ui/icons';
import { useMutation } from '@apollo/client';
import { RESET_OWNERS_CALCULATED_VALUES } from 'graphQL/useMutationResetOwnersCalculatedValues';
import { useLocation } from "react-router-dom";
import { hookStateApp } from 'hookstate';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '90%'
  },
  content: {
    padding: '15px 30px',
  },
  actionButtons: {
    margin: "0px 25px",
  },
}));

function DialogContent({ rows, setRows, onClose }) {
  const classes = useStyles()
  const location = useLocation()

  const [resetOwnersCalculatedValues, { data: mutationData }] = useMutation(RESET_OWNERS_CALCULATED_VALUES);

  const onDelete = (row) => {
    setRows(rows.filter((r) => r._id !== row._id));
  };

  const onUpdate = (row) => {
    const slugs = location.pathname.split('/')
    resetOwnersCalculatedValues({
      variables: {
        ownerIds: rows.map(row => row._id),
        layerId: slugs[slugs.length - 1]
      },
      refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList", "getCustomLayer"],
      awaitRefetchQueries: true,
    });

    hookStateApp.universalLoader.set(true)
  };

  useEffect(() => {
    if (!mutationData) return

    hookStateApp.universalLoader.set(false)
    onClose()
  }, [mutationData])


  return (
    <Box className={classes.root}>
      <Box className={classes.content}>
        <Typography component='p' variant='h6'>
          Note that this action will override existing data with system calculated values for selected owners.
        </Typography>

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
      </Box>

      <DialogActions className={classes.actionButtons}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          component="span"
          disabled={rows.length === 0}
          style={rows.length === 0 ? { backgroundColor: "grey", color: "white" } : { backgroundColor: "#00abed", color: "white" }}
          onClick={onUpdate}
        >
          Update
        </Button>
      </DialogActions>
    </Box>
  );
}

export default DialogContent;
