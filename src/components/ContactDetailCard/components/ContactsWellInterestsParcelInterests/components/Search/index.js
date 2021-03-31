import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "AppContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import MUIDataTable from "mui-datatables";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { deepEqualObjects } from "components/Shared/functions";

import { OWNER_WELLS_BY_SEARCHTYPE } from "graphQL/useQueryWellsBySearchType";
import { ADD_MULTI_WELLINTEREST_TO_CONTACT } from "graphQL/useMutationAddMultiWellInterestToContact";
import useStyles from "./style";

import SearchSection from "./SearchSection";
import AssociateContactWellHeadCells from "components/Shared/constants/associate-contact-well-header-schema";
import { showErrorMessage, showSuccessMessage } from "actions";





function Search({ contactId }) {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const [wells, setWells] = useState([])
  let rowsSelected = []
  const [getWellsBySearchType, { data }] = useLazyQuery(OWNER_WELLS_BY_SEARCHTYPE, { fetchPolicy: "cache-and-network", });
  const [addMultiWellInterestToContact] = useMutation(ADD_MULTI_WELLINTEREST_TO_CONTACT);
  const fetchSelectedWells = (searchType, searchIds) => {
    getWellsBySearchType({
      variables: {
        searchType, searchIds
      },
    });
    console.log(searchType, searchIds)
  }

  useEffect(() => {
    if (data?.wellsBySearchType) {
      const wells = JSON.parse(JSON.stringify(data?.wellsBySearchType))
      setWells(wells.map((well) => {
        well.apiNumber = well.apiNumber || well.api
        well.type = well.wellType || well.type
        return well
      }))
    }
  }, [data?.wellsBySearchType])

  const addWellInterestToContact = () => {
    const wellIds = []
    rowsSelected.forEach((row) => {
      debugger
      wellIds.push(wells[row.dataIndex].id || wells[row.dataIndex].globalWell)
    })
    addMultiWellInterestToContact({
      variables: { wellIds, contactId, userId: stateApp.user.mongoId, },
      refetchQueries: [
        "getContactWells",
      ],
      awaitRefetchQueries: true
    }).then(
      res => {
        dispatch(showSuccessMessage("Contacts Merged Successfully"));
        // setLoading(false);
      },
      err => {
        console.log(err)
        // setLoading(false);
        dispatch(showErrorMessage("Failed to merge"));
      }
    );
  }

  return (
    <form className={classes.root}>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Well Interest Search</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Grid container direction="row" spacing={2} >
            <Grid item md={6}>
              <SearchSection fetchSelectedWells={fetchSelectedWells} />
            </Grid>

            <Grid item md={6}>
              <Grid container direction="column" spacing={1} >
                <Grid item >
                  <Typography className={classes.heading}>2. Select the well interests to associate to the contact from the list below</Typography>
                </Grid>
                <Grid item md={12}>

                  <MUIDataTable
                    title={'Tax Role Interest'}
                    data={wells}
                    columns={AssociateContactWellHeadCells}
                    options={{
                      ...AssociateContactWellHeadCells[0].options,
                      customToolbarSelect: () => <Button color="secondary" className={classes.multiSelectionTopBarButtons} onClick={addWellInterestToContact} > Add to contact</Button>,
                      onRowsSelect: (currentRowsSelected, selectedRows) => {
                        rowsSelected = selectedRows
                        console.log(selectedRows)
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </form>
  );
}

export default React.memo(Search, deepEqualObjects);
