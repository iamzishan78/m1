import { call, takeLatest, put, select } from "redux-saga/effects";

import Api from "api";
import {
  getContactCampaignAction,
  convertTaxOwnerToContactAction,
} from "store/actions/contactActions";
import { campaignVariables } from "utils/data";
import { formatTaxOwners, copy } from "utils/helper";
import { CREATE_JOB } from "graphQL/useMutationCreateJob";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { toggleBulkUploadAction} from 'store/actions/commonActions';
import { GET_UPLOAD_CONTACT_URI } from "graphQL/useQueryGetUploadContactUri";
import { GET_CONTACT_CAMPAIGN, CONVERT_TAX_OWNER_TO_CONTACT } from "store/type";

function* getContactCampaign(action) {
  try {
    const { search } = action.payload;
    const contactCampaign = yield call(Api.fetch, GET_ES_FILTER_LIST, {
      ...campaignVariables,
      search,
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

function* convertTaxOwnerToContact(action) {
  const shapeOwners = yield select((state) => state.owner.shapeOwners);
  const bulkUpload = yield select((state) => state.common.bulkUpload);
  try {
    const { userId } = action.payload;
    const owners = formatTaxOwners(copy(shapeOwners), action.payload);

    const uploadUri = yield call(Api.fetch, GET_UPLOAD_CONTACT_URI, {
      jobName: "Contacts",
      userId,
    });

    const { uri, id, internalKey } = uploadUri.data.data.getUploadContactUri.job;
    
    yield put(toggleBulkUploadAction(!bulkUpload));
    const res = yield call(Api.fetchBlob, JSON.stringify([owners[0]]), id, internalKey, uri);
    if (res?._response?.status === 201) {
      yield call(Api.fetch, CREATE_JOB, { jobId: id });
    }
    
  } catch (error) {
    yield put(convertTaxOwnerToContactAction.REJECTED());
  }
}

/// /////////// Watchers ///////////////////////
export function* watcherContacts() {
  yield takeLatest(GET_CONTACT_CAMPAIGN.STARTED, getContactCampaign);
  yield takeLatest(
    CONVERT_TAX_OWNER_TO_CONTACT.STARTED,
    convertTaxOwnerToContact
  );
}
