import Cookies from 'universal-cookie';

const COOKIES_USER_TOKEN = 'USER_SESSION';

export function saveUserSession({ authToken, accessToken }) {
	const cookies = new Cookies();
	const session = { authToken, accessToken };
	cookies.set(COOKIES_USER_TOKEN, session, { path: '/' });
}

export function getSession() {
	const cookies = new Cookies();
	return cookies.get(COOKIES_USER_TOKEN);
}

export function deleteSession() {
	const cookies = new Cookies();
	cookies.remove(COOKIES_USER_TOKEN, { path: '/' });
}
