import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "AppContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import MUIDataTable from "mui-datatables";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Accordion, AccordionSummary, AccordionDetails, Button, Tooltip, IconButton } from "@material-ui/core";
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
    setWells([])
    getWellsBySearchType({
      variables: {
        searchType, searchIds
      },
    });
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
    const selectedWells = []
    rowsSelected.forEach((row) => {
      selectedWells.push(wells[row.dataIndex])
    })
    addMultiWellInterestToContact({
      variables: { wells: selectedWells, contactId, userId: stateApp.user.mongoId, },
      refetchQueries: [
        "getContactWells",
      ],
      awaitRefetchQueries: true
    }).then(
      ({ data: { addMultiWellInterestToContact } }) => {
        if (addMultiWellInterestToContact?.success) {
          rowsSelected = []
          setWells([...wells])
          dispatch(showSuccessMessage(addMultiWellInterestToContact.message));
        } else {
          dispatch(showErrorMessage(addMultiWellInterestToContact.message));
        }
      },
      err => {
        console.log(err)
        dispatch(showErrorMessage("Failed to attach to contact"));
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
          <Typography className={classes.heading}>Interest Search</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Grid container direction="row" spacing={2} >
            <Grid item md={4}>
              <SearchSection fetchSelectedWells={fetchSelectedWells} />
            </Grid>

            <Grid item md={8}>
              <Grid container direction="column" spacing={1} >
                <Grid item >
                  <Typography className={classes.heading}>2. Select the interests to associate to the contact from the list below</Typography>
                </Grid>
                <Grid item md={12}>

                  <MUIDataTable
                    title={'Tax Roll Interests'}
                    data={wells}
                    columns={AssociateContactWellHeadCells}
                    options={{
                      ...AssociateContactWellHeadCells[0].options,
                      customToolbarSelect: () => <Button color="secondary" startIcon={<AddCircleOutlineRoundedIcon />} className={classes.multiSelectionTopBarButtons} onClick={addWellInterestToContact} > Add to contact</Button>,
                      customToolbar: () => <span className={classes.addIcon}>
                        {
                          wells.length > 0 && <Tooltip title='Clear'>
                            <IconButton
                              size="medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                rowsSelected = []
                                setWells([])
                              }}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        }

                      </span>,
                      onRowsSelect: (currentRowsSelected, selectedRows) => {
                        rowsSelected = selectedRows
                      },

                      rowsSelected: rowsSelected
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
