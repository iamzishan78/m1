export const ProfileTabReducer = (state, action) => {
    switch (action.type) {
        case 'firstname':
            return {...state, firstname: action.value};
        case 'middlename':
            return {...state, middlename: action.value};
        case 'lastname':
            return {...state, lastname: action.value};
        case 'sss_tax_id':
            return {...state, sss_tax_id: action.value};
        case 'dateOfBirth':
            return {...state, dateOfBirth: action.value};
        case 'displayname':
            return {...state, displayname: action.value};
        case 'email':
            return {...state, email: action.value};
        case 'activity':
            return {...state, activity: action.value};
        case 'phone':
            return {...state, phone: action.value};
        case 'address':
            return {...state, address: action.value};
        case 'city':
            return {...state, city: action.value};
        case 'state':
            return {...state, state: action.value};
        case 'mobilephone':
            return {...state, mobilephone: action.value};
        case 'workphone':
            return {...state, workphone: action.value};
        case 'company':
            return {...state, company: action.value};
        case 'jobTitle':
            return {...state, jobTitle: action.value};
        case 'isAccreditedInvestor':
            return {...state, isAccreditedInvestor: action.value};
        case 'CREexperience':
            return {...state, CREexperience: action.value};
        case 'job_title':
            return {...state, job_title: action.value};
        case 'employer':
            return {...state, employer: action.value};
        case 'employerAddress':
            return {...state, isSameFromAbove: false, employerAddress: action.value};
        case 'investingExperience':
            const temp = state.investingExperience === null ? [] : Object.assign([], state.investingExperience);
            if(temp.includes(action.value)){
                const index = temp.indexOf(action.value);
                temp.splice(index, 1);
            }else{
                console.log("VALUE:", action.value);
                temp.push(action.value);
            }
            return {...state, investingExperience: temp};

        case 'emailNotifications':
            const Notifytemp = state.emailNotifications === null ? [] : state.emailNotifications;
            if(Notifytemp.includes(action.value)){
                const index = Notifytemp.indexOf(action.value);
                Notifytemp.splice(index, 1);
            }else{
                Notifytemp.push(action.value);
            }
            return {...state, emailNotifications: Notifytemp};

        case 'isSameFromAbove':
            const employerAddress = !state.isSameFromAbove ? `${state.address}, ${state.city}, ${state.state}`: state.employerAddress;
            return {...state, isSameFromAbove: !state.isSameFromAbove, employerAddress};
        case 'investingEntities':
            let InvestingEntitiesTemp = state.investingEntities === null ? [] : Object.assign([], state.investingEntities)
            InvestingEntitiesTemp.push(action.value)
            return {...state, investingEntities: InvestingEntitiesTemp}
        default:
        throw new Error();
    }
  };

export const InvestingPreFerencesReducers = (state, action) => {
    switch (action.type){

        // INVESTMENT INTERESTS PANEL

        case 'assetType':
            const InvestingInterestsTemp = state.investingPreferences.length > 0 ? 
                    state.investingPreferences.InvestingInterests :  Object.assign([], state.investingPreferences.InvestingInterests);
            const assetTemp = typeof InvestingInterestsTemp.assetType === "undefined" 
                        ? [] 
                        : InvestingInterestsTemp.assetType;
            if(assetTemp.includes(action.value)){
                const index = assetTemp.indexOf(action.value);
                assetTemp.splice(index, 1);
            }else{
                assetTemp.push(action.value);
            }
            return {
                ...state, 
                investingPreferences: {
                    InvestingInterests: {
                        ...state.investingPreferences.InvestingInterests, 
                        assetType:assetTemp
                    }
                }};

        case 'basin':
            return {
                ...state, 
                investingPreferences: {
                    ...state.investingPreferences, 
                    InvestingInterests: {
                        ...state.investingPreferences.InvestingInterests,
                         basin: action.value
                        } 
                    }};  

        case 'vehicles':
            const InvestingInterestsVehiclesTemp = state.investingPreferences.length > 0 ? 
                    state.investingPreferences.InvestingInterests :  Object.assign([], state.investingPreferences.InvestingInterests);
            const vehiclesTemp = typeof InvestingInterestsVehiclesTemp.vehicles === "undefined" 
                        ? [] 
                        : InvestingInterestsVehiclesTemp.vehicles;
            if(vehiclesTemp.includes(action.value)){
                const index = vehiclesTemp.indexOf(action.value);
                vehiclesTemp.splice(index, 1);
            }else{
                vehiclesTemp.push(action.value);
            }
            return {
                ...state, 
                investingPreferences: {
                    InvestingInterests: {
                        ...state.investingPreferences.InvestingInterests, 
                        vehicles:vehiclesTemp
                    }
                }};
            case 'hold_period':
                // const InvestingInterestsHoldPeriodTemp = state.investingPreferences.length > 0 ? 
                //         state.investingPreferences.InvestingInterests :  Object.assign([], state.investingPreferences.InvestingInterests);
                // const holdPeriodTemp = typeof InvestingInterestsHoldPeriodTemp.holdPeriod === "undefined" 
                //             ? [] 
                //             : InvestingInterestsHoldPeriodTemp.holdPeriod;
                // if(holdPeriodTemp.includes(action.value)){
                //     const index = holdPeriodTemp.indexOf(action.value);
                //     holdPeriodTemp.splice(index, 1);
                // }else{
                //     holdPeriodTemp.push(action.value);
                // }
                const holdPeriodTemp = [action.value];
                return {
                    ...state, 
                    investingPreferences: {
                        InvestingInterests: {
                            ...state.investingPreferences.InvestingInterests, 
                            holdPeriod:holdPeriodTemp
                        }
                    }};

            case 'objectives':
                const InvestingInterestsObjectivesTemp = state.investingPreferences.length > 0 ? 
                        state.investingPreferences.InvestingInterests :  Object.assign([], state.investingPreferences.InvestingInterests);
                const objectivesTemp = typeof InvestingInterestsObjectivesTemp.objectives === "undefined" 
                            ? [] 
                            : InvestingInterestsObjectivesTemp.objectives;
                if(objectivesTemp.includes(action.value)){
                    const index = objectivesTemp.indexOf(action.value);
                    objectivesTemp.splice(index, 1);
                }else{
                    objectivesTemp.push(action.value);
                }
                return {
                    ...state, 
                    investingPreferences: {
                        InvestingInterests: {
                            ...state.investingPreferences.InvestingInterests, 
                            objectives:objectivesTemp
                        }
                    }};
            
                    // INVESTMENT OBJECTIVES PANEL
            case 'expected_in_12_months':
                return {
                    ...state, 
                    investingPreferences: {
                        ...state.investingPreferences, 
                        InvestingObjectives: {
                            ...state.investingPreferences.InvestingObjectives,
                                expected_total_in_12_months: action.value
                            } 
                        }};  

            case 'expected_per_project':
                return {
                    ...state, 
                    investingPreferences: {
                        ...state.investingPreferences, 
                        InvestingObjectives: {
                            ...state.investingPreferences.InvestingObjectives,
                            expected_per_project: action.value
                            } 
                        }};   

            case 'risk_tolerance':
                return {
                    ...state, 
                    investingPreferences: {
                        ...state.investingPreferences, 
                        InvestingObjectives: {
                            ...state.investingPreferences.InvestingObjectives,
                            risk_tolerance: action.value
                            } 
                        }};  
        default:
        throw new Error();
            }
}