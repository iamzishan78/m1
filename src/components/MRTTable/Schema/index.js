import ContactMeta from './contact_schema';
import ComparisonMeta from './comparison_schema';
import PropertyIntrestMeta from './property_interest_schema';
import OwnersPerUnitMeta from './ownersperunit-schema';
import TractPerUnitMeta from './tract_interest_owner_schema';
import UnitMeta from './unit_schema';
import UnitInterestMeta from './unit_interest_schema';
import TractUnitsMeta from './tract_units_schema';
import TractPotentialUnitsMeta from './tract_potential_units_schema';
import CampaignMeta from './campaign_schema';
import TractMeta from './tract_schema';
import TractInterestsMeta from './tract_interest_schema';
import GenericMeta from './generic-schema';
import ShapesFilesGenericMeta from './shapefiles_generic_schema';

export const SCHEMA = {
	ContactTable: ContactMeta,
	CampaignContactTable: ContactMeta,
	ComparisonTable: ComparisonMeta,
	PropertyIntrestTable: PropertyIntrestMeta,
	OwnersPerUnitTable: OwnersPerUnitMeta, // unit detail => Interest owner grid schema
	TractPerUnitTable: TractPerUnitMeta, // tract detail => Interest owner grid schema
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
};
