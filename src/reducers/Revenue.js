import { SET_ACTIVE_MODULE, TOGGLE_ACTIONS_PANEL, SET_REVENUE_KEY, SET_REVENUE_PROPERTIES_DATA } from "../constants/ActionTypes";

const INIT_STATE = {
  activeModule: {},
  actionsPanelState: true,
  revenueProperties: { data: [], loading: false }
};

export default function Revenue(state = INIT_STATE, action) {
  switch (action.type) {
    case SET_ACTIVE_MODULE: {
      return { ...state, activeModule: action.payload };
    }
    case TOGGLE_ACTIONS_PANEL: {
      return { ...state, actionsPanelState: action.payload };
    }
    case SET_REVENUE_KEY: {
      return { ...state, [action.payload.key]: action.payload.value };
    }
    case SET_REVENUE_PROPERTIES_DATA: {
      // formatting values here
      const formattedData = action.payload?.data?.getESPaginatedList?.hits?.map((eachRow) => {
        return {
          name: eachRow.name,
          propertyCode: eachRow.number,
          payorName: eachRow?.operator?.name,
          state: eachRow.state,
          country: eachRow?.county,
          source: eachRow?.source,
          wellApiNumber: eachRow?.well?.apiNumber,
          wellName: eachRow?.well?.wellName,
          status: eachRow?.status,
          checkNumber: eachRow?.lastCheck?.checkNumber,
          lastChecked: new Date(eachRow?.lastCheck?.checkDate).toLocaleDateString(),
        }
      })
      return { ...state, revenueProperties: { loading: action.payload.loading, data: formattedData } };
    }
    default:
      return state;
  }
}
