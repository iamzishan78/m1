import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

import MRTTable from 'components/MRTTable';

import { slidoutStateController } from 'hookstate/slidoutStateController';
import { tableGlobalController } from 'hookstate/tableController';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: '65px',
		'& div': {
			'&>.MuiPaper-root': {
				display: 'flex',
				'flex-direction': 'column',
				// height: "calc(100vh - 65px)",
				position: 'relative',
				'align-items': 'stretch',
				'&>.MuiPaper-root': {
					display: 'contents',
				},
				'&>:nth-child(3)': {
					// height: "inherit !important",
				},
				'&> table': {
					bottom: 0,
				},
			},
		},

		'& .MuiDrawer-paperAnchorRight': {
			overflow: 'hidden',
		},
	},
}));

export default function DocumentComponent() {
	const classes = useStyles();
  	const location = useLocation();


	const [getDbData, { data: elasticData }] = useLazyQuery(GET_DB_DATA, {
		fetchPolicy: 'no-cache',
	});

	// Function to extract the document ID from the URL
	const getDocIdFromUrl = () => {
		const match = location.pathname.match(/details\/([^/]+)/);
		return match ? match[1] : null;
	  };

	useEffect(() => {
		return () => {
			window.setStateApp(state => ({
				...state,
				pdfView: null,
				viewDoc: null,
				selectedDocument: {},
				DocumentDrawer: false,
			}));
		};
	}, []);

	useEffect(() => {
		// Set the initial document ID from the URL on page load or refresh
		const idFromUrl = getDocIdFromUrl();
		if (idFromUrl) {
			getDbData({
				variables: {
					index: 'documents_flat',
					pagination: {
						first: 1,
						keep_alive: '1micros',
					},
					search: {},
					filters: { field: '_id', 
						value: [idFromUrl]
					},
					sort: [],
				},
			});

		}
	  }, [location]);
	
	  useEffect(() => {
		if (elasticData?.getDbData?.hits?.length) {
			tableGlobalController.updateState({
				documentDialog: {
					type: 'createAndAddDocument',
					tableKey: 'DocumentTable',
					selectedRow: elasticData?.getDbData?.hits[0],
				},
			});
		
			slidoutStateController.updateState({
				newEntity: false,
				title: 'File Detail',
			});
		}
	  }, [elasticData])

	return (
		<div className={classes.root}>
			{/* Documents Table*/}
			{/* 65465465465 */}
			<MRTTable name="DocumentTable" />
		</div>
	);
}
