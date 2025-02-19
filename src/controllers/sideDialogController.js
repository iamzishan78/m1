import { StateController } from './stateController';

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
	campaigns: [],
	campaignPriority: null,
	deals: [],
	ownerEntity: null,
	isPurchased: null,
};

export const tractInterestOwnerState = {
	...commonIterestOwnerStates,
	surface_interest: null,
	mineral_interest: null,
	nonExecRightsOnly: null,

	depthFrom: null,
	depthTo: null,
	depthBoth: null,

	contactOwners: [],

	operating_rights: null,
	offer_price_nma: null,
	max_offer_price_nma: null,
	company_net_acres: null,
	cost_bearing: null,
	cost_free_high_value: null,
	cost_bearing_high_value: null,
	qtr: [null, null, null, null],
	qtr1: null,
	qtr2: null,
	qtr3: null,
	qtr4: null,
	uUnitPricing: null,
	uMaxUnitPricing: null,
	uUnitPricingNMA: null,
	uMaxUnitPricingNMA: null,
	leaseBonusPerAcre: null,

	leaseStatus: null,
	dataSource: null,
	customLayer: null,
	relatedObject: {},
	workspaceSettings: {},
	rerenderJson: {},
	rowData: {},
	createBy: null,
	lastUpdateBy: null,
	bonus_payment: null,
	showNraRecalculate: null,
	showTargetOfferRecalculate: null,
	netAcresOverRideValue: null,
	showTargetOfferPriceRecalculate: null,
	showMaxOfferPriceRecalculate: null,
	showMaxOfferRecalculate: null,
	showBonusPaymentRecalculate: null,
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
	uAcres: null,
	uUnitPricing: null,
	uMaxUnitPricing: null,
	workspaceSettings: {},
	rowData: {},
	relatedObject: {},
	rerenderJson: {},
	createBy: null,
	lastUpdateBy: null,
	contactOwners: [],
	'showTargetPrice/NraRecalculate': null,
	showNetRoyaltyAcresRecalculate: null,
	showTargetOfferRecalculate: null,
	showMaxOfferRecalculate: null,
	'showMaxPrice/NraRecalculate': null,
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
	isPurchased: null,
	ownerType: null,
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
export const paymentState = {
	paymentType: null,
	startDate: null,
	endDate: null,
	frequency: null,
	amount: null,
	nextPayment: null,
	companyShare: null,
	responsibleParty: null,
	assignedTo: null,
	paymentStatus: null,
};

const initialStates = {
	tractInterestDialog: tractInterestOwnerState,
	unitInterestDialog: unitInterestOwnerState,
	contactDialog: contactState,
	payeeDialog: payeeState,
	billingPartiesDialog: billingPartiesState,
	costAllocationDialog: costAllocationState,
	paymentDialog: paymentState,
};

export const sideDialogState = {};

export const sideDialogController = DialogKey => {
	if (!sideDialogState[DialogKey]) {
		sideDialogState[DialogKey] = new StateController({ ...initialStates[DialogKey], DialogKey });
	}

	return sideDialogState[DialogKey];
};
