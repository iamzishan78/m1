import React, { useContext } from 'react';

import { useMutation } from '@apollo/client';
import { get, toNumber } from 'lodash';

import AddNewRelatedData from 'components/Land/components/Common/AddNewRelatedData';

import { ADD_PAYMENT } from 'graphQL/useMutationAddPayment';
import { UPDATE_PAYMENT } from 'graphQL/useMutationUpdatePayment';

import { detailCardController } from 'hookstate/detailCardController';
import { tableGlobalController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

const onCompletion = setLoader => {
	detailCardController.updateState({ drawer: '' });
	tableGlobalController.refetch();
	setLoader(false);
};

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
	const [updatePayment] = useMutation(UPDATE_PAYMENT, {
		refetchQueries: ['getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	const addNewPayment = (newData, setLoader) => {
		setLoader(true);

		const payment = {
			...newData,
			amount: toNumber(newData?.amount) || 0,
			companyShare: toNumber(newData?.companyShare) || 0,
			userId: stateApp.user.mongoId,
			relatedObjectId: relatedObjectId,
			relatedObjectType: 'Shape',
		};

		if (newData?._id) {
			updatePayment({
				variables: {
					payment,
				},
			}).then(() => {
				onCompletion(setLoader);
			});
		} else {
			addPayment({
				variables: {
					payment,
				},
			}).then(() => {
				onCompletion(setLoader);
			});
		}
	};

	return (
		<>
			{drawer === 'paymentDialog' && (
				<AddNewRelatedData title="Payments" addNewData={addNewPayment} formName={drawer} />
			)}
		</>
	);
};
