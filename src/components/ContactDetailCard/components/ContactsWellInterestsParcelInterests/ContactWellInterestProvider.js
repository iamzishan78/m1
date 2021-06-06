import React from "react";

import { ContactDetailsContextProvider } from "components/ContactDetailCard/ContactDetailsContext";
import ContactWellInterestCard from './ContactWellInterestCard'


export default function ContactWellInterestProvider(props) {
  return (
    <ContactDetailsContextProvider>
      <ContactWellInterestCard>
        {props.children}
      </ContactWellInterestCard>
    </ContactDetailsContextProvider>
  );
}
