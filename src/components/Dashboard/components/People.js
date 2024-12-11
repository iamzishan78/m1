import React, { Fragment, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Box, CardHeader, CircularProgress, Grid, Typography } from '@mui/material';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';
import { makeStyles } from '@material-ui/styles';
import Avatar from 'react-avatar';
import { getRandomColor } from 'components/Shared/functions/ui';
import { GET_PROFILES_IMAGES } from 'graphQL/useQueryGetProfile';

const useStyles = makeStyles(theme => ({
	headerTitle: {
		width: '100%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
}));

const People = () => {
	const classes = useStyles();
	const [profilesInfo, setProfilesInfo] = useState({});
	const [usersData, setUsersData] = useState([]);
	const { data: userLists, loading } = useQuery(GETMONGOUSERS);
	const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
		fetchPolicy: 'cache-first',
	});

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			const data = userLists.allMongoUsers
				?.map(user => ({
					_id: user._id,
					name: user.name,
					displayName: user.displayName || user.name,
					email: user.email,
				}))
				.filter(user => user._id && user.name);
			setUsersData(data);
			const emails = userLists.allMongoUsers?.map(user => user.email);
			getProfilesImages({
				variables: { emails },
			});
		}
	}, [userLists, getProfilesImages]);

	useEffect(() => {
		if (profilesData?.data?.profileByEmail?.profiles) {
			setProfilesInfo(profilesData.data.profileByEmail.profiles);
		}
	}, [profilesData]);

	const PeopleCardContainer = () => {
		return (
			<>
				<Grid
					container
					spacing={1}
					rowSpacing={2}
					sx={{ marginLeft: '8px', marginRight: '8px', maxHeight: 'calc(100% - 70px)', overflow: 'auto' }}
				>
					{!usersData.length ? (
						<Grid item xs={12} md={12} sm={12}>
							<Typography variant="body1" fontSize={'1rem'}>
								No People Found
							</Typography>
						</Grid>
					) : (
						<Fragment>
							{usersData.map(user => {
								return (
									<Grid item xs={6}>
										<Box display={'flex'} alignItems={'center'}>
											{profilesInfo[user?.email]?.profileImage ? (
												<Avatar src={profilesInfo[user?.email].profileImage} size="60" round />
											) : (
												<Avatar
													color={getRandomColor(user?.displayName)}
													fgColor="#fff"
													name={user?.displayName ? user?.displayName.split(' ').splice(0, 2).join(' ') : ''}
													size="60"
													round
												/>
											)}
											<Typography fontSize={'0.8rem'} sx={{ marginLeft: '8px' }}>
												{user?.displayName ? user?.displayName : ''}
											</Typography>
										</Box>
									</Grid>
								);
							})}
						</Fragment>
					)}
				</Grid>
			</>
		);
	};

	return (
		<>
			<CardHeader
				className={classes.headerTitle}
				title={
					<Typography variant="h5" margin={'8px'}>
						People
					</Typography>
				}
			/>
			{loading ? <CircularProgress disableShrink size={80} /> : <PeopleCardContainer />}
		</>
	);
};

export default People;
