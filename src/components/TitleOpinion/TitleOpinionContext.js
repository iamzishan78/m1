import React, { useState, createContext } from "react";
import moment from "moment";

const TitleOpinionContext = createContext([{}, () => {}]);

const TitleOpinionContextProvider = props => {
  const [stateTitleOpinion, setStateTitleOpinion] = useState({
    TOData: {
      legalDescription: "",
      preparedBy: "",
      certifiedDate: moment().format("MM-DD-YYYY"),
      state: "",
      county: "",
      project: "",
      client: "",
      generalNotes: "",
      MORSections: [],
      runsheetSections: []
    },
    loading: true,
    edited: false,
    MORDefaultSections: ["Mineral Ownership"],
    MORDefaultColumns: [
      "Owner Name",
      "Owner Address",
      "Net Acres",
      "Surface Interest",
      "Mineral Interest",
      "Royalty Interest",
      "ORRI",
      "Record Title",
      "Operating Rights",
      "NRI",
      "Status Leasee/ Optionee Filed At Exp DAte or HBP Royalty"
    ],

    runsheetDefaultSections: ["Limited Title Runsheet"],
    runsheetDefaultColumns: [
      "Doc #",
      "Instrument Type",
      "Party of the First Part (Grantor)",
      "Party of the Second Part (Grantee)",
      "Remainderman/ Life Estate",
      "Effective Date",
      "Instrument Date",
      "File Date",
      "Record Type",
      "Volume",
      "Page",
      "Legal Description (All Tracts Affected)",
      "Mineral Acres Reserved",
      "Mineral Acres Conveyed",
      "Abstractor's Notes",
      "Documents"
    ]
  });

  return (
    <TitleOpinionContext.Provider
      value={[stateTitleOpinion, setStateTitleOpinion]}
    >
      {props.children}
    </TitleOpinionContext.Provider>
  );
};

export { TitleOpinionContext, TitleOpinionContextProvider };
