let instance = null;

class GlobalApolloClientProvider {
	constructor(client) {
		if (!instance) {
			instance = this;
		}

		instance.client = client;
	}

	static get client() {
		return instance.client;
	}
}

export default GlobalApolloClientProvider;
