import React, { useState, createContext } from "react";

const TitleContext = createContext([{}, () => {}]);

const TitleContextProvider = props => {
  const [stateTitle, setStateTitle] = useState({
    Projects: [
      {
        id: 1,
        name: "Project X",
        client: { name: "Client Name" },
        titleOpinions: [
          { id: 1, name: "Title Opinion 1" },
          { id: 2, name: "Title Opinion 2" },
          { id: 3, name: "Title Opinion 3" }
        ]
      },
      {
        id: 2,
        name: "Project Y",
        client: { name: "Client Name" },
        titleOpinions: [
          { id: 4, name: "Title Opinion 1" },
          { id: 5, name: "Title Opinion 2" },
          { id: 6, name: "Title Opinion 3" }
        ]
      },
      {
        id: 3,
        name: "Project Z",
        client: { name: "Client Name" },
        titleOpinions: [
          { id: 7, name: "Title Opinion 1" },
          { id: 8, name: "Title Opinion 2" },
          { id: 9, name: "Title Opinion 3" }
        ]
      }
    ],
    selectedProjectId: null
  });
  return (
    <TitleContext.Provider value={[stateTitle, setStateTitle]}>
      {props.children}
    </TitleContext.Provider>
  );
};

export { TitleContext, TitleContextProvider };
