import ContactMeta from './contact_schema';
import ComparisonMeta from './comparison_schema';
import PropertyIntrestMeta from './property_interest_schema';
import OwnersPerUnitMeta from './ownersperunit-schema';
import TractPerUnitMeta from './tract_interest_owner_schema';
import AgreementMeta from './agreement_schema';
import UnitMeta from './unit_schema';
import UnitInterestMeta from './unit_interest_schema';
import TractUnitsMeta from './tract_units_schema';
import TractPotentialUnitsMeta from './tract_potential_units_schema';
import CampaignMeta from './campaign_schema';
import TractMeta from './tract_schema';
import TractInterestsMeta from './tract_interest_schema';
import GenericMeta from './generic-schema';
import ShapesFilesGenericMeta from './shapefiles_generic_schema';
import PropertiesMeta from './properties_schema';
import RevenueStatementsMeta from './revenue_statements_schema';
import ContactWellInterestMeta from "./contact_well_Interest_schema"
import MyWellsMeta from './my_wells_schema';
import WellsMeta from './wells_schema';
import TaxOwnerMeta from './map-grid-tax-owner-schema';
import ShapeDetailAgreementMeta from './shapeDetail_agreement_schema';
import AgreementRelatedUnitsMeta from './agreement_relatedUnits_schema';
import UnitRelatedAgreementMeta from './unit_relatedAgreements_schema';
import SalesVolumeComparisonMeta from './sales-volume-comparison-schema';

export const SCHEMA = {
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
	PropertiesTable: PropertiesMeta,  //main property Grid => /revenue/properties
	RevenueStatementsTable: RevenueStatementsMeta, // Revenue Statement grid => revenue/statements
	MyWellsTable: MyWellsMeta,
	WellsTable: WellsMeta,
	TaxOwnerTable: TaxOwnerMeta,
	// Added related shape grids
	ShapeDetailAgreementTable: ShapeDetailAgreementMeta,
	AgreementRelatedUnitsTable: AgreementRelatedUnitsMeta,
	UnitRelatedAgreementTable: UnitRelatedAgreementMeta,
	SalesVolumeComparisonTable: SalesVolumeComparisonMeta, // Sales Volume comparison grid => analytrics/revenue
	TractInterestsTable: TractInterestsMeta, // Tracts Interest schema
};
