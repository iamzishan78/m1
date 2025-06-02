import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { DocumentContext } from 'components/Document/DocumentContext';

import { ADD_CHECK_TO_FILE_DESCRIPTOR } from 'graphQL/useMutationAddCheckToFileDescriptor';
import { DELETE_CHECK_FROM_FILE_DESCRIPTOR } from 'graphQL/useMutationDeleteCheckFromFileDescriptor';

import { globalStateController } from 'stateManagement/globalStateController';

import { UserSession } from 'utils/user';

import DocumentAssociation from './DocumentAssociation';

export default function AssociatedChecks({ selectedDocument }) {
	// Initials
	let history = useHistory();

	// States
	const [search, setSearch] = useState('');
	const [isSearchActive, setSearchState] = useState(false);

	const { getChecksFromDocument, getChecksLoading, checksFromDocument, checks, setChecks } =
		React.useContext(DocumentContext);

	const [addCheckToFileDescriptor, { loading: addChecksLoading }] = useMutation(ADD_CHECK_TO_FILE_DESCRIPTOR);

	// Mutations
	const [deleteCheckFromDescriptor, { loading: deleteCheckLoading }] = useMutation(DELETE_CHECK_FROM_FILE_DESCRIPTOR, {
		onCompleted: () =>
			getChecksFromDocument({
				variables: {
					descriptorObject: selectedDocument?._id,
				},
			}),
	});

	// Fetching checks from descriptor
	useEffect(() => {
		getChecksFromDocument({
			variables: {
				descriptorObject: selectedDocument?._id,
			},
		});
	}, []);

	// delete check from File Descriptor
	const deleteCheck = async checkId => {
		await deleteCheckFromDescriptor({
			variables: { descriptorId: selectedDocument?._id, checkId },
		});
	};

	const addSelectedCheckToDocument = check => {
		let checkData = {
			...check,
			createdBy: globalStateController.getValue('user')?._id,
		};
		addCheckToFileDescriptor({
			variables: {
				descriptorId: selectedDocument?._id,
				checkData: checkData,
			},
			awaitRefetchQueries: true,
		}).then(({ data }) => {
			const descriptorId = data.addCheckToFileDescriptor._id;
			window.setStateApp(stateApp => ({
				...stateApp,
				selectedDocument: { ...selectedDocument, _id: descriptorId },
			}));
			getChecksFromDocument({
				variables: {
					descriptorObject: descriptorId,
				},
			});
		});
	};

	// sending to check page
	const goToCheck = check => {
		const tenantName = UserSession.getStorageItem('tenantName');
		history.push(`/revenue/statement/details/${check?._id.toLowerCase()}?tenant=${tenantName}`);
		window.setStateApp(stateApp => ({ ...stateApp, DocumentDrawer: false, selectedDocument: {} }));
	};

	// searching existing Check
	const searchExistingChecks = value => {
		setSearch(value);
		const checkDescriptor = checksFromDocument?.getCheckDescriptors;
		let existingChecks = checkDescriptor?.checks || [];
		if (value !== '') {
			const searchedChecks = existingChecks.filter(check => check.checkNumber.toLowerCase().includes(value));
			setChecks(searchedChecks);
		} else {
			setChecks(existingChecks);
		}
	};
	return (
		<DocumentAssociation
			title={'Revenue Statements'}
			items={checks}
			navigateTo={goToCheck}
			esFilter={[]}
			esFields={['checkNumber']}
			esIndex="checks_flat"
			searchExistingItems={searchExistingChecks}
			onSearchBlur={() => {
				setTimeout(() => {
					setSearchState(false);
				}, 300);
				setChecks(checksFromDocument?.getCheckDescriptors?.checks);
			}}
			setSearchState={setSearchState}
			isSearchActive={isSearchActive}
			search={search}
			setSearch={setSearch}
			relatedObjectType="Revenue Statement"
			deleteDescriptorFile={deleteCheck}
			getSelectedItem={addSelectedCheckToDocument}
			addFileLoading={addChecksLoading}
			deleteFileLoading={deleteCheckLoading}
			updateDocumentLoading={getChecksLoading}
			href={'/revenue/statement/details/{ID}?tenant={TENANT}'}
		/>
	);
}

AssociatedChecks.propTypes = {
	selectedDocument: PropTypes.object,
};
