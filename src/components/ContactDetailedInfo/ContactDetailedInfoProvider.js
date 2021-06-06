import React from "react";

import { ContactDetailsContextProvider } from "../ContactDetailCard/ContactDetailsContext";
import ContactDetailedInfoCard from './ContactDetailedInfoCard'


export default function ContactDetailsProvider(props) {
  return (
    <ContactDetailsContextProvider>
      <ContactDetailedInfoCard>
        {props.children}
      </ContactDetailedInfoCard>
    </ContactDetailsContextProvider>
  );
}
