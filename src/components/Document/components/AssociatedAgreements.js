import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

//Contexts
import { AppContext } from "AppContext";

import DocumentAssociation from "./DocumentAssociation";

export default function AssociatedAgreements() {
  // Initials
  const [stateApp, setStateApp] = useContext(AppContext);
  let history = useHistory();

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);
  const [shapes, setShapes] = useState(
    stateApp.selectedDocument?.shapeObj || []
  );

  useEffect(() => {
    setShapes(stateApp.selectedDocument?.shapeObj || []);
  }, [stateApp.selectedDocument?.shapeObj]);

  // sending to Agreements page
  const goToAgreement = (shape) => {
    history.push(`/land/agreement/details/${shape?._id.toLowerCase()}`);
    setStateApp({ ...stateApp, DocumentDrawer: false, selectedDocument: {} });
  };

  // searching existing Agreement
  const searchExistingShapes = (value) => {
    setSearch(value);
    let existingShapes = stateApp.selectedDocument.shapeObj;
    if (value !== "") {
      const searchedShapes = existingShapes.filter((shape) =>
        shape.name.toLowerCase().includes(value.toLowerCase())
      );
      setShapes(searchedShapes);
    } else {
      setShapes(existingShapes);
    }
  };
  return (
    <DocumentAssociation
      title={"Agreements"}
      items={shapes}
      navigateTo={goToAgreement}
      esFilter={[
        {
          field: "shapeJson.properties.type.keyword",
          value: "agreement",
        },
      ]}
      esFields={["name"]}
      esIndex="shapes_flat"
      searchExistingItems={searchExistingShapes}
      onSearchBlur={() => {
        setTimeout(() => {
          setSearchState(false);
        }, 300);
        setShapes(stateApp.selectedDocument.shapeObj);
      }}
      setSearchState={setSearchState}
      isSearchActive={isSearchActive}
      search={search}
      setSearch={setSearch}
      relatedObjectType="Shape"
    />
  );
}
