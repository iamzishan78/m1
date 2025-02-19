import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery, useMutation } from '@apollo/client';

import EntityType from 'components/ContactDetailCard/components/FieldContent/EntityType';
import { contactStatusOptions, featureFlagChanges } from 'components/ContactDetailedInfo/helper';

import { tableGlobalController } from 'controllers/tableController';

import { AppContext } from '../../../../../AppContext';
import { ADDCONTACT } from '../../../../../graphQL/useMutationAddContact';
import { GETMONGOUSERS } from '../../../../../graphQL/useQueryGetUsers';
import { PAGINATEDCONTACTSQUERY } from '../../../../../graphQL/useQueryPaginatedContacts';
import { Modals } from '../../../../../styles/Modal';
import RightDialog from '../../../../ContactDetailCard/components/RightDialog';
import Taps from '../../../Taps';

const phonenumber = inputtxt => {
	if (inputtxt.match(/^([0-9]||-|\(|\)|\.|,)+$/) !== null) {
		return true;
	}
	return false;
};
const email = inputtxt => {
	if (inputtxt.match(/^(([0-9a-zA-Z]|\.)+@?[0-9a-zA-Z]*\.?[0-9a-zA-Z]*)?$/) !== null) {
		return true;
	}
	return false;
};

const zipCopde = inputtxt => {
	if (inputtxt.match(/^([0-9]+-?[0-9]*)?$/) !== null) {
		return true;
	}
	return false;
};

const useStyles = makeStyles(theme => ({
	maxWidth: {
		width: '100%',
	},
	dialogContent: {
		maxHeight: 'calc(100vh - 135px)',
		'& header': {
			position: 'absolute',
			left: '0',
			top: '55px',
		},
		flex: 'none',
	},
	dialogTitle: {
		paddingBottom: dataContacts => (dataContacts ? '55px' : '16px'),
	},
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
		margin: '0 28px 15px 0',
	},
	footerButton: {
		letterSpacing: '1px',
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: '8px 20px',
		width: '120px',
	},
	closeIcon: {
		color: theme.palette.secondary.main,
	},
	loaderWrapper: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		zIndex: 9999,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	loader: {
		position: 'absolute',
		top: '50%',
		left: '50%',
	},
}));

