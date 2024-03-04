/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../../cypress/cypressUtils/data';
import ldata from '../../fixtures/ldata.json';
import { REVERTCYPRESSDELETE } from 'graphQL/useMutationCommonCypressRevert';

const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
};

describe('Tract Interest Owners Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESSimpleSearch', 'shapeowners_flat'], () => {
      cy.viewport(1600, 1200).mount(
        <MRTTable
          name="TractPerUnitTable"
          overrideMeta={{
            defaultFilters: [
              {
                field: 'shape._id',
                value: '65a9129609723f222ab5a4e8',
              },
              {
                field: 'contact.IsDeleted',
                value: 'false',
              },
              {
                field: 'descriptor',
                value: 'ParcelDescriptor',
              },
            ],
          }}
        />,
        {
          testCase: {
            cypressDelete: true,
          },
        }
      );
    });
  });

  it('should delete selected rows', () => {
    cy.interceptAndWait(
      ['gridGenericRemove'],
      alias => {
        cy.get(`[data-testid="over-ride-select-all-div"] input`).click();

        cy.get('.MuiButtonBase-root[data-testid="delete-icon-button"]').click();

        cy.get('.MuiButtonBase-root[data-testid="delete-confirm"]').click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(deleteResponse => {
          const data = deleteResponse?.response?.body?.data?.gridGenericRemove.data;

          expect(deleteResponse?.response?.statusCode).to.eq(200);

          cy.wait(1000).then(() => {
            const getLayerPayload = {
              operationName: 'revertCypressDelete',
              variables: { data },
              query: REVERTCYPRESSDELETE.loc.source.body,
            };

            cy.request({
              method: 'POST',
              url: ldata.url,
              headers: headers,
              body: getLayerPayload,
            }).then(r => {
              expect(r.status).to.eq(200);
              expect(r.body.data?.revertCypressDelete?.success).to.eq(true);
            });
          });
        });
      },
      { wait: false }
    );
  });
});
