import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';

export const commonIterestOwnerStates = {
	newOwner: false,
	name: null,
	ownerType: null,
	royalty_interest: null,
	orri: null,
	net_acres: null,
	nra: null,
	seller_asking_price: null,
	competitor_offer_price: null,
	offer_price: null,
	max_offer_price: null,
	actual_offer_price: null,
	contactStatus: null,
	closed_price: null, // Add new field closed price for unit interest owner
	status: null,
	campaignName: [],
	campaignPriority: null,
	deals: [],
	ownerEntity: null,
};

export const tractInterestOwnerState = {
	...commonIterestOwnerStates,
	surface_interest: null,
	mineral_interest: null,
	nonExecRightsOnly: null,

	operating_rights: null,
	offer_price_nma: null,
	max_offer_price_nma: null,
	company_net_acres: null,
	cost_bearing: null,
	cost_free_high_value: null,
	cost_bearing_high_value: null,
	qtr: [null, null, null, null],

	leaseStatus: null,
	depthFrom: 'All depths',
	depthTo: 'All depths',
	dataSource: null,
	customLayer: null,
	relatedObject: null,
};

export const unitInterestOwnerState = {
	...commonIterestOwnerStates,
	working_interest: null,
	unknown_interest: null,
	record_title: null,
	nri: null,
	unitTractId: null,
	tractAcres: null,
	uUnitPricingInterest: null,
	uMaxUnitPricingInterest: null,
	dataSource: null,
	taxYear: null,
	custom_data: null,
};

export const contactState = {
	firstName: null,
	middleName: null,
	lastName: null,
	homePhone: null,
	mobilePhone: null,
	primaryEmail: null,
	address1: null,
	address2: null,
	city: null,
	state: null,
	zip: null,
	country: null,
	contactOwner: null,
};

export const payeeState = {
	payeeName: null,
	payeeAddress: null,
	paymentAllocation: null,
	paymentAmount: null,
	status: null,
};

export const billingPartiesState = {
	name: null,
	address: null,
	allocation: null,
	amount: null,
	status: null,
};
export const costAllocationState = {
	name: null,
	address: null,
	allocation: null,
	amount: null,
	status: null,
};

const initialStates = {
	tractInterestDialog: tractInterestOwnerState,
	unitInterestDialog: unitInterestOwnerState,
	contactDialog: contactState,
	payeeDialog: payeeState,
	billingPartiesDialog: billingPartiesState,
	costAllocationDialog: costAllocationState,
};

export const sideDialogState = {};

const sideDialogStateControllerHandler = () => ({});

export const sideDialogController = DialogKey => {
	if (!sideDialogState[DialogKey]) sideDialogState[DialogKey] = hookstate(copy(initialStates[DialogKey]));

	return {
		...sideDialogStateControllerHandler(sideDialogState[DialogKey]),
		...hookStateController(sideDialogState[DialogKey], initialStates[DialogKey]),
	};
};
