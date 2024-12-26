import AcreageDetilsMeta from './acreage_details_schema';
import AcreageSummaryMeta from './acreage_summary_schema';
import ActivitiesMeta from './activities_schema';
import ActivityMeta from './activity_schema';
import AgreementRelatedUnitsMeta from './agreement_relatedUnits_schema';
import AgreementMeta from './agreement_schema';
import AuditReportingMeta from './audit_reporting_schema';
import BulkDataEditingMeta from './bulk_data_editing_schema';
import CampaignMeta from './campaign_schema';
import ComparisonMeta from './comparison_schema';
import ContactMeta from './contact_schema';
import ContactWellInterestMeta from './contact_well_Interest_schema';
import ContactDetailRelatedAgreementMeta from './contactDetail_related_agreements_schema';
import ContactDetailRelatedContactMeta from './contactDetail_related_contacts_schema';
import DocumentMeta from './document_schema';
import ExhibitAMeta from './exhibit_a_schema';
import ExpirationsMeta from './expirations_schema';
import GenericMeta from './generic-schema';
import TaxOwnerMeta from './map-grid-tax-owner-schema';
import MyWellsMeta from './my_wells_schema';
import ObligationsMeta from './obligations_schema';
import OwnersPerUnitMeta from './ownersperunit-schema';
import PropertiesMeta from './properties_schema';
import PropertyInterestDetailMeta from './property-interest-details-schema';
import PropertyRevenueDetailMeta from './property-revenue-details-schema';
import ReportingGroupsMeta from './property_group_schema';
import PropertyIntrestMeta from './property_interest_schema';
import PotentialShapeOwnersMeta from './QuerySchema/potential_shape_owners_schema';
import PotentialWellOwnersMeta from './QuerySchema/potential_well_owners_schema';
import PotentialWellsMeta from './QuerySchema/potential_wells_schema';
import PropertiesRevenueMeta from './QuerySchema/properties_revenue_schema';
import TaxRollInterestsMeta from './QuerySchema/tax_roll_interests_schema';
import UserManagementMeta from './QuerySchema/user_management_schema';
import RelatedBillingPartiesMeta from './related_billing_parties_schema';
import RelatedCostAllocationsMeta from './related_cost_allocation_schema';
import RelatedPayeesMeta from './related_payees_schema';
import RelatedPaymentsMeta from './related_payments_schema';
import RelatedTractInterestMeta from './related_tract_interest_schema';
import RelatedTractsMeta from './related_tracts_schema';
import RelatedlUnitInterestMeta from './related_unit_interests_schema';
import RelatedWellsMeta from './related_wells_schema';
import RevenueCheckDetailMeta from './revenue_checkdetail_schema';
import RevenueStatementsMeta from './revenue_statements_schema';
import SalesVolumeComparisonMeta from './sales-volume-comparison-schema';
import ShapeDetailAgreementMeta from './shapeDetail_agreement_schema';
import ShapesFilesGenericMeta from './shapefiles_generic_schema';
import TractPerUnitMeta from './tract_interest_owner_schema';
import TractInterestsMeta from './tract_interest_schema';
import TractPotentialUnitsMeta from './tract_potential_units_schema';
import TractMeta from './tract_schema';
import TractUnitsMeta from './tract_units_schema';
import UnitInterestMeta from './unit_interest_schema';
import UnitRelatedAgreementMeta from './unit_relatedAgreements_schema';
import UnitMeta from './unit_schema';
import UnitTractsMeta from './unit_tract_schema';
import WellsMeta from './wells_schema';
import CheckDetailsMeta from './check_details_schema';

