// react core
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import get from 'lodash/get';
import { useLazyQuery } from '@apollo/client';
import { useSelector } from 'react-redux';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

// internal components
import { truncate } from 'components/Shared/functions';
import { CONTACT } from 'graphQL/useQueryContact';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';

// contexts
import { AppContext } from 'AppContext';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import LinkWithIcon from 'components/Shared/LinkWithIcon';

const ContactBreadcrumbs = () => {
	const history = useHistory();

	const [contactData, setContactData] = useState(null);
	const [layerObj, setLayerObj] = useState(null);

	const [stateApp, setStateApp] = useContext(AppContext);
	const [stateNav, setStateNav] = useContext(NavigationContext);

	const { statements } = useSelector(({ Revenue }) => Revenue);
	const { selectedPipe } = useSelector(({ Flow }) => Flow);

	const [getContact, { data }] = useLazyQuery(CONTACT);
	const [getSecondContact, { data: secondContact }] = useLazyQuery(CONTACT);
	const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);

	const contactId = history.location.pathname.split('/')[3];

	const unitId =
		history.location.pathname.includes('units') &&
		history.location.pathname.split('/units/')[history.location.pathname.split('/units/').length - 1];
	const parcelId =
		history.location.pathname.includes('parcels') &&
		history.location.pathname.split('/parcels/')[history.location.pathname.split('/parcels/').length - 1];

	useEffect(() => {
		if (contactId) {
			getContact({
				variables: {
					contactId,
				},
			});
		}
	}, [getContact, contactId]);

	useEffect(() => {
		if (contactId) {
			getContact({
				variables: {
					contactId,
				},
			});
		}
	}, [getContact, contactId]);

	useEffect(() => {
		if (parcelId || unitId) {
			const layerId = parcelId ?? unitId;
			getCustomLayer({
				variables: {
					id: layerId,
				},
			});
		}
	}, [getCustomLayer, parcelId, unitId]);

	useEffect(() => {
		if (data && data.contact) {
			setContactData({ ...data.contact, metaOwner: { _id: data.contact.contactOwnerId } });
		}
	}, [data, stateApp.contactUpdated]);

	useEffect(() => {
		if (history.location.search.includes('/contact/details')) {
			const id = history.location.search.split('?return-url=/contact/details/')[1].split('/')[0];
			getSecondContact({
				variables: {
					contactId: id,
				},
			});
		}
	}, []);

	useEffect(() => {
		if (dataCustomLayer && dataCustomLayer.customLayer) {
			let shape = dataCustomLayer.customLayer.shape;
			if (typeof shape === 'string') {
				shape = JSON.parse(shape);
			}
			setLayerObj({
				...dataCustomLayer.customLayer,
				shape: shape,
			});
		}
	}, [dataCustomLayer]);

	const checkRevenueStatement = () => {
		if (history.pathHistory[1]?.includes && history.pathHistory[1]?.includes('/revenue/statement/details')) {
			return true;
		}
	};

	const checkRevenueProperty = () => {
		if (history.pathHistory[1]?.includes && history.pathHistory[1]?.includes('/revenue/property/details')) {
			return true;
		}
	};

	const getFlowlineReturnUrl = () => {
		const searchParams = new URLSearchParams(window.location.search?.replace('?', ''));
		const returnUrl = searchParams.get('return-url');
		return returnUrl;
	};
	const isPrevUrlFlowline = getFlowlineReturnUrl() && stateApp.activeDeal?._id;

	const agreementBreadcrumbsParams = React.useMemo(() => {
		const { state } = history.location;
		const params = [];
		if (state) {
			const { showAgreementBreadcrumb, agreementBreadcrumbsParams: breadcrumbParams } = state;
			if (showAgreementBreadcrumb && breadcrumbParams) {
				Object.keys(breadcrumbParams).forEach(key => {
					params.push({
						text: key,
						url: breadcrumbParams[key],
					});
				});
			}
		}
		return params;
	}, [history.location]);

	const getName = contact => {
		return get(contact, 'name') || `${get(contact, 'firstName', '')} ${get(contact, 'lastName', '')}`;
	};

	const checkModuleHistory = () => {
		if (stateNav.contactFromMap) {
			return !!stateNav.contactFromMap;
		} else if (history.pathHistory[1]?.includes && history.pathHistory[1]?.includes('/map/')) {
			return true;
		}
		return !!stateNav.contactFromMap;
	};

	const isContactLink = useMemo(() => {
		return history.location.pathname.split('/').length > 4;
	}, [history.location]);

	return (
		<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'left',
					paddingLeft: '10px',
				}}
			>
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
					{agreementBreadcrumbsParams.map((item, index) => (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => history.push(item.url)}
							key={index}
						>
							{item.text}
						</Link>
					))}
					{isPrevUrlFlowline && get(secondContact, 'contact.name', '') && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => history.push('/contacts')}
						>
							Contacts
						</Link>
					)}
					{isPrevUrlFlowline && get(secondContact, 'contact.name', '') && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => {
								history.push(`/contact/details/${get(secondContact, 'contact._id', '')}`);
								setStateApp(stateApp => ({
									...stateApp,
									selectedContact: get(secondContact, 'contact._id', ''),
								}));
							}}
						>
							{getName(secondContact.contact)}
						</Link>
					)}
					{isPrevUrlFlowline && get(secondContact, 'contact.name', '') && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => {
								history.push(history.location.search.split('?return-url=')[1]);
							}}
						>
							Deals
						</Link>
					)}
					{isPrevUrlFlowline && get(secondContact, 'contact.name', '') && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => history.push(history.location.search.split('?return-url=')[1])}
						>
							{truncate(stateApp.activeDeal.name, 30)}
						</Link>
					)}
					{isPrevUrlFlowline && selectedPipe && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => history.push('/flow')}
						>
							Flow
						</Link>
					)}
					{isPrevUrlFlowline && selectedPipe && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => history.push(`/flow/${selectedPipe?._id}`)}
						>
							{truncate(get(selectedPipe, 'name', ''), 30)}
						</Link>
					)}
					{isPrevUrlFlowline && selectedPipe && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => history.push(getFlowlineReturnUrl())}
						>
							{truncate(stateApp.activeDeal.name, 30)}
						</Link>
					)}
					{checkModuleHistory() && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => {
								history.push('/');
								setStateNav(stateApp => ({
									...stateApp,
									contactFromMap: false,
								}));
							}}
						>
							Map
						</Link>
					)}

					{checkRevenueStatement() && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => {
								history.push('/revenue/statements');
							}}
						>
							Statements
						</Link>
					)}
					{checkRevenueStatement() && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => {
								history.push(history.pathHistory[1]);
							}}
						>
							{`${statements?.activeStatement?.checkNumber} - ${statements?.activeStatement?.payor?.['name']}`}
						</Link>
					)}

					{checkRevenueProperty() && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => {
								history.push('/revenue/properties');
							}}
						>
							Revenue Properties
						</Link>
					)}
					{checkRevenueProperty() && (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => {
								history.push(history.pathHistory[1]);
							}}
						>
							{get(stateApp.selectedRevenueProperty, 'number', '')}-{get(stateApp.selectedRevenueProperty, 'name', '')}
						</Link>
					)}

					<Link
						style={{ marginLeft: '5px', fontSize: '16px', cursor: 'pointer' }}
						color="inherit"
						onClick={() => history.push('/contacts')}
					>
						Contacts
					</Link>
					{isContactLink ? (
						<Link
							style={{
								marginLeft: '5px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
							color="inherit"
							onClick={() => history.push(`/contact/details/${contactId}`)}
						>
							{contactData?.name}
						</Link>
					) : (
						<Typography style={{ color: '#18AADD', fontSize: '16px', marginLeft: '5px' }}>
							{getName(contactData)}
						</Typography>
					)}
					{history.location.pathname.includes('/detailedInformation') && (
						<Typography
							style={{
								color: '#18AADD',
								fontSize: '16px',
								marginLeft: '5px',
							}}
						>
							Detailed Information
						</Typography>
					)}
					{history.location.pathname.includes('/documents') && (
						<Typography
							style={{
								color: '#18AADD',
								fontSize: '16px',
								marginLeft: '5px',
							}}
						>
							Documents
						</Typography>
					)}
					{(history.location.pathname.includes('/wells') ||
						history.location.pathname.includes('/parcels') ||
						history.location.pathname.includes('/units')) && (
						<>
							{unitId || parcelId ? (
								<Link
									style={{
										marginLeft: '5px',
										fontSize: '16px',
										cursor: 'pointer',
									}}
									color="inherit"
									onClick={() => history.goBack()}
								>
									Associated Interests
								</Link>
							) : (
								<Typography
									style={{
										color: '#18AADD',
										fontSize: '16px',
										marginLeft: '5px',
									}}
								>
									Associated Interests
								</Typography>
							)}
						</>
					)}

					{unitId && layerObj?.name && (
						<Typography
							style={{
								color: '#18AADD',
								fontSize: '16px',
								marginLeft: '5px',
							}}
						>
							{layerObj?.name}
						</Typography>
					)}

					{parcelId && (
						<Typography
							style={{
								color: '#18AADD',
								fontSize: '16px',
								marginLeft: '5px',
							}}
						>
							{layerObj?.name}
						</Typography>
					)}
					{history.location.pathname.includes('/deals') && (
						<Typography
							style={{
								color: '#18AADD',
								fontSize: '16px',
								marginLeft: '5px',
							}}
						>
							Deals
						</Typography>
					)}
					{history.location.pathname.includes('recentActivites') && (
						<Typography
							style={{
								color: '#18AADD',
								fontSize: '16px',
								marginLeft: '5px',
							}}
						>
							Activities
						</Typography>
					)}
				</Breadcrumbs>
			</div>
			<LinkWithIcon objectId={contactId.toLowerCase()} contact={data?.contact} iconZiseSmall={false} />
		</div>
	);
};

export default ContactBreadcrumbs;
