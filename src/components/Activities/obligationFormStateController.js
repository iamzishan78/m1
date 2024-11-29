import { hookstate, useHookstate } from '@hookstate/core';

const getCurrentDate = () => {
    const d = new Date().toISOString();
    return d.slice(0, d.indexOf("T"));
};

const initialValue = {
    activityType: "Call",
    startDate: getCurrentDate(),
    endDate: getCurrentDate(),
    frequency: '',
    applicable: '',
    obligationValue: '',
    responsibleParty: '',
    assignedOwner: '',
    owner: '',
    status: false,
    notes: "",
};

export const obligationFormState = hookstate(initialValue);

export const useActivityFormState = () => useHookstate(obligationFormState);

const activityFormStateControllerHandler = state => {
    return {

    };
};

export const obligationFormStateController = activityFormStateControllerHandler(obligationFormState);
