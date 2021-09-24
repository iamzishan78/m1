import React from "react";

import { ContactDetailsContextProvider } from "components/ContactDetailCard/ContactDetailsContext";
import ContactParcelInterestCard from './ContactParcelInterestCard'


export default function ContactParcelsInterestProvider(props) {
  return (
    <ContactDetailsContextProvider>
      <ContactParcelInterestCard>
        {props.children}
      </ContactParcelInterestCard>
    </ContactDetailsContextProvider>
  );
}
