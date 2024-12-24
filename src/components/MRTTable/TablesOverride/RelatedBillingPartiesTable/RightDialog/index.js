import { useMutation } from '@apollo/client';
import { toNumber } from 'lodash';
import React from 'react';

import AddNewRelatedData from 'components/Land/components/Common/AddNewRelatedData';

import { ADD_BILLING_PARTY_CONTACT_DESCRIPTOR } from 'graphQL/useMutationAddPaymentContactDescriptor';

import { detailCardController } from 'hookstate/detailCardController';
import { tableGlobalController } from 'hookstate/tableController';

// This component is used in the RelatedPayeesTable component for the toolbar
export const BillingPartiesRightDialog = () => {
	const agreementDetailState = detailCardController.useState(['customLayer', 'drawer']);
	const agreementDetailsValues = agreementDetailState.stateValues;
	const drawer = agreementDetailsValues.drawer;
	const tableGlobalState = tableGlobalController.useState(['paymentMultiGrid']);
	const tableGlobalValues = tableGlobalState.stateValues;
	const paymentMultiGrid = tableGlobalValues.paymentMultiGrid;
	const { paymentId } = paymentMultiGrid || {};

	const [addBillingPartyContactDescriptor] = useMutation(ADD_BILLING_PARTY_CONTACT_DESCRIPTOR, {
		refetchQueries: ['getESSimpleSearch', 'getAgreementPaymentSummary'],
		awaitRefetchQueries: true,
	});

	const addNewBillingParty = (newData, setLoader) => {
		setLoader(true);

		addBillingPartyContactDescriptor({
			variables: {
				billingParty: {
					...newData,
					allocation: toNumber(newData?.allocation) || 0,
					amount: toNumber(newData?.amount) || 0,
					name: newData?.name?.name || '',
					contactId: newData?.name?._id || '',
					paymentId,
				},
			},
		}).then(() => {
			tableGlobalController.refetch();
			detailCardController.updateState({ drawer: '' });
			setLoader(false);
		});
	};

	return (
		<>
			{drawer === 'billingPartiesDialog' && (
				<AddNewRelatedData title="Billing Party" addNewData={addNewBillingParty} formName={drawer} />
			)}
		</>
	);
};
