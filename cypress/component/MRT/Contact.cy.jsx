/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';

describe('Contact.cy.jsx', () => {
  beforeEach(() => {
    cy.interceptApiByIndex('getESSimpleSearch', 'contacts_flat');

    cy.viewport(1600, 1200).mount(
      <MRTTable
        name="ContactTable"
        overrideMeta={{ isDefaultGridView: true, columnVirtualization: false }}
      />
    );
  });

  it('sorts by Name & Last Updated', () => {
    const columns = [
      {
        index: 2,
        name: 'Name',
        type: 'string',
        selector: 'div > p > div > div > a',
      },
      {
        index: 18,
        name: 'Last Updated',
        type: 'date',
      },
    ];

    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.wait(500);

    cy.mrtSortColumns({ columns });
  });
});
