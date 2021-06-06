import React from "react";

import { ContactDetailsContextProvider } from "../ContactDetailCard/ContactDetailsContext";
import ContactRecentActivitiesCard from './ContactRecentActivitiesCard'


export default function ContactRecentActivitiesProvider(props) {
  return (
    <ContactDetailsContextProvider>
      <ContactRecentActivitiesCard>
        {props.children}
      </ContactRecentActivitiesCard>
    </ContactDetailsContextProvider>
  );
}
