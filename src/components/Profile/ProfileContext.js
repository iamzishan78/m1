import React, { createContext, useState } from 'react';
import Profile from './Profile';

const ProfileContext = createContext([{}, () => {}]);
const ProfileContextProvider = props => {
	const [stateProfile, setStateProfile] = useState({
		fields: {
			fullname: '',
			firstname: '',
			middlename: '',
			lastname: '',
			displayName: '',
			activity: '',
			timezone: '',
			profileImage: '',
			email: '',
			outlook_integrated: false,
			sss_tax_id: '',
			dateOfBirth: '',
			address: '',
			city: '',
			state: '',
			phone: '',
			mobilephone: '',
			workphone: '',
			company: '',
			jobTitle: '',
			industry: '',
			isAccreditedInvestor: '',
			investingExperience: [],
			CREexperience: '',
			emailNotifications: '',
			employer: '',
			employerAddress: '',
			about: '',
			isSameFromAbove: false,
			investingEntities: [],
			investingPreferences: [],
			notificationPreferences: {
				newDeals: false,
				dealEntersAssignedLane: false,
				mentions: false,
				myClosedTasks: false,
				newTaskAssigned: false,
			},
		},
		isImageModalOpen: false,
		isSaving: false,
	});

	return <ProfileContext.Provider value={[stateProfile, setStateProfile]}>{props.children}</ProfileContext.Provider>;
};

export { ProfileContext, ProfileContextProvider };
