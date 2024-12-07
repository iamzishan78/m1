/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';

const columns = [{ name: 'M1neral System ID' }, { name: 'State' }, { name: 'County' }];

describe('UnitInterest Table', () => {
	beforeEach(() => {
		cy.interceptAndWait(['getESSimpleSearch', 'shapeowners_flat'], () => {
			cy.viewport(1600, 1200).mount(<MRTTable name="UnitInterestTable" />);
		});
	});

	it('exports with M1neral System ID, State & County', () => {
		cy.mrtExport({ columns });
	});

	it('checks purchased icon in contact link', () => {
		cy.mrtPurchasedIconCheck();
	});
});
