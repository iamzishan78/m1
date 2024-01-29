/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';

const columns = [{ name: 'M1neral System ID' }];

describe('UnitInterest Table', () => {
  beforeEach(() => {
    cy.interceptApiByIndex('getESSimpleSearch', 'shapes_flat');

    cy.viewport(1600, 1200).mount(<MRTTable name="UnitTable" />);
  });

  it('exports with M1neral System ID', () => {
    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.mrtExport({ columns });
  });
});
