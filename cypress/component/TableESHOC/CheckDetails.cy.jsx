/* eslint-disable no-undef */
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';
import { GET_PROPERTY } from 'graphQL/useQueryGetProperty';
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
      pagination: pagination,
    },
    query: GET_ES_SIMPLE_SEARCH.loc.source.body,
  };
};

const getPropertyPayload = ({ propertyId }) => {
  return {
    operationName: 'getProperty',
    variables: {
      id: propertyId,
      isDeletedCheck: false,
    },
    query: GET_PROPERTY.loc.source.body,
  };
};

describe('CheckDetails ESHOC Table', () => {
  it('checks that check details have correct property._id key', () => {
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: getElasticDataPayload({ index: 'checkdetails_flat' }),
    }).then((checkDetailsResponse) => {
      const propertyIds = checkDetailsResponse.body.data.getESSimpleSearch.hits.map(
        (checkDetail) => checkDetail.property._id
      );

      // fetching and verfying property based on property id provided by check details
      propertyIds.map((propertyId) => {
        cy.request({
          method: 'POST',
          url: ldata.url,
          headers: headers,
          body: getPropertyPayload({
            propertyId,
          }),
        }).then((getPropertyResponse) => {
          cy.wrap(getPropertyResponse.body.data.getProperty).should(
            'have.property',
            'success',
            true
          );
        });
      });
    });
  });
});
