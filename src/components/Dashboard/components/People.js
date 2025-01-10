/* eslint-disable no-magic-numbers */
import React, { Fragment, useEffect, useState } from 'react';
import Avatar from 'react-avatar';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import { Box, CardHeader, CircularProgress, Grid, Typography, List, Popover } from '@mui/material';

import { useLazyQuery, useQuery } from '@apollo/client';




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
	const [hoverParty, setHoverParty] = useState();
	const { data: userLists, loading } = useQuery(GETMONGOUSERS);
	const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
		fetchPolicy: 'cache-first',
	});
	const [getUserProfile, ProfileData] = useLazyQuery(GETPROFILE, {
		fetchPolicy: 'cache-first',
	});

	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

	const [userProfile, setuserProfile] = useState({
		displayName: '',
		jobTitle: '',
		email: '',
		mobilephone: '',
		about: '',
		img: '',
	});
	const [userProfileLoading, setuserProfileLoading] = useState();

	const handlePopoverOpen = (event, index, user) => {
		const rect = event.currentTarget.getBoundingClientRect();
		setPopoverPosition({
			top: rect.top - 200,
			left: rect.left + rect.width / 2,
		});
		setAnchorEl(event.currentTarget);
		setHoverParty(index);
		getUserProfile({
			variables: { email: user?.email },
		});
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
		setHoverParty(null);
	};

	const open = Boolean(anchorEl);

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
									<Box display={'flex'} alignItems={'center'} position={'relative'}>
										<Box id={`profile-${index}`} onMouseEnter={e => handlePopoverOpen(e, index, user)}>
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
										</Box>
										<Typography fontSize={'0.8rem'} sx={{ marginLeft: '8px' }}>
											{user?.displayName ? user?.displayName : ''}
										</Typography>
									</Box>
									{hoverParty === index && (
										<Popover
											open={open}
											anchorEl={anchorEl}
											onMouseLeave={handlePopoverClose}
											disableRestoreFocus
											disablePortal
											sx={{
												position: 'absolute',
												top: popoverPosition.top < 0 ? 170 : popoverPosition.top > 250 ? 100 : popoverPosition.top,
												left: popoverPosition.left < 180 ? 360 : popoverPosition.left,
												width: '100%',
												height: '100%',
												transform: 'translateX(-50%)',
												zIndex: 1000,

												'@media (min-width: 1400px)': {
													left: popoverPosition.left > 20 ? (popoverPosition.left > 850 ? 500 : popoverPosition) : 110,
													top: popoverPosition.top < 0 ? 15 : popoverPosition.top > 400 ? 250 : popoverPosition.top,
												},

												'@media (min-width: 1280px) and (max-width: 1450px)': {
													left: popoverPosition.left > 700 ? 300 : popoverPosition.left,
												},

												'@media (min-width:694px) and (max-width:920px)': {
													left: popoverPosition.left < 130 ? 250 : popoverPosition.left - 150,
													width: '600px',
													maxHeight: '1000px',
												},
											}}
										>
											{userProfileLoading ? (
												<Box
													display={'flex'}
													alignItems={'center'}
													justifyContent={'center'}
													gap={'20px'}
													height={'10vh'}
													width={'15vw'}
												>
													<Typography>Loading...</Typography>
													<CircularProgress disableShrink size={20} />
												</Box>
											) : (
												<Box
													padding="5px"
													style={{
														width: '40vw',
														height: '100%',
														boxShadow: '10px 10px 20px 10px rgba(0, 0, 0, 0.2)',
													}}
													borderRadius="10px"
												>
													<Box
														display="flex"
														gap={2}
														width={'100%'}
														alignItems={'center'}
														sx={{
															'@media (min-width: 694px) and (max-width: 920px)': {
																width: '300px',
																height: '100px',
															},
														}}
													>
														<Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
															{userProfile?.img !== null ? (
																<img
																	src={userProfile?.img}
																	alt="Sample"
																	style={{
																		width: '12vw',
																		height: '12vw',
																		objectFit: 'cover',
																		borderRadius: '10px',
																		'@media (min-width: 694px) and (max-width: 920px)': {
																			width: '50%',
																			height: '50%',
																		},
																	}}
																/>
															) : (
																<Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
																	<Avatar
																		color={getRandomColor(user?.displayName)}
																		fgColor="#fff"
																		name={user?.displayName ? user?.displayName.split(' ').splice(0, 2).join(' ') : ''}
																		size="150"
																	/>
																</Box>
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
																	className={`${classes.label} ${classes.focused} ${classes.disabledLabel}`} // combine classes
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
										</Popover>
									)}
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
