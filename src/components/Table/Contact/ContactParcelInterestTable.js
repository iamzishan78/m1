import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATEWELLINTEREST } from "graphQL/useMutationUpdateWellInterest";
import { CONTACT_PARCEL_INTERESTS } from "graphQL/useQueryContactParcelInterest";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import AddWellInterestDialog from "components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/components/AddWellInterestDialog";

// Header Schemas 
import TableHeader from 'components/Shared/constants/associate-contact-parcel-header-schema.js'
import { handleTagColumn } from "../helpers";


const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
}));

function ContactParcelInterestTable(props) {
  const classes = useStyles();
  let history = useHistory();
  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);


  // function states 
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 

  // queries 
  const [getContactParcelInterests, { data: dataContactParcels }] = useLazyQuery(CONTACT_PARCEL_INTERESTS, { fetchPolicy: "cache-and-network", skip: true });
  const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, { refetchQueries: [ "getContactWells", "getContactParcelInterests" ], awaitRefetchQueries: true });
  const tableData = dataContactParcels?.contactParcelInterest

  const addAble = { type: "parcelInterest" }
  const total = false
  const orderByTracks = false

  useEffect(() => {
    if (props.parent && props.parent === "assocTaxRollInterests") {
      getContactParcelInterests({
        variables: {
          contactId: props.contactId,
          filters: [{ field: 'contact._id', value: props.contactId }]
        },
      });
    }
  }, [getContactParcelInterests, props.contactId, props.parent]);

  useEffect(() => {
    if (tableData?.length > 0) {
      let wells = tableData
      const objectsIdsArray = wells.map((well) => well.wellId);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags'])
    }

  }, [tableData])

  useEffect(() => {
    if (dataContactParcels?.contactParcelInterest?.length > 0) {
      let wells = dataContactParcels.contactParcelInterest

      wells = wells.map((w) => {
        let well = { ...w }; 
        const parcel = JSON.parse(well.parcel.shape).properties
        well.parcelName = well.parcel.name
        well.state = parcel.originalProperties[0].State
        well.country = parcel.originalProperties[0].County
        well.survey = parcel.originalProperties[0].Survey
        well.block = parcel.originalProperties[0].Block
        well.section = parcel.originalProperties[0].Section
        well.abstract = parcel.originalProperties[0].AbstractName
        well.grantee = parcel.originalProperties[0].Grantee
        well.detailCard = well.wellId;
        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];

        well = props.setGenricData(well, well.wellId, ['comments', 'tracks', 'tags'])

        return well;
      });
      props.setRows(wells);
      const cleanAvailableTags = []; // get from backend
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      setColumns(columns);
      props.setLoading(false);
    }
    else if (tableData?.edges?.length === 0) {
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  const count = dataContactParcels?.paginatedContactWellInterests?.totalCount || 0
  const options = {
    rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: count,
    serverSide: true
  }
  ////////////-----Add your code section here-----///////////////////////
  const getWellOwnersByYear = (selectedYear) => {
    setSelectedYear(selectedYear)
  }

  const deleteFunc = (ids)=> {
    for(let i=0; i< ids.length;  i++){
      updateWellInterest({
        variables: {
          wellInterest: {
            id: ids[i],
            isDeleted: true
          },
        },
        refetchQueries: [
          "getContactWells",
          "getContactParcelInterests"
        ],
        awaitRefetchQueries: true,
      });
    }
  }

  const showParcelDetails = (parcel) => {
    history.push(`/contact/details/${props.contactId}/parcels/${parcel.descriptorObject}`)
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
        showParcelDetails={showParcelDetails}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={orderByTracks}
        startPaginationAt={null}
        contactId={props.contactId}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        getWellOwnersByYear={getWellOwnersByYear}
      />
    </Container>
  );
}

export default React.memo(TableHOC(ContactParcelInterestTable), deepEqualObjects);


