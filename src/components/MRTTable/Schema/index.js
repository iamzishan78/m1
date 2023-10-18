import ContactMeta from './contact_schema';
import ComparisonMeta from './comparison_schema';
import PropertyIntrestMeta from './property_interest_schema';
import OwnersPerUnitMeta from './ownersperunit-schema';
import TractPerUnitMeta from './tract_interest_owner_schema';
import UnitMeta from './unit_schema';
import UnitInterestMeta from './unit_interest_schema';
import TractUnitsMeta from './tract_units_schema';
import TractPotentialUnitsMeta from './tract_potential_units_schema';

export const SCHEMA = {
	ContactTable: ContactMeta,
	ComparisonTable: ComparisonMeta,
	PropertyIntrestTable: PropertyIntrestMeta,
	OwnersPerUnitTable: OwnersPerUnitMeta, // unit detail => Interest owner grid schema
	TractPerUnitTable: TractPerUnitMeta,// tract detail => Interest owner grid schema
	UnitTable: UnitMeta,
	UnitInterestTable: UnitInterestMeta,
	TractUnitsTable: TractUnitsMeta,
	TractPotentialUnitsTable: TractPotentialUnitsMeta,
};
