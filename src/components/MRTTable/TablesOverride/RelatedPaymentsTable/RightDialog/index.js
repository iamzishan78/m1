import React, { useContext } from 'react';
import { detailCardController } from 'hookstate/detailCardController';
import AddNewRelatedData from 'components/Land/components/Common/AddNewRelatedData';
import { get, toNumber } from 'lodash';
import { tableGlobalController } from 'hookstate/tableController';
import { useMutation } from '@apollo/client';
import { ADD_PAYMENT } from 'graphQL/useMutationAddPayment';
import { AppContext } from 'AppContext';

// This component is used in the RelatedPayeesTable component for the toolbar
export const PaymentRightDialog = () => {
	const [stateApp] = useContext(AppContext);

	const agreementDetailState = detailCardController.useState(['customLayer', 'drawer']);
	const agreementDetailsValues = agreementDetailState.stateValues;
	const drawer = agreementDetailsValues.drawer;
	const relatedObjectId = get(agreementDetailsValues, 'customLayer._id');

	const [addPayment] = useMutation(ADD_PAYMENT, {
		refetchQueries: ['getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	const addNewPayment = (newData, setLoader) => {
		setLoader(true);
		addPayment({
			variables: {
				payment: {
					...newData,
					amount: toNumber(newData?.amount) || 0,
					companyShare: toNumber(newData?.companyShare) || 0,
					userId: stateApp.user.mongoId,
					relatedObjectId: relatedObjectId,
					relatedObjectType: 'Shape',
				},
			},
		}).then(() => {
			detailCardController.updateState({ drawer: '' });
			tableGlobalController.refetch();
			setLoader(false);
		});
	};

	return (
		<>
			{drawer === 'paymentDialog' && (
				<AddNewRelatedData title="Payments" addNewData={addNewPayment} formName={drawer} />
			)}
		</>
	);
};
