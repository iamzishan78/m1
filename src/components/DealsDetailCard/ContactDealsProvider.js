import React from "react";

import { ContactDetailsContextProvider } from "../ContactDetailCard/ContactDetailsContext";
import ContactDealsCard from './ContactDealsCard'


export default function ContactDocumentsProvider(props) {
  return (
    <ContactDetailsContextProvider>
      <ContactDealsCard>
        {props.children}
      </ContactDealsCard>
    </ContactDetailsContextProvider>
  );
}
