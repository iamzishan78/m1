import { hookstate, useHookstate } from '@hookstate/core';

const getCurrentDate = () => {
    const d = new Date().toISOString();
    return d.slice(0, d.indexOf("T"));
};

const initialValue = {
    activityType: "Call",
    outcome: '',
    startDate: getCurrentDate(),
    endDate: getCurrentDate(),
    owner: '',
    dealId: null,
    mongoEntitiesArray: [],
    nameAutValue: { name: "", _id: null },
    status: false,
    notes: "",
};

export const activityFormState = hookstate(initialValue);

export const useActivityFormState = () => useHookstate(activityFormState);

const activityFormStateControllerHandler = state => {
    return {

    };
};

export const activityFormStateController = activityFormStateControllerHandler(activityFormState);
