import React from 'react';
import { detailCardController } from 'hookstate/detailCardController';
import AddNewRelatedData from 'components/Land/components/Common/AddNewRelatedData';
import { tableGlobalController } from 'hookstate/tableController';
import { useMutation } from '@apollo/client';
import { ADD_PAYMENT_PROPERTY_DESCRIPTOR } from 'graphQL/useMutationAddPaymentContactDescriptor';
import { toNumber } from 'lodash';

// This component is used in the RelatedPayeesTable component for the toolbar
export const CostAllocationRightDialog = () => {
	const agreementDetailState = detailCardController.useState(['customLayer', 'drawer']);
	const agreementDetailsValues = agreementDetailState.stateValues;
	const drawer = agreementDetailsValues.drawer;
	const tableGlobalState = tableGlobalController.useState(['paymentMultiGrid']);
	const tableGlobalValues = tableGlobalState.stateValues;
	const paymentMultiGrid = tableGlobalValues.paymentMultiGrid;
	const { paymentId } = paymentMultiGrid || {};

	const [addPaymentPropertyDescriptor] = useMutation(ADD_PAYMENT_PROPERTY_DESCRIPTOR, {
		refetchQueries: ['getESSimpleSearch', 'getAgreementPaymentSummary'],
		awaitRefetchQueries: true,
	});

	const addNewCostAllocation = (newData, setLoader) => {
		setLoader(true);

		addPaymentPropertyDescriptor({
			variables: {
				property: {
					...newData,
					allocation: toNumber(newData?.allocation) || 0,
					amount: toNumber(newData?.amount) || 0,
					costCenter: newData?.costCenter?.name || '',
					paymentId: paymentId,
				},
				propertyId: newData?.costCenter?._id,
			},
		}).then(() => {
			tableGlobalController.refetch();
			detailCardController.updateState({ drawer: '' });
			setLoader(false);
		});
	};

	return (
		<>
			{drawer === 'costAllocationDialog' && (
				<AddNewRelatedData title="Cost Allocation" addNewData={addNewCostAllocation} formName={drawer} />
			)}
		</>
	);
};
