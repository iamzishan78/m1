import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import React, { useContext, useState, useEffect, useCallback } from 'react';

import { setStateIfDeepEqual } from 'components/Shared/functions';

import { COMMENTSCOUNTER } from 'graphQL/useQueryCommentsCounter';
import { IFARECONTACTS } from 'graphQL/useQueryIfOwnersAreContacts';
import { TAGSAMPLES } from 'graphQL/useQueryTagSamples';
import { TRACKSBYOBJECTTYPE } from 'graphQL/useQueryTracksByObjectType';

import { AppContext } from 'AppContext';

export const TableHOC = Component => {
	return function HOC(props) {
		const [rows, Rows] = useState([]);
		const setRows = newState => {
			setStateIfDeepEqual(Rows, newState);
		};
		const [searchedRows, setSearchedRows] = useState([]);

		const [loading, Loading] = useState(true);
		const setLoading = newState => {
			setStateIfDeepEqual(Loading, newState);
		};
		const [page, setPage] = useState(0);

		const [dataTracksIds, DataTracksIds] = useState(null);
		const setDataTracksIds = newState => {
			setStateIfDeepEqual(DataTracksIds, newState);
		};

		const [dataTracks, DataTracks] = useState(null);
		const setDataTracks = newState => {
			setStateIfDeepEqual(DataTracks, newState);
		};

		const [tracksByObjectType, { data: constDataTracks }] = useLazyQuery(TRACKSBYOBJECTTYPE, {
			fetchPolicy: 'cache-and-network',
		});
		const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER, {
			fetchPolicy: 'cache-and-network',
		});
		const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, { fetchPolicy: 'cache-and-network' });
		const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData }] = useLazyQuery(IFARECONTACTS, {
			fetchPolicy: 'cache-and-network',
		});

		const [dependencyUpdate, SetDependencyUpdate] = useState(false);

		const [stateApp, setStateApp] = useContext(AppContext);

		// useEffect(() => {
		//     const tracksByObjectType = async () => {
		//         if (
		//             props.targetLabel &&
		//             stateApp.user &&
		//             stateApp.user.mongoId &&
		//             props.showTracks &&
		//             props.targetLabel !== "contact" &&
		//             !dataTracks
		//         ) {
		//             const { data: constDataTracks } = await client.query({
		//                 query: TRACKSBYOBJECTTYPE,
		//                 variables: {
		//                     objectType:
		//                         props.targetLabel === "Parcel Interest"
		//                             ? "Parcel Ownership"
		//                             : props.targetLabel,
		//                 },
		//             })
		//             const tracksIdArray = constDataTracks.tracksByObjectType.map((track) => track.trackOn);
		//             setDataTracksIds(tracksIdArray);
		//             setDataTracks(constDataTracks);
		//         }
		//     }
		//     tracksByObjectType()
		// }, [stateApp.user, props.targetLabel, props.showTracks]);

		useEffect(() => {
			if (constDataTracks?.tracksByObjectType) {
				const tracksIdArray = constDataTracks.tracksByObjectType.map(track => track.trackOn);
				setDataTracksIds(tracksIdArray);
				setDataTracks(constDataTracks);
			}
		}, [constDataTracks]);

		useEffect(() => {
			setSearchedRows(rows);
		}, [rows]);

		useEffect(() => {
			if (
				props.targetLabel &&
				stateApp.user &&
				stateApp.user.mongoId &&
				props.showTracks &&
				props.targetLabel !== 'contact' &&
				!dataTracks
			) {
				tracksByObjectType({
					variables: {
						objectType: props.targetLabel === 'Parcel Interest' ? 'Parcel Ownership' : props.targetLabel,
					},
				});
			}
		}, [stateApp.user, props.targetLabel, props.showTracks]);

		useEffect(() => {
			SetDependencyUpdate(!dependencyUpdate);
		}, [dataCommentsCounter, dataTagSamples, checkIfOwnersAreContactsData, constDataTracks]);

		const initializeGenericData = useCallback(
			(ids, actions) => {
				if (actions.includes('comments')) {
					getCommentsCounter({
						query: COMMENTSCOUNTER,
						variables: {
							objectsIdsArray: ids,
							userId: stateApp.user.mongoId,
						},
					});
				}

				if (actions.includes('tags')) {
					getTagSamples({
						query: TAGSAMPLES,
						variables: {
							objectsIdsArray: ids,
							userId: stateApp.user.mongoId,
						},
					});
				}
				if (actions.includes('ifAreContacts')) {
					checkIfOwnersAreContacts({
						query: IFARECONTACTS,
						variables: {
							idsArray: ids,
						},
					});
				}
			},
			[stateApp?.user?.mongoId, getCommentsCounter, getTagSamples, checkIfOwnersAreContacts]
		);

		const ifAreContacts = ids => {
			checkIfOwnersAreContacts({
				query: IFARECONTACTS,
				variables: {
					idsArray: ids,
				},
			});
		};

		const setGenricData = (data, id, actions) => {
			if (actions.includes('tracks')) {
				data.isTracked = false;
				for (let i = 0; i < dataTracks?.tracksByObjectType.length; i++) {
					if (id === dataTracks?.tracksByObjectType[i].trackOn) {
						data.isTracked = true;
						break;
					}
				}
			}
			if (actions.includes('comments')) {
				data.commentsCounter = 0;
				const comments = dataCommentsCounter?.commentsCounter || [];
				for (let i = 0; i < comments.length; i++) {
					if (id === comments[i]._id) {
						data.commentsCounter = comments[i].total;
						break;
					}
				}
			}
			if (actions.includes('tags')) {
				data.tags = [[], 0];
				const tags = dataTagSamples?.tagSamples || [];
				for (let i = 0; i < tags.length; i++) {
					if (id === tags[i]._id) {
						data.tags = [tags[i].tags, tags[i].total];
						break;
					}
				}
			}

			if (actions.includes('ifAreContacts')) {
				const ifAreContacs = checkIfOwnersAreContactsData?.ifAreContacts || [];
				if (ifAreContacs.length > 0) {
					let contact;
					if (!data.contactId) {
						contact = ifAreContacs.find(ifc => {
							if (
								ifc.globalOwner?.replace(/-/g, '') === data.id?.replace(/-/g, '') ||
								ifc.globalOwner?.replace(/-/g, '') === data.globalOwnerId?.replace(/-/g, '')
							) {
								return true;
							}
							return false;
						});
					} else {
						contact = ifAreContacs.find(ifc => ifc._id === data.contactId);
					}
					if (contact) {
						data.isContact = contact.isContact;
						data.entity = contact._id;
					}
				}
			}
			return data;
		};

		const initializeTableActions = (tableState, meta, tableData, columns, gqlQuery, selectedGridView = {}) => {
			let pageESVariables = {
				variables: {
					esIndex: tableState.esIndex,
					search: tableState.searchText ? `${tableState.searchText}*` : '',
					pagination: {
						// pit: tableData?.before_pit,
						first: tableState.rowsPerPage,
						after: null,
					},
					...(!isEmpty(tableState.sortOrder) && {
						sort: (() => {
							let field =
								columns.find(el => el.name === tableState.sortOrder?.name)?.esKey ||
								columns.find(el => el.name === tableState.sortOrder?.name)?.name;
							// if (!Array.isArray(field)) field = [ field ]
							if (Array.isArray(field)) {
								return [
									{
										_script: {
											type: 'number',
											script: {
												lang: 'painless',
												source: `if (
                                                    ${field.map(el => `doc['${el}'].isEmpty()`).join(' && ')}
                                                ) {return 1} else {return 0}`,
											},
											order: 'asc',
										},
									},
									{
										_script: {
											type: 'string',
											script: {
												lang: 'painless',
												source: `${field.map(el => `if (!doc['${el}'].isEmpty()) {return doc['${el}'].value}`).join(' else ')}
                                                    else {return ''}`,
											},
											order: tableState.sortOrder?.direction,
										},
									},
								];
							} else {
								return {
									[field]: {
										order: tableState.sortOrder?.direction,
										// unmapped_type: "null",
										missing: '_last',
									},
								};
							}
						})(),
					}),
					filters: tableState.esFilters ? [...tableState.esFilters] : [],
					customFilters: [],
					// ...(tableState.esFilters) && { filters: [...tableState.esFilters] || [] },
				},
			};
			tableState.filterList.forEach((val, index) => {
				if (val.length > 0 && columns[index]) {
					if (columns[index].custom?.isDate) {
						const filterData = stateApp.filtersData[columns[index].name];
						if (filterData) {
							const data = filterData.find(f => f.key === val[0] || f.key_as_string === val[0]);
							pageESVariables.variables.filters.push({ field: columns[index].esKey, value: data.key_as_string });
						}
					} else if (columns[index]?.custom?.filterOptions?.length > 0) {
						pageESVariables.variables.customFilters.push({ field: columns[index]?.esKey, value: val[0] });
					} else if (columns[index]?.custom?.formatedFilterOptions?.length > 0) {
						let value = val[0];
						const filterData = columns[index]?.custom?.formatedFilterOptions;
						const data = filterData.find(f => f.label === value);
						if (data) {
							value = data.value;
						}
						pageESVariables.variables.filters.push({ field: columns[index]?.esKey, value });
					} else if (columns[index]?.custom?.formatedFilterOptions?.length > 0 && columns[index]?.custom?.isPurchased) {
						let value = val[0];
						const filterData = columns[index]?.custom?.formatedFilterOptions;
						const data = filterData.find(f => f.label === value);
						pageESVariables.variables.filters.push({ field: columns[index]?.esKey, value: data.key_as_string });
					} else {
						val.forEach(v => {
							pageESVariables.variables.filters.push({ field: columns[index]?.esKey, value: v });
						});
					}
				}
			});
			// if (selectedGridView?.filters /* && selectedGridView.type === 'Default' */) {
			//     selectedGridView.filters.forEach(filter => {
			//         pageESVariables.variables.filters.push(filter)
			//     })
			// }

			return {
				pageESVariables,
				genericESAction: () => {
					setLoading(true);
					setPage(0);
					tableState.page = 0;
					meta.setPageInd(tableState.page);
					meta.setRowsPerPage(tableState.rowsPerPage);
					gqlQuery(pageESVariables);
				},
				changeESPage: () => {
					setLoading(true);

					let afterSort = rows && tableState.page > page ? rows[rows.length - 1]?.sort : null;

					gqlQuery({
						...pageESVariables,
						variables: {
							...pageESVariables.variables,
							pagination: {
								pit: tableData.pit,
								...pageESVariables.variables.pagination,
								before: tableState.page === 0 ? null : rows && tableState.page < page ? rows[0]?.sort : null,
								after: afterSort,
							},
						},
					});
					setPage(tableState.page);
				},
				searchClientSide: () => {
					let searchRows = [];
					searchRows = JSON.parse(JSON.stringify(rows));
					for (let j = 0; j < tableState.filterList.length; j++) {
						if (tableState.filterList[j].length > 0) {
							for (let i = 0; i < searchRows.length; i++) {
								const isFiltered = searchRows[i].isFiltered !== false;
								const rowdata = searchRows[i][columns[j].name];
								const filter = tableState.filterList[j][0];
								if (isFiltered && rowdata !== filter) {
									searchRows[i].isFiltered = false;
									continue;
								}
							}
						}
					}
					setSearchedRows(searchRows.filter(row => row.isFiltered !== false));
				},
				extendSearchQuery: extraSearch => {
					if (pageESVariables.variables.search) {
						pageESVariables.variables.search = `${pageESVariables.variables.search} AND ${extraSearch}`;
					} else {
						pageESVariables.variables.search = `${extraSearch}`;
					}
				},
			};
		};

		return (
			<Component
				{...props}
				rows={rows}
				searchedRows={searchedRows}
				setSearchedRows={setSearchedRows}
				loading={loading}
				dataTracks={dataTracksIds}
				setRows={setRows}
				setLoading={setLoading}
				initializeGenericData={initializeGenericData}
				ifAreContacts={ifAreContacts}
				setGenricData={setGenricData}
				dependencyUpdate={dependencyUpdate}
				initializeTableActions={initializeTableActions}
				page={page}
				setPage={setPage}
			/>
		);
	};
};

export default TableHOC;
