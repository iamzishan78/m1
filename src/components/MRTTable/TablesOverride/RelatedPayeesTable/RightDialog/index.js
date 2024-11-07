import React from 'react';
import { detailCardController } from 'hookstate/detailCardController';
import AddNewRelatedData from 'components/Land/components/Common/AddNewRelatedData';
import { tableGlobalController } from 'hookstate/tableController';
import { useMutation } from '@apollo/client';
import { ADD_PAYMENT_CONTACT_DESCRIPTOR } from 'graphQL/useMutationAddPaymentContactDescriptor';

// This component is used in the RelatedPayeesTable component for the toolbar
export const PayeeRightDialog = () => {
	const agreementDetailState = detailCardController.useState(['customLayer', 'drawer']);
	const agreementDetailsValues = agreementDetailState.stateValues;
	const drawer = agreementDetailsValues.drawer;
	const tableGlobalState = tableGlobalController.useState(['paymentMultiGrid']);
	const tableGlobalValues = tableGlobalState.stateValues;
	const paymentMultiGrid = tableGlobalValues.paymentMultiGrid;
	const { paymentId } = paymentMultiGrid || {};

	const [addPaymentContactDescriptor] = useMutation(ADD_PAYMENT_CONTACT_DESCRIPTOR, {
		refetchQueries: ['getESSimpleSearch', 'getAgreementPaymentSummary'],
		awaitRefetchQueries: true,
	});

	const addNewPayee = (newData, setLoader) => {
		setLoader(true);

		addPaymentContactDescriptor({
			variables: {
				payment: {
					...newData,
					payeeName: newData?.payeeName?.name || '',
					contactId: newData?.payeeName?._id || '',
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
		<>{drawer === 'payeeDialog' && <AddNewRelatedData title="Payee" addNewData={addNewPayee} formName={drawer} />}</>
	);
};
