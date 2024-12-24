import { useLazyQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import {
	getBasicInfoContent,
	getBasicInfoExpContent,
	getBasicPurchaseInfoContent,
	getBasicPurchaseInfoExpContent,
} from 'components/ContactDetailedInfo/helper';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';

import { CONTACT } from 'graphQL/useQueryContact';
import { CONTACT_PURCHASE_DATA } from 'graphQL/useQueryContactPurchaseData';
import { LASTMELISSARECORD } from 'graphQL/useQueryGetMelissaRecords';

import MelissaTable from './components/MelissaTable';
import { AppContext } from '../../AppContext';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		position: 'absolute',
		top: '65px',
		maxHeight: 'calc(100vh - 65px)',
		overflowY: 'overlay',
	},
	dataSect: {
		borderTop: '2px solid #C9C9C9',
		// margin: "23px 28px",
		color: '#757575',
		width: '100%',
		'& p': {
			wordWrap: 'break-word',
		},
		'& .dataLabels': {
			fontWeight: 'bold',
		},
		'& > .MuiGrid-item': {
			borderBottom: '2px solid #C9C9C9',
			borderRight: '2px solid #C9C9C9',
			position: 'relative',
		},
		'& .fieldName': {
			borderLeft: '2px solid #C9C9C9',
			backgroundColor: '#EBEBEB',
			'& p': { margin: '8px 10px' },
		},
		'& a': { color: '#757575' },
	},
}));

export default function ContactDetailedInfoCard() {
	const classes = useStyles();
	let history = useHistory();
	const [, setStateApp] = useContext(AppContext);

	const [melissaData, setMelissaData] = useState(null);
	const [contactData, setContactData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [purchaseData, setPurchaseData] = useState([]);
	const [selectedPurchaseData, setSelectedPurchaseData] = useState('');
	const contactId = history.location.pathname.split('/')[history.location.pathname.split('/').length - 2];

	const [getContact, { data }] = useLazyQuery(CONTACT);
	const [getContactPurchaseData, { data: contactPurchaseData }] = useLazyQuery(CONTACT_PURCHASE_DATA);
	const [getLastMelissaRecord, { data: mData }] = useLazyQuery(LASTMELISSARECORD, { fetchPolicy: 'network-only' });

	useEffect(() => {
		if (contactId) {
			getContact({
				variables: {
					contactId: contactId,
				},
			});
			getContactPurchaseData({
				variables: {
					contactId: contactId,
				},
			});
			getLastMelissaRecord({
				variables: {
					contactId: contactId,
				},
			});
		}
	}, [contactId, getContact, getLastMelissaRecord]);

	useEffect(() => {
		if (data && data.contact) {
			setContactData(data.contact);
			setStateApp(stateApp => ({
				...stateApp,
				currentContatcAtivities: data.contact.activityLog,
			}));
		}
	}, [data, setStateApp]);

	useEffect(() => {
		if (contactPurchaseData?.getContactPurchaseData?.length > 0) {
			setPurchaseData(contactPurchaseData?.getContactPurchaseData);
			setSelectedPurchaseData(contactPurchaseData.getContactPurchaseData[0]._id);
		}
	}, [contactPurchaseData]);

	useEffect(() => {
		if (mData && mData.getLastMelissaRecord.success === true) {
			setMelissaData(mData.getLastMelissaRecord);
		}
	}, [mData]);

	useEffect(() => {
		setLoading(true);
		async function update() {
			setLoading(false);
		}
		update();
	}, [contactData]);

	return contactData ? (
		<div className={classes.root}>
			<div
				style={{
					backgroundColor: '#F2F2F2',
					minHeight: '7px',
					display: 'flex',
					position: 'relative',
					alignItems: 'center',
				}}
			/>

			<MelissaTable
				id={contactData?._id}
				entity={contactData?.entity}
				rows={{ ...getBasicInfoContent(contactData), ...getBasicInfoExpContent(contactData) }}
				wrapperClass={classes.dataSect}
				melissaData={melissaData}
			/>
			<FeatureFlag feature={FEATURES.IDICORE}>
				<MelissaTable
					header="Purchased Data"
					options={purchaseData ? purchaseData.map(data => ({ _id: data._id, date: data.sysDateTime })) : []}
					id={contactData?._id}
					entity={contactData?.entity}
					rows={{
						...getBasicPurchaseInfoContent(
							purchaseData.find(purchaseData => purchaseData._id === selectedPurchaseData)
						),
						...getBasicPurchaseInfoExpContent(
							purchaseData.find(purchaseData => purchaseData._id === selectedPurchaseData)
						),
					}}
					wrapperClass={classes.dataSect}
					melissaData={melissaData}
					selectedPurchaseData={selectedPurchaseData}
					setSelectedPurchaseData={setSelectedPurchaseData}
				/>
			</FeatureFlag>
		</div>
	) : (
		<div
			style={{
				padding: '20px',
				position: 'absolute',
				height: '95%',
				width: '100%',
				zIndex: '50',
			}}
		>
			<CircularProgress size={80} disableShrink color="secondary" />
		</div>
	);
}
