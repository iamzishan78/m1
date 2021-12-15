import { call, takeLatest, put } from "redux-saga/effects";

import Api from "api";
import { GET_CONTACT_CAMPAIGN } from "store/type";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { getContactCampaignAction } from "store/actions/contactActions";

function* getContactCampaign(action) {
  try {
    const { search } = action.payload;
    const contactCampaign = yield call(Api.fetch, GET_ES_FILTER_LIST, {
      esIndex: "contacts_flat",
      filterKey: "campaignName.keyword",
      search: search,
      size: 50,
    });
    yield put(
      getContactCampaignAction.FULLFILLED(
        contactCampaign.data.data.getESFilterList.hits.map((hit) => hit.key)
      )
    );
  } catch (error) {
    yield put(getContactCampaignAction.REJECTED());
  }
}
/// /////////// Watchers ///////////////////////
export function* watcherContacts() {
  yield takeLatest(GET_CONTACT_CAMPAIGN.STARTED, getContactCampaign);
}
