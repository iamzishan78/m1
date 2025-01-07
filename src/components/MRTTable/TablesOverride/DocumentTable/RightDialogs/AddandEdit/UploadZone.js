import React, { useState } from 'react';

import { Typography, Divider, Box, Container } from '@material-ui/core';
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
	disabledDropzoneClass : {
		'&:hover': { backgroundColor: '#eee' },
	},
	bold: {
		fontWeight: 'bold',
	},
	linkLabel: {
		fontWeight: 'bold',
		fontSize: '14px',
		display: 'block',
		marginBottom: '5px',
	}
}));

export default function UploadZone({ setFileUpload, relatedObjectType, customClass, title, setUrl, url }) {
	const classes = useStyles();

	const handleFileInput = files => {
		if (Array.isArray(files)) {
			let fileName = files[0]?.file?.name;

			const splittedStrings = fileName?.split('.');
			let docExtention = splittedStrings?.[splittedStrings.length - 1]?.toLowerCase();
			setFileUpload({ upload: true, fileExtension: docExtention, fileInformation: files[0]?.file });
		}
	};

	const validateUrl = (value) => {
		// Regex for basic URL validation
		const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w\d-._~:/?#[\]@!$&'()*+,;=]*)?$/;
		return urlRegex.test(value);
	  };

	const handleUrlChange = (event) => {
		const value = event.target.value;
		const isValid = validateUrl(value);
		setUrl({...url, value: value, isValid: isValid  });
	};

	const handleUrlBlur = () => {
		// Validate URL when the field loses focus
		const error = url?.value && !validateUrl(url?.value) ? true : false;
		const isValid = (error || !url?.value)  ? false : true;
		setUrl({ ...url, error: error, isValid: isValid });
	};

	return (
		<>
			<div className={customClass ? classes.root : null}>
				<Container>
					{title && <label className={classes.bold}>{title}</label>}
					<DropzoneAreaBase
						onAdd={handleFileInput}
						showAlerts={relatedObjectType === 'Contact'}
						filesLimit={1}
						dropzoneText={'+'}
						maxFileSize={104857600}
						dropzoneClass={`${classes.dropzoneClassCRM} ${(url?.value ? classes.disabledDropzoneClass : '')}`} 
						dropzoneProps={
							{disabled:(url?.value ?? false)}
						}
					></DropzoneAreaBase>

					<Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
						<Divider sx={{ flex: 1 }} />
						<Typography
							sx={{
								mx: 2,
								fontSize: '14px',
								fontWeight: 'bold',
								color: '#666',
							}}
						>
							--------- OR ---------
						</Typography>
						<Divider sx={{ flex: 1 }} />
					</Box>
					{/* Drive Link Input */}
					<div style={{ marginTop: '20px' }}>
						<label className={classes.linkLabel}>{'Paste Link'}</label>
						<input
							type="text"
							placeholder="Paste url link to an external document"
							value={url.value}
							onChange={handleUrlChange}
							style={{
								width: '100%',
								padding: '8px',
								borderRadius: '4px',
								border: '1px solid #ccc',
							}}
							onBlur={() =>
								handleUrlBlur()
							}
						/>
						    {/* Error Message */}
							{url.error && (
								<div style={{ color: 'red', marginTop: '8px', fontSize: '12px' }}>
								Please enter a valid URL.
								</div>
							)}
					</div>
				</Container>
			</div>
		</>
	);
}
