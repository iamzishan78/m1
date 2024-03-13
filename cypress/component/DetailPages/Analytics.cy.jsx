/* eslint-disable no-undef */
import { RevenuePropertyDetails } from "components/Revenue/components";
import MRTTable from 'components/MRTTable';
import React from 'react';

// Describe block for testing the AgreementFieldsSection
describe('AnalyticsSection', () => {
    beforeEach(() => {
        cy.interceptAndWait(
          ['getESSimpleSearch'],
          alias => {
            cy.viewport(1600, 1200).mount(<MRTTable name="PropertyIntrestTable" />, {
              spec: 'PropertyIntrestTableSpec',
            });
          },
          { wait: false }
        );
      });

    it('Open detail view of property interest', () => {
      cy.get(`tr.MuiTableRow-root[data-index="${0}"] > td.MuiTableCell-root`)
      .eq(2)
      .find('div > div > a').click();
      cy.wait(1000);
      cy.mount(<RevenuePropertyDetails />);
    });

});