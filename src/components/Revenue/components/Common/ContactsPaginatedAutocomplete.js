import React, { useState, useEffect, useContext } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import get from 'lodash/get';

import { setStateIfDeepEqual } from 'components/Shared/functions';
import AutocompEntityNamesVirtualizeList from 'components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList';

import { ADDCONTACT } from 'graphQL/useMutationAddContact';
import { PAGINATEDCONTACTSQUERY } from 'graphQL/useQueryPaginatedContacts';

import { AppContext } from 'AppContext';

export default function ContactPaginatedDropdown({ nameAutValue, setNameAutValue, ...rest }) {
	const [stateApp] = useContext(AppContext);
	const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [isNextPageLoading, setIsNextPageLoading] = useState(false);
	const [nameAutInputValue, NameAutInputValue] = useState('');
	const setNameAutInputValue = newState => {
		setStateIfDeepEqual(NameAutInputValue, newState);
	};

	const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
		PAGINATEDCONTACTSQUERY,
		{
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first',
		}
	);

	const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);

	useEffect(() => {
		if (get(addContactData, 'addContact.contact')) {
			setNameAutValue({
				name: addContactData.addContact.contact.name,
				_id: addContactData.addContact.contact._id,
			});
		}
	}, [addContactData]);

	useEffect(() => {
		if (allContacts?.paginatedContacts) {
			setMongoEntitiesArray([...allContacts?.paginatedContacts?.edges?.map(el => el.node)]);
			setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
		}
		setIsNextPageLoading(false);
	}, [allContacts]);

	useEffect(() => {
		//will also run during initial mount
		setIsNextPageLoading(true);
		getPaginatedContacts({
			variables: {
				search: nameAutInputValue,
			},
		});
	}, [nameAutInputValue]);

	const loadNextPage = async pageVariables => {
		setIsNextPageLoading(true);
		fetchMorePaginatedContacts(pageVariables);
		return null;
	};

	return (
		<AutocompEntityNamesVirtualizeList
			mongoEntitiesArray={mongoEntitiesArray}
			setMongoEntitiesArray={setMongoEntitiesArray}
			nameAutValue={nameAutValue}
			setNameAutValue={setNameAutValue}
			nameAutInputValue={nameAutInputValue}
			setNameAutInputValue={setNameAutInputValue}
			hasNextPage={hasNextPage}
			isNextPageLoading={isNextPageLoading}
			loadNextPage={loadNextPage}
			addNew={true}
			addNewOnClick={value => {
				const contact = { name: value };
				addContact({
					variables: {
						contact: {
							...contact,
							createBy: stateApp.user.mongoId,
							lastUpdateBy: stateApp.user.mongoId,
						},
					},
					refetchQueries: ['getPaginatedContacts', 'getContact'],
					awaitRefetchQueries: true,
				});
			}}
			{...rest}
		/>
	);
}
