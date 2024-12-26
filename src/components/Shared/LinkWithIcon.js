import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';

import {
	Grid,
	Container,
	Box,
	Typography,
	Badge,
	TextField,
	InputAdornment,
	Button,
	CircularProgress,
	ClickAwayListener,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import KeyboardTabSharpIcon from '@material-ui/icons/KeyboardTabSharp';
import LinkIcon from '@material-ui/icons/Link';
import PersonIcon from '@material-ui/icons/Person';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import SearchIcon from '@material-ui/icons/Search';

import { useLazyQuery, useMutation } from '@apollo/client';
import _ from 'lodash';

import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';

import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

import { AppContext } from 'AppContext';

import {
	LINKED_GLOBAL_OWNERS,
	UNLINK_GLOBAL_OWNER,
	LINK_PLATFORM_OWNER,
} from '../../graphQL/useQueryLinkedGlobalOwners';
import RightDialog from '../ContactDetailCard/components/RightDialog';

export default function LinkWithIcon(props) {
	const [openDialog, setOpenDialog] = useState(false);
	const [inputSearchValue, setSearchValue] = useState('');
	const [showAll, setShow] = useState(false);
	const [showSearchOptions, setShowOptions] = useState(false);
	const [stateApp, setStateApp] = useContext(AppContext);
	const [processingPlatformOwners, setProcessingOwners] = useState([]);
	const [isDeleteGlobalOwnerDialog, setGlobalOwnerDialog] = useState({
		state: false,
		globalOwner: '',
	});

	const [getLinkedGlobalOwners, { data }] = useLazyQuery(LINKED_GLOBAL_OWNERS, {
		fetchPolicy: 'cache-and-network',
	});
	const [unlinkGlobalOwners] = useMutation(UNLINK_GLOBAL_OWNER);
	const [linkTaxOwners] = useMutation(LINK_PLATFORM_OWNER);
	const [getESSimpleSearch, { data: esSearchData, loading }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		if (props.objectId) {
			getLinkedGlobalOwners({
				variables: {
					contactId: props.objectId,
				},
			});
		}
	}, [props.objectId]);

	useEffect(() => {
		if (openDialog && props?.contact?.name) {
			setSearchValue(props.contact.name);
			// setShowOptions(true);
		}
	}, [openDialog]);

	useEffect(() => {
		if (inputSearchValue) {
			debouncedSearch(inputSearchValue, showAll);
		}
	}, [inputSearchValue, showAll]);

	const useStyles = makeStyles(theme => ({
		icons: {
			color: '#ffffff',
			marginLeft: 'auto',
			backgroundColor: '#f2f2f2',
			'&:hover': {
				backgroundColor: props.targetLabel === 'deal' ? '#dadbde88 !important' : '#eeeeee',
			},
		},
		iconSelected: {
			color: theme.palette.secondary.main,
			'& svg': {
				fill: `${theme.palette.secondary.main} !important`,
			},
		},
		heading: {
			fontSize: 'initial',
			fontWeight: 800,
			marginBottom: '10px',
		},
		badge: {
			'& .MuiBadge-anchorOriginTopRightRectangle': {
				top: '7px',
			},
		},
		dialog: {
			zIndex: '9999999999 !important',
		},
		removeIcon: {
			'& svg': {
				fill: 'red !important',
			},
		},
		ownerIdGrid: {
			paddingLeft: '5px !important',
		},
		searchContainer: {
			overflowY: 'auto',
			border: '1px solid lightgrey',
			padding: '0.5rem',
			position: 'absolute',
			zIndex: 1,
			backgroundColor: '#FFF',
		},
	}));

	const classes = useStyles();

	const getGlobalOwners = () => {
		return data && data.linkedGlobalOwners && data.linkedGlobalOwners.data ? data.linkedGlobalOwners.data : [];
	};

	const handleSearch = value => {
		setSearchValue(value);
	};

	const debouncedSearch = useMemo(() => {
		return _.debounce((search, showAll) => {
			getESSimpleSearch({
				variables: {
					index: 'platformData:globalowner',
					pagination: {
						first: showAll ? 200 : 25,
						keep_alive: '1micros',
					},
					search: {
						query: search,
						fields: ['ownerName', 'streetAddress', 'city', 'state', 'zip'],
					},
					sort: [],
				},
			});
		}, 1000);
	}, []);

	const handleRemoveGlobalOwner = () => {
		handleProcessingOwners(isDeleteGlobalOwnerDialog.globalOwner, 'add');

		unlinkGlobalOwners({
			variables: {
				contactId: props.objectId,
				globalOwner: isDeleteGlobalOwnerDialog.globalOwner,
			},
			refetchQueries: ['getLinkedGlobalOwners', 'getContactSummary'],
			awaitRefetchQueries: true,
			onCompleted: () => {
				handleProcessingOwners(isDeleteGlobalOwnerDialog.globalOwner, 'delete');
			},
			onError: () => {
				handleProcessingOwners(isDeleteGlobalOwnerDialog.globalOwner, 'delete');
			},
		});
	};

	const closeSearchSuggestions = () => {
		setShowOptions(false);
	};

	const handleProcessingOwners = (value, action = 'add') => {
		const set = new Set(processingPlatformOwners);

		if (action === 'add') {
			set.add(value);
		} else {
			set.delete(value);
		}

		setProcessingOwners(Array.from(set));
	};

	const handleLinkTaxOwners = taxOwner => {
		const contact = {};
		const acceptedFields = [
			'name',
			'address1',
			'address2',
			'city',
			'state',
			'zip',
			'country',
			'globalOwner',
			'title',
			'firstName',
			'lastName',
			'middleName',
			'suffix',
		];

		handleProcessingOwners(taxOwner.globalOwnerId, 'add');

		for (let i in props.contact) {
			if (acceptedFields.includes(i)) {
				contact[i] = props.contact[i];
			}
		}
		contact.globalOwner = taxOwner.globalOwnerId;

		linkTaxOwners({
			variables: {
				contactId: props.objectId,
				contact,
				userId: stateApp.user.mongoId,
			},
			refetchQueries: ['getLinkedGlobalOwners', 'getContactSummary'],
			awaitRefetchQueries: true,
			onCompleted: () => {
				handleProcessingOwners(taxOwner.globalOwnerId, 'delete');
			},
			onError: () => {
				handleProcessingOwners(taxOwner.globalOwnerId, 'delete');
			},
		});
	};

	const isLinked = taxOwner => {
		const globalOwners = getGlobalOwners();

		return Boolean(globalOwners.find(globalOwner => globalOwner.globalOwner === taxOwner.globalOwnerId));
	};

	return (
		<React.Fragment>
			<Tooltip id="link-button" title={'Linked Global Owner'} placement="top">
				<Badge
					className={classes.badge}
					badgeContent={props.iconZiseSmall ? null : getGlobalOwners().length}
					color="secondary"
				>
					<IconButton
						size={props.iconZiseSmall ? 'small' : 'medium'}
						color="primary"
						className={`${classes.icons}  ${openDialog || getGlobalOwners().length > 0 ? classes.iconSelected : ''}`}
						onClick={() => {
							setOpenDialog(true);
						}}
						aria-label="show linked global owner"
					>
						<LinkIcon />
					</IconButton>
				</Badge>
			</Tooltip>
			{openDialog && (
				<RightDialog open={true}>
					<Container maxWidth="sm" className={classes.gridWidthScroll}>
						<div className={classes.dealContainer}>
							<Box pb={3} pt={1} style={{ position: 'relative' }}>
								<Grid container direction="row" spacing={4} justify="space-between" alignItems="center">
									<Grid item>
										<Typography
											className={classes.topHeading}
											style={{ fontWeight: 'bold' }}
											variant="h5"
											component="h2"
										>
											Linked Platform Owners
										</Typography>
									</Grid>
									<Grid item>
										<IconButton aria-label="delete" color="primary" onClick={() => setOpenDialog(false)}>
											<KeyboardTabSharpIcon />
										</IconButton>
									</Grid>
								</Grid>
								<Grid xs={12} onClick={() => setShowOptions(true)}>
									<Typography style={{ marginBottom: 5 }}>
										Search for similarly named platform owners and associate to contact
									</Typography>
									<TextField
										fullWidth
										variant="outlined"
										type="text"
										autoFocus
										onFocus={() => setShowOptions(true)}
										value={inputSearchValue}
										onChange={({ target }) => handleSearch(target.value)}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<SearchIcon />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<IconButton onClick={() => handleSearch('')}>
														<CloseIcon />
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
								{showSearchOptions && (
									<ClickAwayListener onClickAway={closeSearchSuggestions}>
										<Grid
											container
											className={classes.searchContainer}
											style={{
												maxHeight: showAll ? 500 : 300,
											}}
										>
											<Grid container item xs={12} className={classes.groupsHeaders}>
												<Grid item xs={6}>
													<Typography color={'primary'}>PLATFORM OWNERS</Typography>
												</Grid>
												{!_.isEmpty(esSearchData?.getESSimpleSearch?.hits) && (
													<Grid
														item
														xs={6}
														style={{
															textAlign: 'right',
															display: 'flex',
															justifyContent: 'flex-end',
															alignItems: 'center',
														}}
													>
														<Button
															size="small"
															className={classes.groupsButton}
															onClick={() => {
																setShow(!showAll);
															}}
														>
															{showAll ? 'See Less' : 'See All'}
														</Button>
													</Grid>
												)}
											</Grid>
											{loading && (
												<Grid container justifyContent="center">
													<CircularProgress color="secondary" />
												</Grid>
											)}
											{esSearchData?.getESSimpleSearch?.hits?.map(taxOwner => (
												<ListGlobalOwners
													taxOwner={taxOwner}
													onClick={() => {
														isLinked(taxOwner)
															? setGlobalOwnerDialog({
																	state: true,
																	globalOwner: taxOwner.globalOwnerId,
																})
															: handleLinkTaxOwners(taxOwner);
													}}
													key={'search_tax_owners' + taxOwner._id}
													isLinked={isLinked(taxOwner)}
													isLoading={processingPlatformOwners.includes(taxOwner.globalOwnerId)}
												/>
											))}
											{!loading && _.isEmpty(esSearchData?.getESSimpleSearch?.hits) && (
												<Grid container justifyContent="center">
													<Typography>No platform owners found.</Typography>
												</Grid>
											)}
										</Grid>
									</ClickAwayListener>
								)}
								{getGlobalOwners().length > 0 ? (
									<>
										<Box mt={2}>
											<Typography>The below platform owners are linked to the selected contact.</Typography>
										</Box>

										<Box pt={3}>
											<Typography style={{ fontWeight: 'bold' }}>Platform owners</Typography>
										</Box>
									</>
								) : (
									<Box mt={2}>
										<Typography>No Platform Owner linked to selected contact.</Typography>
									</Box>
								)}
							</Box>

							<Grid container justify="center" alignItems="center" className={classes.heading}>
								<Grid item md={3}>
									Owner ID
								</Grid>
								<Grid item md={9}>
									Name &amp; Address
								</Grid>
							</Grid>

							{getGlobalOwners().map(row => (
								<Grid container direction="row" spacing={2} alignItems="center" key={row.id}>
									<Grid item md={12}>
										<Typography style={{ backgroundColor: '#edfbff' }}>
											<Grid container justify="center" alignItems="center">
												<Grid item md={3} className={classes.ownerIdGrid}>
													{row.id}
												</Grid>
												<Grid item md={8}>
													<Grid container>
														<Grid item md={12}>
															{row.name}
														</Grid>
														<Grid item md={12}>
															{row.address1} {row.address2} {row.city}, {row.state} {row.zip}
														</Grid>
													</Grid>
												</Grid>
												<Grid item md={1}>
													<IconButton
														size="medium"
														className={isDeleteGlobalOwnerDialog.state ? classes.removeIcon : ''}
													>
														{processingPlatformOwners.includes(row.globalOwner) ? (
															<CircularProgress color="secondary" size={20} />
														) : (
															<RemoveCircleOutlineIcon
																onClick={() =>
																	setGlobalOwnerDialog({
																		state: true,
																		globalOwner: row.globalOwner,
																	})
																}
															/>
														)}
													</IconButton>
												</Grid>
											</Grid>
										</Typography>
									</Grid>
								</Grid>
							))}
						</div>
					</Container>
				</RightDialog>
			)}
			<Dialog
				className={classes.dialog}
				open={isDeleteGlobalOwnerDialog.state}
				onClose={() => setGlobalOwnerDialog(state => ({ ...state, state: false }))}
				fullWidth={false}
				maxWidth="sm"
			>
				<DeleteConfirmationDialogContent
					header="Remove Global Owner"
					onClose={() => setGlobalOwnerDialog(state => ({ ...state, state: false }))}
					deleteFunc={handleRemoveGlobalOwner}
					m1nSelectedRowsIds={null}
					setM1nSelectedRowsIndexes={() => {}}
				>
					Are you sure you want to remove this Global Owner?
				</DeleteConfirmationDialogContent>
			</Dialog>
		</React.Fragment>
	);
}

const ListGlobalOwners = ({ taxOwner, onClick, isLinked, isLoading }) => {
	return (
		<Grid container spacing={0} style={{ cursor: 'pointer' }}>
			<Grid container item xs spacing={2} alignItems="center" style={{ marginBottom: 5 }}>
				<Grid item>
					<PersonIcon color={'#757575'} />
				</Grid>
				<Grid item xs>
					<span>{taxOwner.ownerName}</span>
					<Typography variant="body2" color="textSecondary">
						{taxOwner.streetAddress}, {taxOwner.city}, {taxOwner.state}, {taxOwner.zip}
					</Typography>
				</Grid>
			</Grid>
			<Grid item alignItems="center" justifyContent="center">
				{isLoading ? (
					<CircularProgress color="secondary" size={20} />
				) : (
					<IconButton color={isLinked ? 'primary' : '#757575'} onClick={onClick}>
						{isLinked ? <LinkIcon color="primary" /> : <ControlPointIcon />}
					</IconButton>
				)}
			</Grid>
		</Grid>
	);
};
