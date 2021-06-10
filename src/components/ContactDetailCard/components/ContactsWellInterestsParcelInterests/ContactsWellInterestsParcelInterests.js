import React, { useState } from "react";
import Search from "./components/Search";
import { useHistory } from "react-router-dom";
import ContactWellInterestTable from "components/Table/Contact/ContactWellInterestTable";
import ContactParcelInterestTable from "components/Table/Contact/ContactParcelInterestTable";
import TabPanels from "components/Shared/TabPanels";
import TabButtons from "components/Shared/TabPanels/TabButtons";

function ContactsWellInterestsParcelInterests(props) {
  let history = useHistory();
  const type =
  history.location.pathname.split("/")[
    history.location.pathname.split("/").length - 1
  ];

  const [selectedTab, setSelectedTab] = useState(type === 'wells' ? 0 : 1);


  const Header = () => (
    <TabButtons
      labels={["Well Interests", "Parcel Interests"]}
      value={selectedTab}
      setValue={(n) => {
        setSelectedTab(n);
      }}
    />
  );

  return (
    <div>
      {/* temporarily comment search out until we have a chance to build it out fully */}
      <Search contactId={props.contactData._id} />

      <div style={{ position: "relative" }}>
        <TabPanels
          value={selectedTab}
          panels={[
            <ContactWellInterestTable
              parent="assocTaxRollInterests"
              header={<Header />}
              targetLabel="well"
              contactId={props.contactData._id}
              showTracks
            />,
            <ContactParcelInterestTable
              parent="assocTaxRollInterests"
              header={<Header />}
              targetLabel="Parcel Ownership"
              contactId={props.contactData._id}
              showTracks
            />,
          ]}
        />
      </div>
    </div>
  );
}

export default React.memo(ContactsWellInterestsParcelInterests);
