/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';

describe('CampaignTractInterest Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESSimpleSearch', 'shapeowners_flat'], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="CampaignTractInterestTable" />);
    });
  });

  it('checks purchased icon in contact link', () => {
    cy.mrtPurchasedIconCheck();
  });
});
