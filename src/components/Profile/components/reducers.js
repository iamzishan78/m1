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
            const temp = state.investingExperience === null ? [] : state.investingExperience;
            if(temp.includes(action.value)){
                const index = temp.indexOf(action.value);
                temp.splice(index, 1);
            }else{
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
            
        default:
        throw new Error();
    }
  };