import React, { memo, useContext } from 'react';
import { Button } from '@material-ui/core';
import { tableController } from 'hookstate/tableController';
import { AppContext } from 'AppContext';
import AddRelatedContactModal from 'components/ContactDetailCard/components/AddRelatedContactModal';

function ContactDettailRelatedContactsToolBar({ table, tableKey }) {
	const [stateApp, setStateApp] = useContext(AppContext);
	const Controller = tableController(tableKey);
	const { contactId } = Controller.getValue('customProps');

	const addRelatedContact = () => {
		setStateApp({ ...stateApp, addRelatedContactDialog: true });
	};
	return (
		<>
			<AddRelatedContactModal width={'700px'} relatedObject={contactId} />
			<Button variant="contained" color="primary" onClick={addRelatedContact}>
				+ ADD RELATED CONTACT
			</Button>
		</>
	);
}

export default memo(ContactDettailRelatedContactsToolBar);
