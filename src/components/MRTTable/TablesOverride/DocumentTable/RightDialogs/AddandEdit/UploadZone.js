import React from 'react';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { DropzoneAreaBase } from 'material-ui-dropzone';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiContainer-root': {
			paddingLeft: '0px',
			paddingRight: '0px',
			'& .MuiDropzoneArea-root': {
				width: '50px',
				minHeight: '50px !important',
				height: '50px !important',
				borderRadius: '50%',
				border: 'none',
				fontSize: 'xx-large',
				backgroundColor: 'transparent',
				color: '#c8c8c8',
				'&:hover': {
					backgroundColor: '#dddddd',
				},
			},
		},
	},
	dropzoneClassCRM: {
		'&:hover': { backgroundColor: '#dddddd' },
		'& .MuiDropzoneArea-text': {
			fontSize: '0.83em',
			marginBlockStart: '1.67em',
			marginBlockEnd: '1.67em',
			fontWeight: 'bold',
		},
		'& .MuiDropzoneArea-icon': { display: 'none' },
		color: '#757575',
		fontWeight: 'normal',
		backgroundColor: '#eee',
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '2px dashed #dddddd',
		marginBottom: '30px',
	},
	bold: {
		fontWeight: 'bold',
	},
}));

export default function UploadZone({ setFileUpload, relatedObjectType, customClass, title }) {
	const handleFileInput = files => {
		if (Array.isArray(files)) {
			let fileName = files[0]?.file?.name;

			const splittedStrings = fileName?.split('.');
			let docExtention = splittedStrings?.[splittedStrings.length - 1]?.toLowerCase();
			setFileUpload({ upload: true, fileExtension: docExtention, fileInformation: files[0]?.file });
		}
	};

	const classes = useStyles();

	return (
		<>
			<div className={customClass ? classes.root : null}>
				<Container>
					{title && <label className={classes.bold}>{title}</label> }
					<DropzoneAreaBase
						onAdd={handleFileInput}
						showAlerts={relatedObjectType === 'Contact'}
						filesLimit={1}
						dropzoneText={'+'}
						maxFileSize={104857600}
						dropzoneClass={classes.dropzoneClassCRM}
					></DropzoneAreaBase>
				</Container>
			</div>
		</>
	);
}
