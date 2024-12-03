import React, { useContext, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserGridViewSettingAction } from 'store/actions/sessionActions';

import TableHeader from 'components/Table/constants/agreements-header-schema';

import { AppContext } from 'AppContext';
import { useLazyQuery } from '@apollo/client';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';
import { isEmpty } from 'lodash-es';
import { formattingGridView, sortColumns } from 'utils/helper';
import { handleSelectedGridChange } from '../Table/helpers';
import { setStateIfDeepEqual, copy } from 'components/Shared/functions';

export const GridViewHOC = (Component, category = '') => {
	return function HOC(props) {
		const dispatch = useDispatch();
		const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
		const GridViewModule = userGridViewSettings[`${category}s`];
		const defaultView = {
			name: `All ${category}`,
			type: 'Default',
		};

		const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader())));
		const [selectedGridView, setSelectedGridView] = useState(defaultView);
		const [gridViews, setGridViews] = useState(null);
		const [metaDatas, setMetaDatas] = useState(null);
		const [stateApp, setStateApp] = useContext(AppContext);

		const selectedFilters = useRef([]);

		const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);
		const [getGridViews, { data: gridViewsData }] = useLazyQuery(GET_GRID_VIEWS);

		const setColumns = newState => {
			setStateIfDeepEqual(Columns, newState);
		};

		useEffect(() => {
			return () => {
				setStateApp(stateApp => ({
					...stateApp,
					documentSearchQuery: '',
				}));
			};
		}, []);

		useEffect(() => {
			setSelectedGridView(GridViewModule || defaultView);
		}, [GridViewModule]);

		useEffect(() => {
			getMetaData({
				variables: {
					user: stateApp.user?.mongoId,
					category,
				},
			});
		}, [getMetaData, getGridViews]);

		useEffect(() => {
			if (gridViewsData?.getGridViews?.gridViews) {
				setGridViews(gridViewsData.getGridViews.gridViews);
			}
		}, [gridViewsData]);

		useEffect(() => {
			if (metaDataRes?.getMetaData?.metaData) {
				setMetaDatas(metaDataRes?.getMetaData?.metaData);
			}
		}, [metaDataRes]);

		useEffect(() => {
			if (selectedGridView && metaDatas) {
				const selectedData = JSON.parse(JSON.stringify(selectedGridView));
				setStateApp((state, props) => {
					return {
						...state,
						selectedView: selectedData,
					};
				});
				const tableHeader = copy(TableHeader());

				let filterColumns = props.columns.filter(col => !metaDatas.find(meta => meta.name === col.name));

				let columnsData = JSON.parse(JSON.stringify([...filterColumns, ...metaDatas]));
				for (let i = 0; i < metaDatas.length; i++) {
					tableHeader.push(metaDatas[i]);
				}

				let view = JSON.parse(JSON.stringify(selectedData));
				if (!isEmpty(view)) {
					view = formattingGridView(JSON.parse(JSON.stringify(view)));
					columnsData = handleSelectedGridChange(tableHeader, view, columnsData);
				}

				columnsData = sortColumns(columnsData, view);

				setColumns(columnsData);
			}
		}, [selectedGridView, metaDatas, props.columns]);

		useEffect(() => {
			setSelectedGridView(GridViewModule || defaultView);
		}, [GridViewModule]);

		const updateColumnSorting = value => {
			dispatch(
				updateUserGridViewSettingAction.STARTED({
					userGridViewSetting: {
						module: `${category}s`,
						gridView: selectedGridView._id,
						gridViewPatch: {
							filters: selectedFilters.current,
							columns: value.map(col => ({ name: col.name, display: col.display === 'true' })),
						},
						user: stateApp.user?.mongoId,
					},
				})
			);
		};

		const viewColumnProps = {
			selectedGridView,
			updateColumnSorting,
		};

		return (
			<Component
				{...props}
				updateColumnSorting={updateColumnSorting}
				gridViewColumns={columns}
				viewColumnProps={viewColumnProps}
			/>
		);
	};
};

export default GridViewHOC;
