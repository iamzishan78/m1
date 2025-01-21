import { useAtom, atom } from 'jotai';
import { focusAtom } from 'jotai-optics';

import { store } from 'JotaiProvider';

// Base Class for Jotai State Controller
export class StateController {
	constructor(initialState) {
		this.store = store;
		this.initialState = initialState;
		this.state = atom(this.initialState);
		this.focusState = {};

		Object.keys(this.initialState).forEach(key => {
			this.getFocusItem(key);
		});
	}

	getFocusItem(key) {
		if (!this.focusState[key]) {
			this.focusState[key] = focusAtom(this.state, optic =>
				key.split('.').reduce((acc, part) => acc.prop(part), optic)
			);
		}
		return this.focusState[key];
	}

	useGenericHooks(keys, stateValuesKey) {
		const keysVal = {};
		keys.forEach(key => {
			const [value] = useAtom(this.getFocusItem(key));
			keysVal[key] = value;
		});
		keysVal[stateValuesKey] = keysVal;
		return keysVal;
	}

	useState(keys, stateValuesKey = 'stateValues') {
		return this.useGenericHooks(keys, stateValuesKey);
	}

	useCompleteState() {
		return useAtom(this.state);
	}

	useScopeState(key) {
		return useAtom(this.getFocusItem(key));
	}

	setState(newState) {
		Object.keys(newState).forEach(key => {
			this.getFocusItem(key);
		});

		const updatedState = { ...this.initialState, ...newState };
		store.set(this.state, updatedState);
	}

	updateState(newState) {
		Object.keys(newState).forEach(key => {
			this.getFocusItem(key);
		});

		const prevState = store.get(this.state);
		const updatedState = { ...prevState, ...newState };
		store.set(this.state, updatedState);
	}

	getValues(keys) {
		const returnValues = {};
		keys.forEach(key => {
			returnValues[key] = store.get(this.focusState[key]);
		});
		return returnValues;
	}

	getValue(key) {
		try {
			return this.focusState[key] ? store.get(this.focusState[key]) : null;
		} catch (e) {
			console.log(key, e);
			return e;
		}
	}

	getAllValues() {
		return store.get(this.state);
	}

	resetAll() {
		store.set(this.state, this.initialState);
	}

	reset(keys) {
		keys.forEach(key => {
			store.set(this.focusState[key], this.initialState[key]);
		});
	}

	resetState(key) {
		store.set(this.focusState[key], this.initialState[key]);
	}
}
