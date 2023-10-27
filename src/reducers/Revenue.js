import { SET_REVENUE_KEY, SET_REVENUE_PROPERTIES_DATA } from "../constants/ActionTypes";

const INIT_STATE = {
  revenueProperties: { data: [], loading: false }
};

export default function Revenue(state = INIT_STATE, action) {
  switch (action.type) {
    case SET_REVENUE_KEY: {
      return { ...state, [action.payload.key]: action.payload.value };
    }
    case SET_REVENUE_PROPERTIES_DATA: {
      // formatting values here
      const formattedData = action.payload?.data?.getESPaginatedList?.hits?.map((eachRow) => {
        return {
          _id: eachRow._id,
          name: eachRow.name,
          number: eachRow.number,
          purchaserName: eachRow?.purchaser?.name,
          payorName: eachRow?.operator?.name,
          state: eachRow.state,
          country: eachRow?.county,
          source: eachRow?.source,
          wellApiNumber: eachRow?.well?.apiNumber,
          wellName: eachRow?.well?.wellName,
          status: eachRow?.status,
          checkNumber: eachRow?.lastCheck?.checkNumber,
          amount: eachRow?.lastCheck?.netOwnerValue,
          type: eachRow?.lastCheck?.interestType[0],
          lastChecked: new Date(eachRow?.lastCheck?.checkDate).toLocaleDateString(),
          tags: eachRow.tags?.length > 0
            ? [[eachRow.tags.map((tag) => tag.tag)], eachRow.tags.length]
            : [[], 0]
        }
      })
      return { ...state, revenueProperties: { loading: action.payload.loading, data: formattedData } };
    }
    default:
      return state;
  }
}
