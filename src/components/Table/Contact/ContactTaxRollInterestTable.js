import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATEWELLINTEREST } from "graphQL/useMutationUpdateWellInterest";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import AddWellInterestDialog from "components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/components/AddWellInterestDialog";

// Header Schemas 
import TableHeader from 'components/Shared/constants/contact-tax-roll-header-schema.js'
import { handleTagColumn } from "../helpers";

// Utilities
import { GET_CONTACT_TAX_ROLL_INTERESTS_QUERY } from "graphQL/useQueryGetContactTaxRollInterests";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
}));

function ContactTaxRollInterestTable(props) {
  const classes = useStyles();

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);


  // function states 
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 

  // queries 
  const [getContactTaxRollInterests, { data: dataContactTaxRollInterst }] = useLazyQuery(GET_CONTACT_TAX_ROLL_INTERESTS_QUERY, {
    fetchPolicy: "cache-and-network", skip: true,
    // with a cache fetch policy, if network request returns same result we can end up in an infinite loading sitch.
    // have only seen when searching / researching same string - so same result
    onCompleted: () => {
      props.setLoading(false);
    }
  });
  const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, { refetchQueries: ["getContactWells", "getPaginatedContactWellInterests"], awaitRefetchQueries: true });
  const tableData = dataContactTaxRollInterst?.contactTaxRollInterests

  const addAble = {}
  const total = false
  const orderByTracks = false

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "assocTaxRollInterests") {
      getContactTaxRollInterests({
        variables: {
          contactId: props.contactId,
        },
      });
    }
  }, [props.parent]);

  useEffect(() => {
    if (tableData?.edges?.length > 0) {
      let wells = tableData.edges.map((el) => el.node)
      const objectsIdsArray = wells.map((well) => well.wellId);
      // props.initializeGenericData(objectsIdsArray, ['comments', 'tags'])
    }

  }, [tableData])

  useEffect(() => {
    if (tableData?.length > 0) {
      let wells = tableData

      wells = wells.map((w) => {
        let well = { ...w };
        well.detailCard = well.wellId;
        return well;
      });
      props.setRows(wells);
      const cleanAvailableTags = []; // get from backend
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      setColumns(columns);
      props.setLoading(false);
    }
    else if (tableData?.edges?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  ////////////Contact Wells end///////////////////////////////////////////////

  const count = dataContactTaxRollInterst?.contactTaxRollInterests?.length || 0
  const options = {
    rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: count,
    serverSide: true
  }
  ////////////-----Add your code section here-----///////////////////////
  const getWellOwnersByYear = (selectedYear) => {
    setSelectedYear(selectedYear)
  }

  const deleteFunc = (ids) => {
    for (let i = 0; i < ids.length; i++) {
      updateWellInterest({
        variables: {
          wellInterest: {
            id: ids[i],
            isDeleted: true
          },
        },
        refetchQueries: [
          "getContactWells",
          "getPaginatedContactWellInterests"
        ],
        awaitRefetchQueries: true,
      });
    }
  }

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >

      {props.parent && props.parent === "assocTaxRollInterests" && (
        <AddWellInterestDialog
          open={stateApp.wellInterestDialog ? true : false}
          width="450px"
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              wellInterestDialog: false,
            }))
          }
          contactId={props.contactId}
        />
      )}

      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={props.rows}
        total={total}
        loading={props.loading}
        addAble={addAble}
        targetLabel={props.targetLabel}
        deleteFunc={deleteFunc}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={orderByTracks}
        startPaginationAt={null}
        contactId={props.contactId}
        // onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        getWellOwnersByYear={getWellOwnersByYear}
      />
    </Container>
  );
}

export default React.memo(TableHOC(ContactTaxRollInterestTable), deepEqualObjects);


