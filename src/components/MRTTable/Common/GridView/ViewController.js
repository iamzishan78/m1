/* eslint-disable no-use-before-define */
import { hookstate } from '@hookstate/core';

import { copy } from 'components/Shared/functions';

import { UPSERT_GRID_VIEW } from 'graphQL/useMutationUpsertGridView';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';

import { globalStateController } from 'hookstate/globalStateController';
import { hookStateController } from 'hookstate/hookStateController';
import { viewInitialState, viewStates } from 'hookstate/initialStates';
import { tableController } from 'hookstate/tableController';

const viewStatesControllerHandler = state => ({
	initialize: ({
		Icon,
		label,
		client,
		allViews,
		isTable = false,
		styleOverride = null,
		defaultViewOverride = null,
	}) => {
		const userId = globalStateController.getValue('user').mongoId;
		const userDefaultView = allViews?.find(view => view?.defaultDisplayBy?.includes(userId));
		const defaultView = allViews?.find(view => view?.type === 'Default');

		const selectedView = defaultViewOverride || userDefaultView || defaultView || allViews?.[0] || null;

		if (selectedView && !isTable) {
			const moduleName = state.moduleName.get();
			viewStateController(moduleName).applyView(selectedView);
		}

		state.merge({
			label,
			client,
			allViews,
			isTable,
			selectedView,
			icon: { jsxEl: Icon },
			...(styleOverride && { styleOverride }),
		});
	},

	applyView: selectedView => {
		if (!selectedView) {
			return;
		}

		const { isTable = false, moduleName = '' } = state?.get({ noproxy: true }) ?? {};
		const ViewController = viewStateController(moduleName);
		ViewController.updateState({ selectedView, isLoading: true });

		if (isTable) {
			const TableKey = moduleName;
			tableController(TableKey).applyGridView(selectedView);
		}

		ViewController.updateState({
			isLoading: false,
			isViewOpen: false,
			shouldSyncView: true,
		});
	},

	fetchAllViews: async () => {
		const userId = globalStateController.getValue('user').mongoId;
		const { client = null, isTable = false, moduleName = '' } = state?.get({ noproxy: true }) ?? {};
		const ViewController = viewStateController(moduleName);

		const result = await client.query({
			variables: {
				module: isTable ? tableController(moduleName).getModuleName() : moduleName,
				userId,
			},
			query: GET_GRID_VIEWS,
		});

		const allViews = result?.data?.getGridViews?.gridViews || [];

		ViewController.updateState({ allViews });
	},

	updateAllViews: view => {
		const allViews = state.allViews?.get({ noproxy: true }) || [];
		let updatedViews = [];

		if (view.isDeleted) {
			updatedViews = allViews.filter(existingView => existingView._id !== view._id);
			if (view._id === state.selectedView?.get()._id) {
				const userId = globalStateController.getValue('user').mongoId;
				const moduleName = state.moduleName.get();
				const viewController = viewStateController(moduleName);

				const userDefaultView = updatedViews?.find(view => view?.defaultDisplayBy?.includes(userId));
				const defaultView = updatedViews?.find(view => view?.type === 'Default');
				const selectedView = userDefaultView || defaultView || allViews?.[0] || null;

				if (selectedView) {
					viewController.applyView(selectedView);
				}

				viewController.updateState({ selectedView });
			}
		} else if (view._id) {
			if (view._id === state.selectedView?.get()._id) {
				const selectedView = state.selectedView.get({ noproxy: true });
				state.selectedView.set({ ...selectedView, ...view });
			}

			updatedViews = allViews.map(prevView => (prevView._id === view._id ? { ...prevView, ...view } : prevView));
		} else {
			updatedViews = [...allViews, view];
		}

		state.allViews.set(updatedViews);
	},

	updateView: async ({ id = null, fieldsToUpdate = {} }) => {
		try {
			const client = state.client.get();

			if (client) {
				const userId = globalStateController.getValue('user').mongoId;
				const { isTable = false, moduleName = '', selectedView = {} } = state?.get({ noproxy: true }) ?? {};

				const ViewController = viewStateController(moduleName);
				const TableController = tableController(moduleName);

				let requestedViewProps = {};
				const fetchViewSettings = id === null ? true : (state?.fetchViewSettings?.get({ noproxy: true }) ?? false);
				const newViewAttributes = fetchViewSettings
					? {
							user: userId,
							type: 'Custom',
							module: isTable ? TableController.getModuleName() : moduleName,
							isDeleted: false,
						}
					: {};

				if (isTable) {
					requestedViewProps = fetchViewSettings ? TableController.getGridViewProperties() : {};
				} else {
					const { filters } = selectedView;
					requestedViewProps = fetchViewSettings ? { filters } : {};
				}

				const view = {
					_id: id,
					...fieldsToUpdate,
					...requestedViewProps,
					...newViewAttributes,
				};

				ViewController.updateState({ isLoading: true });
				ViewController.updateAllViews(view);

				await client.mutate({
					variables: {
						gridView: view,
					},
					mutation: UPSERT_GRID_VIEW,
				});

				await ViewController.fetchAllViews();
				ViewController.updateState({ isLoading: false, fetchViewSettings: false });
			} else {
				throw new Error('Apollo Client is undefined or invalid.');
			}
		} catch (error) {
			console.log('Error: ', error);
		}
	},

	updateViewPreference: (view, action) => {
		const userId = globalStateController.getValue('user').mongoId;
		const { moduleName = '', isTable = false } = state?.get({ noproxy: true }) ?? {};
		const ViewController = viewStateController(moduleName);
		const module = isTable ? tableController(moduleName).getModuleName() : moduleName;
		let fieldsToUpdate = { user: userId, module };

		const toggleUserInArray = arrayOfIds => {
			if (arrayOfIds?.length && arrayOfIds?.includes(userId)) {
				return arrayOfIds?.filter(id => id !== userId);
			} else if (arrayOfIds) {
				return [...arrayOfIds, userId];
			} else {
				return [userId];
			}
		};

		const key = action === 'favourite' ? 'favouriteBy' : 'defaultDisplayBy';
		fieldsToUpdate[key] = toggleUserInArray(view[key]);
		ViewController.updateView({ id: view._id, fieldsToUpdate });
	},
});

export const viewStateController = moduleName => {
	const initialState = { ...viewInitialState, moduleName };

	if (!viewStates[moduleName]) {
		viewStates[moduleName] = hookstate(copy(initialState));
	}

	return {
		...viewStatesControllerHandler(viewStates[moduleName]),
		...hookStateController(viewStates[moduleName], copy(initialState)),
	};
};
