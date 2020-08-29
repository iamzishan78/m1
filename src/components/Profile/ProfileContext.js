import React, { createContext, useState } from "react";

const ProfileContext = createContext([{}, () => {}]);
const ProfileContextProvider = (props) => {
  const [stateProfile, setStateProfile] = useState({
    fields: {
      fullname: null,
      firstname: null,
      middlename:null,
      lastname: null,
      displayname: null,
      activity: null,
      timezone: null,
      profileImage: null,
      email: null,
      outlook_integrated: null,
      sss_tax_id: null,
      dateOfBirth: null,
      address: null,
      city: null,
      state: null,
      phone: null,
      mobilephone:null,
      workphone:null,
      company : null,
      jobTitle: null,
      industry: null,
      isAccreditedInvestor: null,
      investingExperience: [], 
      CREexperience: null,
      emailNotifications: null,
      employer: null,
      employerAddress: null,
      isSameFromAbove: false,
      job_title: null,
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
