import { useLazyQuery } from "@apollo/client";
import { propertiesContainsFilter } from "@turf/clusters";
import LinkWithIcon from "components/Shared/LinkWithIcon";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { AppContext } from "../../../AppContext";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { setStateIfDeepEqual } from "../../Shared/functions";
import AutocompEntityNamesVirtualizeList from "../../Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";

const ContactSearch = (props) => {
  let history = useHistory();
  const contactId = history.location.pathname.split('/')[3]
  const [
    getPaginatedContacts,
    { data: allContacts, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [stateApp, setStateApp] = useContext(AppContext);

  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(() => {
    if (nameAutValue && nameAutValue?._id) {
      history.push(`/contact/details/${nameAutValue._id}`)
      setStateApp((stateApp) => ({
        ...stateApp,
        selectedContact: nameAutValue._id,
      }));
    }
  }, [nameAutValue]);

  useEffect(() => {
    //will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [nameAutInputValue]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
    return null;
  };

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray([
        ...allContacts?.paginatedContacts?.edges?.map((el) => el.node),
      ]);
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
    }
    setIsNextPageLoading(false);
  }, [allContacts]);

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ width: "70%", marginLeft: "20px", maxWidth: "400px" }}>
        <AutocompEntityNamesVirtualizeList
          darkCard={true}
          mongoEntitiesArray={mongoEntitiesArray}
          setMongoEntitiesArray={setMongoEntitiesArray}
          nameAutValue={nameAutValue}
          setNameAutValue={setNameAutValue}
          nameAutInputValue={nameAutInputValue}
          setNameAutInputValue={setNameAutInputValue}
          variant="outlined"
          placeholder="Search by contact name"
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={loadNextPage}
        />
      </div>

      <div style={{ flexGrow: 1 }}></div>
      {
        props.showLinkIcon && <LinkWithIcon
          objectId={contactId.toLowerCase()}
          iconZiseSmall={false}
        />
      }

    </div>

  );
};
export default ContactSearch;
