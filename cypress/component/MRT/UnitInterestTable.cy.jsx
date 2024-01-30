/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';

const columns = [{ name: 'M1neral System ID' }, { name: 'State' }, { name: 'County' }];

describe('UnitInterest Table', () => {
  beforeEach(() => {
    cy.interceptApiByIndex('getESSimpleSearch', 'shapeowners_flat');

    cy.viewport(1600, 1200).mount(<MRTTable name="UnitInterestTable" />);
  });

  it('exports with M1neral System ID, State & County', () => {
    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.mrtExport({ columns });
  });
});
