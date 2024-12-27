import React, { useState, useEffect, useContext } from 'react';
import { Document, Page } from 'react-pdf';
import { useSelector } from 'react-redux';

import { Grid, IconButton, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, GetApp as GetAppIcon } from '@material-ui/icons';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import { useLazyQuery } from '@apollo/client';
import _ from 'underscore';

import { GETRECENTCONTACTFILES } from 'graphQL/useQueryGetContactFiles';
import { VIEWFILEQUERY } from 'graphQL/useQueryViewFile';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	paperTwo: {
		backgroundColor: theme.palette.background.paper,
		height: '350px',
		boxShadow: theme.shadows[5],
		overflow: 'none',

		'& .react-pdf__Document': {
			height: '300px',
			overflow: 'scroll',
			width: '100%',
		},
		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 10,
		},
		border: '0px',
		inset: 'unset',
	},
	pdfContainer: {
		overflow: 'none',
		width: '100%',
		height: '520px',
	},
	ZoomIcons: {
		zIndex: '1',
		display: 'flex',
		flexDirection: 'column',
		position: 'sticky !important',
		bottom: '0 !important',
		// left: "15px",
		width: '3.875rem',
	},
}));

export default function PdfViewer({ togglePdfViewState, checkId }) {
	const classes = useStyles();
	const [pdfFile, setFile] = useState({});
	const [pdfState, setpdfState] = useState([]);
	const [numPages, setNumPages] = useState(null);
	let [zoom, setzoom] = useState(2.0);

	const recentFile = useSelector(({ Revenue }) => Revenue?.statements?.recentFile);

	const [getRecentFiles, { data: files }] = useLazyQuery(GETRECENTCONTACTFILES, {
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		if (checkId) {
			getRecentFiles({
				variables: {
					relatedObjectId: checkId,
					relatedObjectType: 'Check',
				},
			});
		}
	}, [getRecentFiles, checkId]);

	const [viewFile, { data: viewFileResult, loading: fileLoading }] = useLazyQuery(VIEWFILEQUERY, {
		fetchPolicy: 'no-cache',
	});

	const fileId =
		files?.getFileDescriptors && files?.getFileDescriptors[0]?.fileId
			? files?.getFileDescriptors && files?.getFileDescriptors[0]?.fileId
			: '';
	useEffect(() => {
		if (recentFile || fileId) {
			viewFile({
				variables: { fileId: recentFile?.fileId || fileId },
			});
		}
	}, [recentFile, viewFile, files?.getFileDescriptors]);

	useEffect(() => {
		if (viewFileResult?.viewFile) {
			setFile(viewFileResult.viewFile);
		}
	}, [viewFileResult]);

	useEffect(() => {
		PageView(numPages);
	}, [numPages]);

	const PageView = num => {
		let Page = [];
		for (let i = 1; i <= num; i++) {
			Page.push(i);
		}
		setpdfState(Page);
	};

	const downloadFile = () => {
		let a = document.createElement('a');
		a.href = pdfFile.uri;
		a.download = pdfFile.name;
		a.click();
	};
	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};
	return (
		<>
			<div className={classes.paperTwo}>
				<Grid item xs={12} style={{ minHeight: '35px', width: '100%', padding: '10px' }}>
					<h4
						style={{
							margin: '0 0 15px 0',
							float: 'left',
							fontSize: '1.1rem',
						}}
					>
						{pdfFile.name}
					</h4>

					<div style={{ float: 'right' }}>
						{!_.isEmpty(recentFile) && (
							<IconButton size="small" style={{ margin: '0 8px' }}>
								{!fileLoading ? (
									<IconButton size="small" onClick={downloadFile}>
										<GetAppIcon />
									</IconButton>
								) : (
									<CircularProgress size={20} color="secondary" />
								)}
							</IconButton>
						)}

						<IconButton onClick={togglePdfViewState} size="small">
							<CloseIcon id="closePdfIcon" className={classes.closeIcon} fontSize="small" />
						</IconButton>
					</div>
				</Grid>

				<div className={classes.pdfContainer}>
					<Document
						style={{ display: 'grid', justifyContent: 'center', width: '100%' }}
						file={pdfFile.uri}
						onLoadSuccess={onDocumentLoadSuccess}
						loading={
							<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
								<CircularProgress />
							</div>
						}
					>
						{pdfState?.map((value, key) => {
							return (
								<Page
									key={key}
									pageNumber={value}
									scale={zoom}
									style={{ display: 'grid', justifyContent: 'center', width: '100%' }}
								/>
							);
						})}
						{(recentFile || files?.getFileDescriptors) && (
							<div className={classes.ZoomIcons}>
								{' '}
								<IconButton
									onClick={() => {
										setzoom(zoom + 0.25);
									}}
								>
									<ZoomInIcon fontSize={'large'} />
								</IconButton>
								<IconButton
									onClick={() => {
										setzoom(zoom - 0.25);
									}}
								>
									<ZoomOutIcon fontSize={'large'} />
								</IconButton>
							</div>
						)}
					</Document>
				</div>
			</div>
		</>
	);
}
