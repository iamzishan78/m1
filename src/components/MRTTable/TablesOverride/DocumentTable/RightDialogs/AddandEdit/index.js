import React, { memo, useEffect, useMemo } from 'react';

import Badge from '@material-ui/core/Badge';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import CheckIcon from '@material-ui/icons/LocalAtm';
import ContactIcon from '@material-ui/icons/PermIdentity';

import PropTypes from 'prop-types';

import { DocumentContext } from 'components/Document/DocumentContext';
import Slideout from 'components/MRTTable/Common/Slideout';
import AssociatedAgreements from 'components/MRTTable/TablesOverride/DocumentTable/RightDialogs/AddandEdit/AssociatedAgreements';
import AssociatedChecks from 'components/MRTTable/TablesOverride/DocumentTable/RightDialogs/AddandEdit/AssociatedChecks';
import AssociatedContacts from 'components/MRTTable/TablesOverride/DocumentTable/RightDialogs/AddandEdit/AssociatedContacts';
import AssociatedProperties from 'components/MRTTable/TablesOverride/DocumentTable/RightDialogs/AddandEdit/AssociatedProperties';
import AgreementIcon from 'components/Shared/svgIcons/agreements';
import WellIcon from 'components/Shared/svgIcons/well';

import { globalStateController } from 'stateManagement/globalStateController';
import { slidoutStateController } from 'stateManagement/slidoutStateController';
import { tableGlobalController } from 'stateManagement/tableController';

import AssociatedWells from './AssociatedWells';
import DetailsPanel from './Detail';
import Information from './Information';

function CreateAndViewComponent({ selectedDocument, tableKey }) {
	const slideOutState = slidoutStateController.useState(['views', 'view', 'activeTabs']);
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const {
		getWellsFromDocument,
		wells,
		getContactsFromDocument,
		contacts,
		getAgreementsFromDocument,
		shapes,
		getChecksFromDocument,
		checks,
		getPropertiesFromDocument,
		properties,
	} = React.useContext(DocumentContext);

	// Fetching wells from descriptor
	useEffect(() => {
		// if there is no related document present do not call these queries
		if (selectedDocument?._id) {
			getWellsFromDocument({
				variables: {
					descriptorObject: selectedDocument?._id,
				},
			});
			getContactsFromDocument({
				variables: {
					descriptorObject: selectedDocument?._id,
				},
			});
			getAgreementsFromDocument({
				variables: {
					descriptorObject: selectedDocument?._id,
				},
			});
			// get checks on drawer load
			getChecksFromDocument({
				variables: {
					descriptorObject: selectedDocument?._id,
				},
			});
			// get properties on drawer load
			getPropertiesFromDocument({
				variables: {
					descriptorObject: selectedDocument?._id,
				},
			});
		}
	}, [selectedDocument?._id]);

	const handleClose = () => {
		tableGlobalController.updateState({
			documentDialog: {
				type: {},
			},
		});
	};

	const views = useMemo(
		() => [
			{
				name: 'Home',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
					>
						<HomeIcon {...props} />
					</Badge>
				),
				Component: () => (
					<DetailsPanel selectedDocument={selectedDocument} handleClose={handleClose} tableKey={tableKey} />
				),
				props: {},
				onClick: () => {},
			},
			{
				name: 'Contacts',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
						badgeContent={selectedDocument?._id ? contacts?.length : 0}
					>
						<ContactIcon {...props} />
					</Badge>
				),
				Component: () => <AssociatedContacts selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
			{
				name: 'Agreements',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
						badgeContent={selectedDocument?._id ? shapes?.length : 0}
					>
						<AgreementIcon {...props} />
					</Badge>
				),
				Component: () => <AssociatedAgreements selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
			{
				name: 'Related Properties',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
						badgeContent={selectedDocument?._id ? properties?.length : 0}
					>
						<BarChartIcon {...props} />
					</Badge>
				),
				Component: () => <AssociatedProperties selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
			{
				name: 'Revenue Statements',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
						badgeContent={selectedDocument?._id ? checks?.length : 0}
					>
						<CheckIcon {...props} />
					</Badge>
				),
				Component: () => <AssociatedChecks selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
			{
				name: 'Wells',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
						badgeContent={selectedDocument?._id ? wells?.length : 0}
					>
						<WellIcon {...props} />
					</Badge>
				),
				Component: () => <AssociatedWells selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
			{
				name: 'Information',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
					>
						<InfoOutlined {...props} />
					</Badge>
				),
				Component: () => <Information selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
		],
		[selectedDocument, wells, contacts, shapes, checks, properties]
	);

	const deleteFunc = () => {
		const deletedData = { mainRecord: [selectedDocument?._id] };
		tableGlobalController.updateState({
			dialog: {
				type: 'deleteGrid',
				deletedData,
				tableKey,
				userId: getUser?._id,
			},
		});
		handleClose();
	};

	useEffect(() => {
		slideOutState.view.set(views[0]);
	}, []);

	useEffect(() => {
		slideOutState.views.set(views);
	}, [views]);

	return <Slideout show={true} deleteFunc={deleteFunc} />;
}

export default memo(CreateAndViewComponent);

CreateAndViewComponent.propTypes = {
	selectedDocument: PropTypes.object,
	tableKey: PropTypes.string,
};
