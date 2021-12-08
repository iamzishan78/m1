import React from "react";

import { LandManagementContextProvider } from "./LandManagementContext";
import LandManagement from "./LandManagement";

export default function ContactDetailsProvider(props) {
  return (
    <LandManagementContextProvider>
      <LandManagement>{props.children}</LandManagement>
    </LandManagementContextProvider>
  );
}
