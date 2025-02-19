import { useAtom, atom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { isEqual } from 'lodash';

import { store } from 'JotaiProvider';

// Base Class for Jotai State Controllerxs
export class StateController {
	constructor(initialState, controllerName) {
		this.store = store;
		this.controllerName = controllerName;
		this.initialState = initialState;
		this.state = atom(this.initialState);
		this.focusState = {};

		Object.keys(this.initialState).forEach(key => {
			this.getFocusItem(key, true);
		});
	}

	autoBind(instance) {
		let proto = Object.getPrototypeOf(instance);
		while (proto !== null) {
			const methodNames = Object.getOwnPropertyNames(proto).filter(
				prop => typeof instance[prop] === 'function' && prop !== 'constructor'
			);
			for (const name of methodNames) {
				instance[name] = instance[name].bind(instance);
			}
			proto = Object.getPrototypeOf(proto);
		}
	}

	getFocusItem(key, fromInitialState) {
		if (!this.focusState[key]) {
			this.focusState[key] = focusAtom(this.state, optic =>
				key.split('.').reduce((acc, part) => acc.prop(part), optic)
			);
			if (!fromInitialState) {
				this.missingKeys = this.missingKeys || new Set();
				this.missingKeys.add(key);
				console.warn(
					`Key: ${key} does not exist in initial State of ${this.controllerName}. Add it to prevent issues.`
				);
			}
		}
		return this.focusState[key];
	}

	useGenericHooks(keys, stateValuesKey) {
		const keysVal = {};
		keys.forEach(key => {
			if (key !== stateValuesKey) {
				const [value] = useAtom(this.getFocusItem(key));
				keysVal[key] = value;
			}
		});

		keysVal[stateValuesKey] = { ...keysVal };
		return keysVal;
	}

	useState(keys, stateValuesKey = 'stateValues') {
		return this.useGenericHooks(keys, stateValuesKey);
	}

	useCompleteState() {
		const completeState = useAtom(this.state);
		return completeState[0];
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
			returnValues[key] = this.getValue(key);
		});
		return returnValues;
	}

	getValue(key) {
		try {
			return this.focusState[key] ? store.get(this.focusState[key]) : null;
		} catch {
			throw Error(`Key: ${key} does not exist in initial State of ${this.controllerName}`);
		}
	}

	getAllValues() {
		return store.get(this.state);
	}

	reset() {
		this.setState(this.initialState);
	}

	resetState(key) {
		store.set(this.focusState[key], this.initialState[key]);
	}

	memoizedStateUpdate(key, value) {
		const oldValue = store.get(this.focusState[key]);

		if (isEqual(oldValue && value)) {
			return;
		}

		const prevState = store.get(this.state);
		const updatedState = { ...prevState, [key]: value };
		store.set(this.state, updatedState);
	}
}
