import React, { createContext, useState } from "react";
import Profile from './Profile';

const ProfileContext = createContext([{}, () => {}]);
const ProfileContextProvider = (props) => {
  const [stateProfile, setStateProfile] = useState({
    fields: {
      fullname: "",
      firstname: "",
      middlename:"",
      lastname: "",
      displayname: "",
      activity: "",
      timezone: "",
      profileImage: "",
      email: "",
      outlook_integrated: "",
      sss_tax_id: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      mobilephone:"",
      workphone:"",
      company : "",
      jobTitle: "",
      industry: "",
      isAccreditedInvestor: "",
      investingExperience: [], 
      CREexperience: "",
      emailNotifications: "",
      employer: "",
      employerAddress: "",
      isSameFromAbove: false,
      investingEntities: [],
      investingPreferences: [],
    },
    isImageModalOpen: false,
    isSaving:false,
  });

  return (
    <ProfileContext.Provider value={[stateProfile, setStateProfile]}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileContextProvider };
