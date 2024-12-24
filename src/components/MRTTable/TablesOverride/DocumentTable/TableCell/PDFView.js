import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { CircularProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import 'components/Shared/ViewDocStyle.css';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const useStyles = makeStyles(theme => ({
	paper: {
		backgroundColor: theme.palette.background.paper,
		height: '100vh !important',
		boxShadow: theme.shadows[5],
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
		width: props => props.width ?? 'calc(100vw - 650px)',
	},
	modalHeader: {
		minHeight: '35px',
		width: '100%',
		display: 'block',
		padding: theme.spacing(2, 4, 3),
	},
	paperTwo: {
		backgroundColor: theme.palette.background.paper,
		height: '950px',
		boxShadow: theme.shadows[5],
		border: '0px',
		inset: 'unset',
	},
	ZoomIcons: {
		zIndex: '1',
		display: 'flex',
		flexDirection: 'column',
		position: 'sticky !important',
		bottom: '40px !important',
		width: '3.875rem',
	},
	docViewSection: {
		overflow: 'scroll',
		height: '95%',
		width: '100%',
		padding: theme.spacing(2, 4, 3),
	},
	viewerHeader: {
		minHeight: '35px',
		width: '100%',
		padding: theme.spacing(2, 4, 3),
	},
}));

const DocViewer = ({
	DocStyle = { transform: 'translate(0%, -100%)' },
	divCondition = false,
	width,
	onCloseHandler = null,
	viewDoc,
}) => {
	const classes = useStyles({ width });
	const [numPages, setNumPages] = useState(null);
	let [, setPageNumber] = useState(1);
	const [pdfState, setpdfState] = useState([]);
	let [zoom, setzoom] = useState(1.5);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

	useEffect(() => {
		setPageNumber(1);
		PageView(numPages);
	}, [numPages]);

	const PageView = num => {
		let Page = [];
		for (let i = 1; i <= num; i++) {
			Page.push(i);
		}
		setpdfState(Page);
	};

	const downloadFile = viewFile => {
		if (viewFile?.uri) {
			let a = document.createElement('a');
			a.href = viewFile.uri;
			a.download = viewFile.name;
			a.click();
		}
	};

	return (
		<Modal
			open={!!viewDoc}
			aria-labelledby="simple-modal-title Facebook"
			aria-describedby="simple-modal-description"
			style={{ zIndex: '99999', border: '0px', inset: 'unset' }}
			disableAutoFocus={true}
			hideBackdrop={true}
			isablePortal={true}
			disableEnforceFocus={true}
			keepMounted={true}
			disableBackdropClick={true}
		>
			<div style={DocStyle} className={classes.paper}>
				<Grid item xs={12} className={classes.modalHeader}>
					<h4
						style={{
							margin: '0 0 15px 0',
							float: 'left',
							fontSize: '1.1rem',
						}}
					>
						{viewDoc?.name}
					</h4>

					<div style={{ float: 'right' }}>
						{viewDoc?.uri ? (
							<IconButton onClick={() => downloadFile(viewDoc)}>
								<GetAppIcon />
							</IconButton>
						) : (
							<CircularProgress size={20} color="secondary" />
						)}

						<IconButton
							onClick={() => {
								if (onCloseHandler) {
									onCloseHandler();
								}
							}}
						>
							<CloseIcon />
						</IconButton>
					</div>
				</Grid>

				<div className={classes.docViewSection}>
					<Document
						style={{ display: 'grid', justifyContent: 'center' }}
						file={viewDoc?.uri}
						scale={3.0}
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
									style={{ display: 'grid', justifyContent: 'center', margin: 'auto' }}
								/>
							);
						})}
					</Document>

					<div className={classes.ZoomIcons}>
						{' '}
						<IconButton
							onClick={() => {
								setzoom(zoom + 0.25);
							}}
						>
							<ZoomInIcon fontSize="large" />
						</IconButton>
						<IconButton
							onClick={() => {
								setzoom(zoom - 0.25);
							}}
						>
							<ZoomOutIcon fontSize="large" />
						</IconButton>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DocViewer;
