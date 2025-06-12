/* eslint-disable no-undef */
import React from 'react';

import MRTTable from 'components/MRTTable';
import { RevenuePropertyDetails } from 'components/Revenue/components';

// Describe block for testing the AgreementFieldsSection
describe('AnalyticsSection', () => {
	beforeEach(() => {
		cy.interceptAndWait(
			['getDbData'],
			alias => {
				cy.viewport(1600, 1200).mount(<MRTTable name="PropertyInterestTable" />, {
					spec: 'PropertyInterestTableSpec',
				});
			},
			{ wait: false }
		);
	});

	it('Open detail view of property interest', () => {
		cy.mrtNonEmptyFilterOnColumn({
			column: {
				name: 'Property',
			},
		});
		cy.get(`tr.MuiTableRow-root[data-index="${0}"] > td.MuiTableCell-root`).eq(2).find('div > div > a').click();
		cy.wait(1000);
		cy.mount(<RevenuePropertyDetails />);
	});
});
