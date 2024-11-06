import React from 'react';
import { detailCardController } from 'hookstate/detailCardController';
import AddNewRelatedData from 'components/Land/components/Common/AddNewRelatedData';
import { get } from 'lodash';
import { tableGlobalController } from 'hookstate/tableController';
import { useMutation } from '@apollo/client';
import { ADD_BILLING_PARTY_CONTACT_DESCRIPTOR } from 'graphQL/useMutationAddPaymentContactDescriptor';

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
				<AddNewRelatedData
					title="Billing Party"
					addNewData={addNewBillingParty}
					formName={drawer}
					relatedObjectType="Shape"
					relatedObjectId={get(agreementDetailsValues, 'customLayer._id')}
				/>
			)}
		</>
	);
};