export default function AddContactDialogContent(props) {
	const [stateApp] = React.useContext(AppContext);
	const [validated, setValidated] = useState(false);
	const [activeTapIndex, setActiveTapIndex] = useState(0);
	const [contacts, setContacts] = useState([]);
	const [users, setUsers] = useState([]);
	const [isAddingContact, setIsAddingContact] = useState(false);
	const [existingContact, setExistingContact] = useState({ name: '' });
	const [newContact, setNewContact] = useState({
		firstName: '',
		middleName: '',
		lastName: '',
		mobilePhone: '',
		homePhone: '',
		primaryEmail: '',
		address1: '',
		address2: '',
		city: '',
		country: '',
		state: '',
		zip: '',
		contactOwner: '',
		// owners: props.parent ? [props.parent] : [],
	});

	const isPurchasedOptions = [
		{ label: 'Yes', value: 'true' },
		{ label: 'No', value: 'false' },
	];

	const { user } = useSelector(state => state.app);
	const showGenericPhones = React.useMemo(() => user.features?.find(f => f.name === 'showGenericPhones'), [user]);

	const [getPaginatedContacts, { loading: loadingContacts, data: dataContacts }] = useLazyQuery(
		PAGINATEDCONTACTSQUERY,
		{
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first',
		}
	);

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});

	const [addContact, { data: addContactData, called: addContactCalled, loading: addContactLoading }] =
		useMutation(ADDCONTACT);

	/// / comented after scale to more than 100 000 contacts
	// useEffect(() => {
	//   if (props.parent || props.setDealsContact) {
	//     getPaginatedContacts();
	//   }
	// }, [props.parent, props.setDealsContact]);

	// useEffect(() => {
	//   if (
	//     dataContacts &&
	//     dataContacts.contacts &&
	//     dataContacts.contacts.length > 0
	//   ) {
	//     setContacts([...dataContacts.contacts]);
	//   }
	// }, [dataContacts]);

	useEffect(() => {
		if (
			(activeTapIndex === 1 && existingContact.name !== '') ||
			(activeTapIndex === 0 && newContact.firstName.trim() !== '') /* && newContact.lastName.trim() !== "" */
			//   &&
			// !validated
		) {
			setValidated(true);
		} else {
			setValidated(false);
		}
	}, [activeTapIndex, existingContact, newContact.firstName, newContact.lastName]); /// ////////add other inputs

	useEffect(() => {
		emptyStates();
	}, [activeTapIndex]);

	useEffect(() => {
		getAllMongoUsers();
	}, []);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			setUsers(
				userLists.allMongoUsers.map(user => ({
					value: user._id,
					text: user.name,
				}))
			);
		}
	}, [userLists]);

	const emptyStates = () => {
		setExistingContact({ name: '' });
		setNewContact({
			...newContact,
			firstName: '',
			middleName: '',
			lastName: '',
			mobilePhone: '',
			homePhone: '',
			primaryEmail: '',
			address1: '',
			address2: '',
			city: '',
			country: '',
			state: '',
			zip: '',
		});
	};

	useEffect(() => {
		if (addContactData && addContactCalled && !addContactLoading) {
			if (props.dealsPage) {
				props.setDealsContact(addContactData.addContact.contact);
				props.onClose();
				setActiveTapIndex(0);
				emptyStates();
			}
		}
	}, [addContactData, addContactCalled, addContactLoading]);

	const handleClickDialogClose = e => {
		e.preventDefault();
		props.onClose();
		setActiveTapIndex(0);
		emptyStates();
	};

	const handleClickAdd = async e => {
		setIsAddingContact(true);
		e.preventDefault();
		if (props.dealsPage) {
			if (activeTapIndex === 0) {
				await addContact({
					variables: {
						contact: {
							...newContact,
							createBy: stateApp.user.mongoId,
							lastUpdateBy: stateApp.user.mongoId,
						},
					},
					refetchQueries: ['getPaginatedContacts', 'getContact', 'getESContacts', 'getESSimpleSearch'],
					awaitRefetchQueries: true,
				});
				e.preventDefault();
			} else if (activeTapIndex === 1) {
				props.setDealsContact(existingContact);
				handleClickDialogClose(e);
			}
			return;
		}

		// if (props.parent && activeTapIndex === 1) {
		//   //////update///// existingContact   //////////

		// }

		if (!props.parent || (props.parent && activeTapIndex === 0)) {
			/// ///add new///// newContact ////////////
			await addContact({
				variables: {
					contact: {
						...newContact,
						createBy: stateApp.user.mongoId,
						lastUpdateBy: stateApp.user.mongoId,
					},
				},
				refetchQueries: ['getPaginatedContacts', 'getContact', 'getESContacts', 'getESSimpleSearch'],
				awaitRefetchQueries: true,
			});
		}

		handleClickDialogClose(e);
		tableGlobalController.refetch();
		setIsAddingContact(false);
	};

	const selectExisting = () => (
		<div style={{ paddingTop: '15%' }}>
			{!loadingContacts ? (
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Autocomplete
							size="small"
							className={classes.maxWidth}
							style={{ minWidth: '325.6px' }}
							options={contacts}
							getOptionLabel={option =>
								option && option.name ? option.name : typeof option === 'string' ? option : ''
							}
							autoComplete
							autoSelect
							disableClearable
							includeInputInList
							value={existingContact.name}
							disabled={!contacts || contacts.length === 0}
							onChange={(e, newValue) => {
								setExistingContact(newValue);
							}}
							renderInput={params => <TextField {...params} label="Contacts" variant="outlined" fullWidth multiline />}
						/>
					</Grid>
				</Grid>
			) : (
				<CircularProgress size={40} disableShrink color="secondary" />
			)}
		</div>
	);

	const addNew = () => (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<h3>First Name</h3>
				<TextField
					id="firstName"
					size="small"
					data-testid="contact-firstName-text-field"
					className={classes.maxWidth}
					multiline
					value={newContact.firstName}
					onChange={e => {
						setNewContact({
							...newContact,
							firstName: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Middle Name</h3>
				<TextField
					id="middleName"
					size="small"
					className={classes.maxWidth}
					multiline
					value={newContact.middleName}
					onChange={e => {
						setNewContact({
							...newContact,
							middleName: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Last Name</h3>
				<TextField
					id="lastName"
					size="small"
					className={classes.maxWidth}
					multiline
					value={newContact.lastName}
					onChange={e => {
						setNewContact({
							...newContact,
							lastName: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Entity Type</h3>
				<EntityType
					className={classes.maxWidth}
					setDocumentType={value => {
						let val = value.name;
						const data = contactStatusOptions.find(s => s.label === val);
						if (data) {
							val = data.value;
						}
						setNewContact({
							...newContact,
							ownerType: val,
						});
					}}
					value={newContact.ownerType ?? ''}
				/>
			</Grid>
			<Grid item xs={6}>
				<h3>{featureFlagChanges(showGenericPhones, 'Home Phone')}</h3>
				<TextField
					id="homePhone"
					size="small"
					// placeholder="E.g. xxx-xxx-xxxx"
					className={classes.maxWidth}
					multiline
					value={newContact.homePhone}
					onChange={e => {
						if (phonenumber(e.target.value)) {
							setNewContact({
								...newContact,
								homePhone: e.target.value,
							});
						}
					}}
				/>
			</Grid>
			<Grid item xs={6}>
				<h3>{featureFlagChanges(showGenericPhones, 'Mobile Phone')}</h3>
				<TextField
					id="mobilePhone"
					size="small"
					// placeholder="E.g. xxx-xxx-xxxx"
					className={classes.maxWidth}
					multiline
					value={newContact.mobilePhone}
					onChange={e => {
						if (phonenumber(e.target.value)) {
							setNewContact({
								...newContact,
								mobilePhone: e.target.value,
							});
						}
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Email</h3>
				<TextField
					id="email"
					size="small"
					// placeholder="E.g. jacob@m1neral.com"
					className={classes.maxWidth}
					multiline
					value={newContact.primaryEmail}
					onChange={e => {
						if (email(e.target.value)) {
							setNewContact({
								...newContact,
								primaryEmail: e.target.value,
							});
						}
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Address #1</h3>
				<TextField
					id="address1"
					size="small"
					className={classes.maxWidth}
					multiline
					autoComplete="nope"
					value={newContact.address1}
					onChange={e => {
						setNewContact({
							...newContact,
							address1: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Address #2</h3>
				<TextField
					id="address2"
					size="small"
					className={classes.maxWidth}
					multiline
					autoComplete="nope"
					value={newContact.address2}
					onChange={e => {
						setNewContact({
							...newContact,
							address2: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>City</h3>
				<TextField
					id="city"
					size="small"
					className={classes.maxWidth}
					multiline
					value={newContact.city}
					onChange={e => {
						setNewContact({
							...newContact,
							city: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={6}>
				<h3>State</h3>
				<TextField
					id="state"
					size="small"
					className={classes.maxWidth}
					multiline
					value={newContact.state}
					onChange={e => {
						setNewContact({
							...newContact,
							state: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={6}>
				<h3>Zip Code</h3>
				<TextField
					id="zipCode"
					size="small"
					className={classes.maxWidth}
					multiline
					value={newContact.zip}
					onChange={e => {
						if (zipCopde(e.target.value)) {
							setNewContact({
								...newContact,
								zip: e.target.value,
							});
						}
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Country</h3>
				<TextField
					id="country"
					size="small"
					className={classes.maxWidth}
					multiline
					value={newContact.country}
					onChange={e => {
						setNewContact({
							...newContact,
							country: e.target.value,
						});
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Contact Owner</h3>
				<Autocomplete
					id="contactOwner"
					className={classes.fieldWidth}
					options={users.filter(u => u.text)}
					onChange={(e, user) => {
						setNewContact({ ...newContact, contactOwner: user?.value });
					}}
					value={users.find(user => user?.value === newContact.contactOwner) || null}
					getOptionLabel={option => option.text}
					getOptionSelected={option => option.value === newContact.contactOwner}
					renderInput={params => (
						<TextField
							size="small"
							{...params}
							className={classes.maxWidth}
							multiline
							value={newContact.contactOwner}
						/>
					)}
				/>
			</Grid>
			<Grid item xs={12}>
				<h3>Purchased Data Exists</h3>
				<Autocomplete
					id="isPurchased"
					className={classes.fieldWidth}
					options={isPurchasedOptions.filter(u => u.label)}
					onChange={(e, isPurchased) => {
						setNewContact({ ...newContact, isPurchased: isPurchased?.value });
					}}
					value={isPurchasedOptions.find(option => option?.value === newContact.isPurchased) || null}
					getOptionLabel={option => option.label}
					getOptionSelected={option => option.value === newContact.isPurchased}
					renderInput={params => (
						<TextField size="small" {...params} className={classes.maxWidth} multiline value={newContact.isPurchased} />
					)}
				/>
			</Grid>
		</Grid>
	);

	const whichTapIsActive = index => {
		setActiveTapIndex(index);
	};

	const classes = useStyles(!!(contacts && contacts.length > 0));
	const modalClass = Modals();

	return !loadingContacts ? (
		<RightDialog open handleClickDialogClose={handleClickDialogClose} width="450px">
			{isAddingContact && (
				<div className={classes.loaderWrapper}>
					<CircularProgress color="secondary" className={classes.loader} size={40} />
				</div>
			)}

			<Grid item xs={12} style={{ maxHeight: '60px', padding: 22 }}>
				<h4
					id="addContactHeading"
					style={{
						margin: '0 0 15px 0',
						float: 'left',
						fontSize: '1.4rem',
					}}
				>
					Add New Contact
				</h4>
				<div style={{ float: 'right' }}>
					<IconButton onClick={props.onClose} size="small">
						<CloseIcon className={classes.closeIcon} fontSize="small" />
					</IconButton>
				</div>
			</Grid>
			<DialogContent className={classes.dialogContent}>
				{contacts && contacts.length > 0 ? (
					<Taps
						tabLabels={['Add New', 'Select Existing']}
						tabPanels={[addNew(), selectExisting()]}
						whichTapIsActive={whichTapIsActive}
						backgroundColor="#fff"
					/>
				) : (
					addNew()
				)}
			</DialogContent>
			<div className={classes.dialogFooter}>
				<Button
					onClick={handleClickDialogClose}
					color="default"
					size="medium"
					variant="contained"
					className={classes.footerButton}
					style={{
						margin: '0px 15px 0px 0px',
					}}
				>
					Cancel
				</Button>
				<Button
					id="addContactButton"
					disabled={!validated}
					data-testid="contact-add-button"
					onClick={handleClickAdd}
					variant="contained"
					color="secondary"
					className={classes.footerButton}
					size="medium"
				>
					Add
				</Button>
			</div>
		</RightDialog>
	) : (
		<div style={{ padding: '15px' }}>
			<CircularProgress size={80} disableShrink color="secondary" />
		</div>
	);
}
