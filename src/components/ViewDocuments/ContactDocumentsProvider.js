import React from "react";

import { ContactDetailsContextProvider } from "../ContactDetailCard/ContactDetailsContext";
import ContactDocumentsCard from './ContactDocumentsCard'


export default function ContactDocumentsProvider(props) {
  return (
    <ContactDetailsContextProvider>
      <ContactDocumentsCard>
        {props.children}
      </ContactDocumentsCard>
    </ContactDetailsContextProvider>
  );
}
