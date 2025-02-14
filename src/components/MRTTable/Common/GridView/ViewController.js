import { UPSERT_GRID_VIEW } from 'graphQL/useMutationUpsertGridView';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';

import { globalStateController } from 'hookstate/globalStateController';
import { StateController } from 'hookstate/stateController';
import { tableController } from 'hookstate/tableController';

class ViewStateController extends StateController {
	constructor(initialState) {
		super(initialState);
	}

	initialize({ Icon, label, client, allViews, isTable = false, styleOverride = null, defaultViewOverride = null }) {
		const userId = globalStateController.getValue('user').mongoId;
		const userDefaultView = allViews?.find(view => view?.defaultDisplayBy?.includes(userId));
		const defaultView = allViews?.find(view => view?.type === 'Default');

		const selectedView = defaultViewOverride || userDefaultView || defaultView || allViews?.[0] || null;

		if (selectedView && !isTable) {
			this.applyView(selectedView);
		}

		this.updateState({
			label,
			client,
			allViews,
			isTable,
			selectedView,
			icon: { jsxEl: Icon },
			...(styleOverride && { styleOverride }),
		});
	}

	applyView(selectedView) {
		if (!selectedView) {
			return;
		}

		const { isTable = false, moduleName = '' } = this.getValues(['isTable', 'moduleName']) || {};
		this.updateState({ selectedView, isLoading: true });

		if (isTable) {
			const TableKey = moduleName;
			tableController(TableKey).applyGridView(selectedView);
		}

		this.updateState({
			isLoading: false,
			isViewOpen: false,
			shouldSyncView: true,
		});
	}

	async fetchAllViews() {
		const userId = globalStateController.getValue('user').mongoId;
		const {
			client = null,
			isTable = false,
			moduleName = '',
		} = this.getValues(['client', 'isTable', 'moduleName']) || {};

		const result = await client.query({
			variables: {
				module: isTable ? tableController(moduleName).getModuleName() : moduleName,
				userId,
			},
			query: GET_GRID_VIEWS,
		});

		const allViews = result?.data?.getGridViews?.gridViews || [];
		this.updateState({ allViews });
	}

	updateAllViews(view) {
		const allViews = this.getValue('allViews') || [];
		let updatedViews = [];

		if (view.isDeleted) {
			updatedViews = allViews.filter(existingView => existingView._id !== view._id);
			if (view._id === this.getValue('selectedView')?._id) {
				const userId = globalStateController.getValue('user').mongoId;
				const userDefaultView = updatedViews?.find(view => view?.defaultDisplayBy?.includes(userId));
				const defaultView = updatedViews?.find(view => view?.type === 'Default');
				const selectedView = userDefaultView || defaultView || allViews?.[0] || null;

				if (selectedView) {
					this.applyView(selectedView);
				}

				this.updateState({ selectedView });
			}
		} else if (view._id) {
			if (view._id === this.getValue('selectedView')?._id) {
				const selectedView = this.getValue('selectedView');
				this.updateState({ selectedView: { ...selectedView, ...view } });
			}

			updatedViews = allViews.map(prevView => (prevView._id === view._id ? { ...prevView, ...view } : prevView));
		} else {
			updatedViews = [...allViews, view];
			this.updateState({ selectedView: view });
		}

		this.updateState({ allViews: updatedViews });
	}

	async updateView({ id = null, fieldsToUpdate = {} }) {
		try {
			const client = this.getValue('client');

			if (client) {
				const userId = globalStateController.getValue('user').mongoId;
				const {
					isTable = false,
					moduleName = '',
					selectedView = {},
				} = this.getValues(['isTable', 'moduleName', 'selectedView']) || {};

				const TableController = tableController(moduleName);

				let requestedViewProps = {};
				const fetchViewSettings = id === null ? true : (this.getValue('fetchViewSettings') ?? false);
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

				this.updateState({ isLoading: true });
				this.updateAllViews(view);

				await client.mutate({
					variables: {
						gridView: view,
					},
					mutation: UPSERT_GRID_VIEW,
				});

				await this.fetchAllViews();
				this.updateState({ isLoading: false, fetchViewSettings: false });
			} else {
				throw new Error('Apollo Client is undefined or invalid.');
			}
		} catch (error) {
			console.log('Error: ', error);
		}
	}

	updateViewPreference(view, action) {
		const userId = globalStateController.getValue('user').mongoId;
		const { moduleName = '', isTable = false } = this.getValues(['isTable', 'moduleName']) || {};
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
		this.updateView({ id: view._id, fieldsToUpdate });
	}
}

export const viewInitialState = {
	client: null,
	moduleName: null,
	isTable: false,
	icon: { jsxEl: null },
	label: null,
	allViews: [],
	selectedView: null,
	isViewOpen: false,
	fetchViewSettings: false,
	styleOverride: {
		bgColor: {},
		color: {},
	},
	isLoading: false,
	shouldSyncView: true,
};

export const viewStates = {};

export const viewStateController = moduleName => {
	if (!viewStates[moduleName]) {
		viewStates[moduleName] = new ViewStateController({ ...viewInitialState, moduleName });
	}

	return viewStates[moduleName];
};
