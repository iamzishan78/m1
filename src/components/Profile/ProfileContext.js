import React, { createContext, useState } from "react";

const ProfileContext = createContext([{}, () => {}]);

const ProfileContextProvider = (props) => {
  const [stateProfile, setStateProfile] = useState({
    fields: {
      fullname: "",
      displayname: "",
      activity: "",
      phone: "",
      timezone: "",
      profileImage: "",
    },
    isImageModalOpen: false,
  });
  return (
    <ProfileContext.Provider value={[stateProfile, setStateProfile]}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileContextProvider };
