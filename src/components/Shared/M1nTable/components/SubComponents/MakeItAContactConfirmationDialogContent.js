import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { useMutation } from '@apollo/client';

import { showErrorMessage, showSuccessMessage } from '../../../../../actions';
import { AppContext } from '../../../../../AppContext';
import { ADDCONTACT } from '../../../../../graphQL/useMutationAddContact';
import { Modals } from '../../../../../styles/Modal';

export default function MakeItAContactConfirmationDialogContent(props) {
	const dispatch = useDispatch();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [addContact, { data, loading }] = useMutation(ADDCONTACT);
	const modalClass = Modals();

	useEffect(() => {
		if (data && data.addContact && !loading) {
			if (data.addContact.success && data.addContact.contact) {
				dispatch(
					showSuccessMessage(
						data.addContact.contact.name
							? `${data.addContact.contact.name} contact was successfully created`
							: 'The owner contact was successfully created'
					)
				);

				props.openContactDetailCard(data.addContact.contact._id);
			} else {
				dispatch(showErrorMessage('Error occurred'));
				props.onClose();
			}
			setStateApp(state => ({ ...state, universalCircularLoaderAct: false }));
		}
	}, [data, loading]);

	return (
		<React.Fragment>
			<DialogTitle className={modalClass.title} id="customized-dialog-title">
				New Contact
				<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={props.onClose} />
			</DialogTitle>
			<DialogContent>
				<h3 className={modalClass.inputLabel}>{props.children}</h3>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						props.onClose();
					}}
					color="primary"
				>
					Cancel
				</Button>
				<Button
					onClick={() => {
						{
							setStateApp(state => ({
								...state,
								universalCircularLoaderAct: true,
							}));
							if (props.targetLabel === 'owner' || props.targetLabel === 'Parcel Ownership') {
								addContact({
									variables: {
										contact: {
											...props.entity,
											createBy: stateApp.user.mongoId,
											lastUpdateBy: stateApp.user.mongoId,
										},
									},
									refetchQueries: ['getPaginatedContacts', 'checkIfOwnersAreContacts'],
									awaitRefetchQueries: true,
								});
							} else {
								addContact({
									variables: {
										contact: {
											entity: props.entity,
											createBy: stateApp.user.mongoId,
											lastUpdateBy: stateApp.user.mongoId,
										},
									},
									refetchQueries: ['getPaginatedContacts', 'checkIfOwnersAreContacts'],
									awaitRefetchQueries: true,
								});
							}
						}
					}}
					color="primary"
				>
					Continue
				</Button>
			</DialogActions>
		</React.Fragment>
	);
}