export const SCHEMA = {
	ActivityTable: ActivityMeta,
	ContactTable: ContactMeta,
	ContactWellInterestTable: ContactWellInterestMeta,
	CampaignContactTable: ContactMeta,
	ComparisonTable: ComparisonMeta,
	PropertyIntrestTable: PropertyIntrestMeta,
	OwnersPerUnitTable: OwnersPerUnitMeta, // unit detail => Interest owner grid schema
	TractPerUnitTable: TractPerUnitMeta, // tract detail => Interest owner grid schema
	TractsTable: TractMeta,
	AgreementTable: AgreementMeta,
	UnitTable: UnitMeta,
	CampaignUnitTable: UnitMeta,
	UnitInterestTable: UnitInterestMeta,
	CampaignUnitInterestTable: UnitInterestMeta,
	TractUnitsTable: TractUnitsMeta,
	TractPotentialUnitsTable: TractPotentialUnitsMeta,
	CampaignTable: CampaignMeta,
	CampaignTractTable: TractMeta,
	CampaignTractInterestTable: TractInterestsMeta,
	GenericTable: GenericMeta,
	ShapesFilesGenericTable: ShapesFilesGenericMeta,
	PropertiesTable: PropertiesMeta, //main property Grid => /revenue/properties
	RevenueStatementsTable: RevenueStatementsMeta, // Revenue Statement grid => revenue/statements
	RevenueCheckDetailTable: RevenueCheckDetailMeta,
	UnitTractTable: UnitTractsMeta, // UnitDetailCard => tracts
	MyWellsTable: MyWellsMeta,
	RevenuePropertiesTable: ReportingGroupsMeta,
	WellsTable: WellsMeta,
	TaxOwnerTable: TaxOwnerMeta,
	SalesVolumeComparisonTable: SalesVolumeComparisonMeta, // Sales Volume comparison grid => analytrics/revenue
	DocumentTable: DocumentMeta, // Documnet table schema
	RelatedDocumentTable: DocumentMeta, // RelatedDocument table schema
	AcreageSummaryTable: AcreageSummaryMeta,
	ExhibitATable: ExhibitAMeta,
	AcreageDetailsTable: AcreageDetilsMeta,
	ActivitiesTable: ActivitiesMeta,
	ExpirationsTable: ExpirationsMeta,
	ObligationsTable: ObligationsMeta,
	// Payments grids
	RelatedPaymentsTable: RelatedPaymentsMeta,
	RelatedPayeesTable: RelatedPayeesMeta,
	RelatedCostAllocationsTable: RelatedCostAllocationsMeta,
	RelatedBillingPartiesTable: RelatedBillingPartiesMeta,
	// Added related shape grids
	ShapeDetailAgreementTable: ShapeDetailAgreementMeta,
	AgreementRelatedUnitsTable: AgreementRelatedUnitsMeta,
	UnitRelatedAgreementTable: UnitRelatedAgreementMeta,
	TractInterestsTable: TractInterestsMeta, // Tracts Interest schema
	RelatedUnitInterestTable: RelatedlUnitInterestMeta,
	RelatedTractInterestTable: RelatedTractInterestMeta,
	RelatedAgreementTable: ContactDetailRelatedAgreementMeta,
	ContactDetailAgreementsTable: ContactDetailRelatedAgreementMeta,
	PropertyRelatedAgreementTable: ContactDetailRelatedAgreementMeta, //property detail =>  related agreement grid
	ContactDetailActivitiesTable: ActivitiesMeta,
	ContactDetailContactsTable: ContactDetailRelatedContactMeta,
	PropertyInterestDetailTable: PropertyInterestDetailMeta, //property detail =>  interest detail grid
	PropertyRevenueDetailTable: PropertyRevenueDetailMeta, //property detail =>  revenue detail grid
	RelatedTractsTable: RelatedTractsMeta,
	RelatedWellsTable: RelatedWellsMeta,
	AuditReportingTable: AuditReportingMeta, // Revenue Statement grid => revenue/statements
	BulkDataEditingTable: BulkDataEditingMeta,
	CheckDetailsTable: CheckDetailsMeta, // revenue > statement > checkDetails

	// Query Tables
	PotentialWellOwnersTable: PotentialWellOwnersMeta,
	UserManagementTable: UserManagementMeta,
	PropertiesRevenueTable: PropertiesRevenueMeta, // analytics > revenue > revenue  by month
	TaxRollInterestsTable: TaxRollInterestsMeta,
	PotentialWellsTable: PotentialWellsMeta,
	PotentialShapeOwnersTable: PotentialShapeOwnersMeta,
};
