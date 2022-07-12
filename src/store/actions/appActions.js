import { SET_USER, SET_FREEZE_LOCATION } from "store/type";

export const setUserAction = (payload) => ({ type: SET_USER, payload })

export const setFreezeLocaton = (payload) => ({ type: SET_FREEZE_LOCATION, payload})
  