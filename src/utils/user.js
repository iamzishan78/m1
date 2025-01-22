import Cookies from 'universal-cookie';

const COOKIES_USER_TOKEN = 'USER_SESSION';

class UserSessionManager {
	constructor() {
		this.cookies = new Cookies();
	}

	saveUserSession({ authToken, accessToken }) {
		const session = { authToken, accessToken };
		this.cookies.set(COOKIES_USER_TOKEN, session, { path: '/' });
	}

	getSession() {
		return this.cookies.get(COOKIES_USER_TOKEN);
	}

	getStorageItem(key) {
		return window.localStorage.getItem(key);
	}

	setStorageItem(key, value) {
		window.localStorage.setItem(key, value);
	}

	deleteSession() {
		this.cookies.remove(COOKIES_USER_TOKEN, { path: '/' });
		sessionStorage.clear();
		localStorage.clear();
		window.location.replace(window.location.origin);
	}
}
export const UserSession = new UserSessionManager();
