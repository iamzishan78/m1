/* eslint-disable no-undef */
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch'
import ldata from '../../fixtures/ldata.json';
const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
};

const getElasticDataPayload = ({ index, search = null, filters = [], pagination = null }) => {
  return {
    operationName: 'getESSimpleSearch',
    variables: {
      index: index,
      search: search,
      filters: filters,
      pagination: pagination
    },
    query: GET_ES_SIMPLE_SEARCH.loc.source.body,
  };
};

describe('CheckDetails ESHOC Table', () => {
  it('checks that check details have correct property._id key', () => {
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: getElasticDataPayload({ index: "checkdetails_flat" }),
    }).then(checkDetailsResponse => {
      cy.request({
        method: 'POST',
        url: ldata.url,
        headers: headers,
        body: getElasticDataPayload({
          index: "properties_flat", pagination: {
            "first": 10000,
            "after": null
          }
        }),
      }).then(propertiesResponse => {
        const propertyIds = checkDetailsResponse.body.data.getESSimpleSearch.hits.map((checkDetail) => checkDetail.property._id);
        propertyIds.map((propertyId) => {
          const foundProperty = propertiesResponse.body.data.getESSimpleSearch.hits.find((property) => property._id === propertyId);
          cy.wrap(foundProperty).should('exist', 'Property with propertyId exists');
        })
      });
    });
  });
});
