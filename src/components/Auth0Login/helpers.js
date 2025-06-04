import { copy } from 'components/Shared/functions';

import { globalStateController } from 'stateManagement/globalStateController';

const tenants = JSON.parse(process.env.REACT_APP_TENANS_CREDENTIALS);

const emailRegex =
	// eslint-disable-next-line no-useless-escape
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = emailString => {
	if (emailString && emailString !== '' && emailString.match(emailRegex) === null) {
		return false;
	}
	return true;
};

export const tenantsCredentials = tenantName => {
	if (!tenantName) {
		return null;
	}

	let found;
	for (let i = 0; i < tenants.length; i++) {
		if (tenants[i].name.toUpperCase() === tenantName.toUpperCase()) {
			found = tenants[i];
		}
	}

	if (found) {
		globalStateController.updateState({ tenant: found });
	}

	return copy(found);
};
