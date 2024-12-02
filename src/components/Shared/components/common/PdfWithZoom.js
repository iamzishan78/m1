import React, { useState } from 'react';
import _ from 'underscore';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { Document, Page } from 'react-pdf';

const useStyles = makeStyles(theme => ({
	ZoomIcons: {
		zIndex: '1',
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute !important',
		top: '85% !important',
		bottom: '0 !important',
		left: '15px',
		width: '3.875rem',
	},
	docViewSection: {
		overflow: 'scroll',
		height: '96%',
		width: '100%',
	},
}));

export default function PdfWithZoom({ numPages, viewToken, onDocumentLoadSuccess }) {
	const classes = useStyles();
	let [zoom, setzoom] = useState(2.0);

	return (
		<div className={classes.docViewSection}>
			<Document file={viewToken} options={{ workerSrc: '/pdf.worker.js' }} onLoadSuccess={onDocumentLoadSuccess}>
				{Array.from(new Array(numPages), (el, index) => (
					<Page key={`page_${index + 1}`} scale={zoom} pageNumber={index + 1} />
				))}
			</Document>

			{numPages && (
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
		</div>
	);
}
