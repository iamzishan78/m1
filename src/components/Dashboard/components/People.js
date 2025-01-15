/* eslint-disable no-magic-numbers */
import React, { Fragment, useEffect, useState } from 'react';
import Avatar from 'react-avatar';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import { Box, CardHeader, CircularProgress, Grid, Typography, List } from '@mui/material';

import { useLazyQuery, useQuery } from '@apollo/client';
import PopupState, { bindPopover, bindHover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';

import { getRandomColor } from 'components/Shared/functions/ui';
import CheckCircle from 'components/Shared/svgIcons/check-circle';

import { GET_PROFILES_IMAGES, GETPROFILE } from 'graphQL/useQueryGetProfile';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

const useStyles = makeStyles(() => ({
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
	const [getUserProfile, ProfileData] = useLazyQuery(GETPROFILE, {
		fetchPolicy: 'cache-first',
	});

	const [userProfile, setuserProfile] = useState({
		displayName: '',
		jobTitle: '',
		email: '',
		mobilephone: '',
		about: '',
		img: '',
	});
	const [userProfileLoading, setuserProfileLoading] = useState();

	const handlePopoverOpen = user => {
		getUserProfile({
			variables: { email: user?.email },
		});
	};

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
		if (ProfileData?.loading) {
			setuserProfileLoading(true);
		} else if (ProfileData?.data) {
			setuserProfile({
				displayName: ProfileData?.data?.profileByEmail?.profile?.displayName,
				jobTitle: ProfileData?.data?.profileByEmail?.profile?.jobTitle,
				email: ProfileData?.data?.profileByEmail?.profile?.email,
				mobilephone: ProfileData?.data?.profileByEmail?.profile?.mobilephone,
				about: ProfileData?.data?.profileByEmail?.profile?.about,
				img: ProfileData?.data?.profileByEmail?.profile?.profileImage,
			});
			setuserProfileLoading(false);
		}
	}, [userLists, getProfilesImages, ProfileData]);

	useEffect(() => {
		if (profilesData?.data?.profileByEmail?.profiles) {
			setProfilesInfo(profilesData.data.profileByEmail.profiles);
		}
	}, [profilesData]);

	const PeopleCardContainer = () => {
		return (
			<Grid
				container
				spacing={1}
				rowSpacing={2}
				sx={{ paddingLeft: { sm: 0, md: 6 }, flexDirection: { xs: 'column', sm: 'row' } }}
			>
				{!usersData.length ? (
					<Grid item xs={12} md={12} sm={12}>
						<Typography variant="body1" fontSize={'1rem'}>
							No People Found
						</Typography>
					</Grid>
				) : (
					<Fragment>
						{usersData.map((user, index) => {
							return (
								<Grid item xs={6} key={user._id}>
									<PopupState variant="popover" popupId="demo-popup-popover-zone">
										{popupState => (
											<>
												<Box display={'flex'} alignItems={'center'} position={'relative'}>
													<Box
														id={`profile-${index}`}
														onMouseEnter={() => handlePopoverOpen(user)}
														{...bindHover(popupState)}
													>
														{profilesInfo[user?.email]?.profileImage ? (
															<Avatar
																src={profilesInfo[user?.email].profileImage}
																size="60"
																round
																style={{ cursor: 'pointer' }}
															/>
														) : (
															<Avatar
																color={getRandomColor(user?.displayName)}
																fgColor="#fff"
																name={user?.displayName ? user?.displayName.split(' ').splice(0, 2).join(' ') : ''}
																size="60"
																round
																style={{ cursor: 'pointer' }}
															/>
														)}
													</Box>
													<Typography fontSize={'0.8rem'} sx={{ marginLeft: '8px' }}>
														{user?.displayName ? user?.displayName : ''}
													</Typography>

													<HoverPopover
														{...bindPopover(popupState)}
														anchorEl={document.getElementById(`profile-${index}`)}
														anchorOrigin={{
															vertical: 'top',
															horizontal: 'right',
														}}
														transformOrigin={{
															vertical: 'bottom',
															horizontal: 'center',
														}}
														style={{
															width: 'auto',
															position: 'absolute',
															zIndex: 1,
															marginTop: '-1%',
															marginLeft: '3%',
														}}
													>
														{userProfileLoading ? (
															<Box
																display={'flex'}
																alignItems={'center'}
																justifyContent={'center'}
																gap={'20px'}
																height={'5vh'}
																width={'10vw'}
															>
																<Typography>Loading...</Typography>
																<CircularProgress disableShrink size={20} />
															</Box>
														) : (
															<Box
																padding="5px"
																style={{
																	maxWidth: '100%',
																	width: 'fit-content',
																	height: '100%',
																	boxShadow: '10px 10px 20px 10px rgba(0, 0, 0, 0.2)',
																}}
																borderRadius="10px"
															>
																<Box display="flex" gap={2} width={'100%'} alignItems={'center'}>
																	<Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
																		{userProfile?.img ? (
																			<Avatar src={userProfile?.img} alt="Sample" size="150" />
																		) : (
																			<Avatar
																				color={getRandomColor(user?.displayName)}
																				fgColor="#fff"
																				name={
																					user?.displayName ? user?.displayName.split(' ').splice(0, 2).join(' ') : ''
																				}
																				size="150"
																			/>
																		)}
																	</Box>
																	<Box display="flex" flexDirection="column" gap={2} flexWrap={'wrap'}>
																		<Box>
																			<Typography
																				classes={{ root: classes.label, focused: classes.focused }}
																				sx={{ fontWeight: 'bold' }}
																			>
																				{userProfile?.displayName}
																			</Typography>
																			<Typography
																				sx={{ opacity: '0.9' }}
																				classes={{ root: classes.label, focused: classes.focused }}
																			>
																				{userProfile?.job}
																			</Typography>
																			<Typography
																				sx={{ opacity: '0.75' }}
																				className={`${classes.label} ${classes.focused} ${classes.disabledLabel}`}
																			>
																				{userProfile?.email}
																			</Typography>
																			<Typography
																				sx={{ opacity: '0.75' }}
																				classes={{ root: classes.label, focused: classes.focused }}
																			>
																				{userProfile?.mobilephone}
																			</Typography>
																		</Box>

																		<Box>
																			<Typography
																				sx={{ opacity: '0.5' }}
																				classes={{
																					root: classes.label,
																					focused: classes.focused,
																				}}
																			>
																				{userProfile?.about}
																			</Typography>
																		</Box>

																		<Box>
																			<Button
																				variant="outlined"
																				component="span"
																				className={classes.button}
																				sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}
																			>
																				<CheckCircle />
																				<Box sx={{ marginLeft: '3px' }}>Assign task</Box>
																			</Button>
																		</Box>
																	</Box>
																</Box>
															</Box>
														)}
													</HoverPopover>
												</Box>
											</>
										)}
									</PopupState>
								</Grid>
							);
						})}
					</Fragment>
				)}
			</Grid>
		);
	};

	return (
		<>
			<CardHeader className={classes.headerTitle} title={'People'} />
			{loading ? (
				<CircularProgress disableShrink size={80} />
			) : (
				<List id="people-list" style={{ maxHeight: 'calc(100% - 70px)', overflow: 'auto' }}>
					<PeopleCardContainer />
				</List>
			)}
		</>
	);
};

export default People;
