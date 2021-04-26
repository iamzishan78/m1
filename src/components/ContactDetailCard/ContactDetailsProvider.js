import React from "react";

import { ContactDetailsContextProvider } from "./ContactDetailsContext";
import ContactDetailCard from './ContactDetailCard'


export default function ContactDetailsProvider(props) {
  return (
    <ContactDetailsContextProvider>
      <ContactDetailCard>
        {props.children}
      </ContactDetailCard>
    </ContactDetailsContextProvider>
  );
}
