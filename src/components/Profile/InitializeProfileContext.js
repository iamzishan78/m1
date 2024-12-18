import { useQuery } from '@apollo/client';
import { GETPROFILE } from '../../graphQL/useQueryGetProfile';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../AppContext';
import { ProfileContext } from './ProfileContext';

export default function InitializeProfile() {
	const [stateApp] = useContext(AppContext);
	const [stateProfile, setStateProfile] = useContext(ProfileContext);
	const {
		user: { email },
	} = stateApp;
	const { data } = useQuery(GETPROFILE, {
		variables: { email },
		fetchPolicy: 'network-only',
	});

	useEffect(() => {
		if (data?.profileByEmail?.profile) {
			const {
				profileByEmail: {
					profile: {
						_id,
						fullname,
						displayName,
						activity,
						phone,
						timezone,
						profileImage,
						email,
						firstname,
						middlename,
						lastname,
						sss_tax_id,
						outlook_integrated,
						dateOfBirth,
						address,
						city,
						state,
						mobilephone,
						workphone,
						company,
						jobTitle,
						industry,
						isAccreditedInvestor,
						investingExperience,
						CREexperience,
						emailNotifications,
						employer,
						about,
						isSameFromAbove,
						employerAddress,
						investingEntities,
						investingPreferences,
						notificationPreferences,
					},
				},
			} = data;
			const { __typename, ...restNotificationSettings } = notificationPreferences || {};

			setStateProfile({
				...stateProfile,
				fields: {
					_id,
					fullname,
					displayName,
					activity,
					phone,
					timezone,
					profileImage,
					email,
					firstname,
					middlename,
					lastname,
					sss_tax_id,
					outlook_integrated,
					dateOfBirth,
					address,
					city,
					state,
					mobilephone,
					workphone,
					company,
					jobTitle,
					industry,
					isAccreditedInvestor,
					investingExperience,
					CREexperience,
					emailNotifications,
					employer,
					about,
					isSameFromAbove,
					employerAddress,
					investingEntities,
					investingPreferences,
					notificationPreferences: { ...restNotificationSettings },
				},
			});
		}
	}, [data]);
	return null;
}
