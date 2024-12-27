import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { CircularProgress } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { useMutation } from '@apollo/client';
import { BlockBlobClient } from '@azure/storage-blob';
import { DropzoneAreaBase } from 'material-ui-dropzone';

import { ADDDESCRIPTORFILE } from 'graphQL/useMutationAddDescriptorFile';

import { showErrorMessage, showWarningMessage } from '../../../actions';

const useStyles = makeStyles(theme => ({
	dropzoneClass: {
		'&:hover': { backgroundColor: '#dddddd' },
		'& .MuiDropzoneArea-text': {
			fontSize: '0.83em',
			marginBlockStart: '1.67em',
			marginBlockEnd: '1.67em',
			fontWeight: 'bold',
		},
		'& .MuiDropzoneArea-icon': { display: 'none' },
		minHeight: '0px',
		width: '100px',
		height: '100px',
		padding: '6px 37px',
		color: '#757575',
		fontWeight: 'normal',
		backgroundColor: '#eee',
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '2px dashed rgb(176, 176, 176)',
		border: '2px dashed #dddddd',
		marginBottom: '30px',
		// marginLeft: '20px',
		borderRadius: '10px',
	},
}));

export default function UploadZone(props) {
	const dispatch = useDispatch();
	const [, setInputFile] = useState(null);
	const [addFile, { loading: addFileLoading }] = useMutation(ADDDESCRIPTORFILE);

	const handleUploadFile = addFileData => {
		if (addFileData && addFileData?.addFileDescriptor?.success) {
			const uri = addFileData.addFileDescriptor.file.uri;
			const interal_key = addFileData.addFileDescriptor.file.internalKey;
			const file_id = addFileData.addFileDescriptor.file.id;
			const file_name = addFileData.addFileDescriptor.file.name;

			setInputFile(inputFile => {
				if (file_id) {
					const blockBlobClient = new BlockBlobClient(uri);
					blockBlobClient
						.uploadBrowserData(inputFile, {
							maxSingleShotSize: 4 * 1024 * 1024,
							blobHTTPHeaders: {
								blobContentDisposition: `attachment; filename="${file_name}"`,
							},
							metadata: {
								Internalkey: interal_key,
							},
						})
						.then(res => {
							if (res?._response?.status === 201) {
								// props.getRecentFiles();
								if (!props.relatedObjectId && props.setUploadedFileData) {
									props.setUploadedFileData(addFileData);
								}
							} else {
								dispatch(showErrorMessage('Upload failed'));
							}
						})
						.catch(err => console.log(err));
				}
				return inputFile;
			});
		}
	};

	const handleFileInput = files => {
		if (Array.isArray(files)) {
			let inputFile = files[0]?.file;
			let fileName = files[0]?.file?.name;

			if (inputFile && fileName) {
				setInputFile(inputFile);
				addFile({
					variables: {
						fileName,
						userId: props.userId,
						relatedObjectId: props.relatedObjectId,
						relatedObjectType: props.relatedObjectType,
					},
					refetchQueries: ['getRecentContactFiles', 'getParcelFiles', 'getParcelFilesCount'],
					awaitRefetchQueries: true,
				}).then(res => {
					handleUploadFile(res.data);
				});
			}
		}
	};

	const classes = useStyles();

	return (
		<>
			<DropzoneAreaBase
				onAdd={handleFileInput}
				showAlerts={props.relatedObjectType === 'Contact'}
				filesLimit={1}
				dropzoneProps={{
					disabled: props.loading || addFileLoading || props.disabled,
				}}
				dropzoneText={'+'}
				// acceptedFiles={[
				// 	"image/*",
				// 	"video/*",
				// 	"application/*",
				// 	".*",
				// 	".geojson",
				// 	".csv",
				// 	".pdf",
				// 	".docx",
				// 	".doc",
				// 	".ppt",
				// 	".pptx",
				// 	".txt",
				// 	".xls",
				// 	".xlsx",
				// 	".mdb",

				// 	// shape
				// 	".shp",
				// 	".shx",
				// 	".sbn",
				// 	".fbn",
				// 	".ain",
				// 	".atx",
				// 	".ixs",

				// 	// phdwin
				// 	".phd",
				// 	".mod",
				// 	".phb",
				// 	".phz",

				// 	// IHS
				// 	".98c",

				// 	// DRILLING INFO
				// 	".DRI",

				// 	// LASSER
				// 	".PRN",

				// 	// DIVESTCO
				// 	".pds",

				// ]}

				maxFileSize={104857600}
				dropzoneClass={classes.dropzoneClass}
				// getFileAddedMessage={(value) => {
				// 	alert("File is been added", value);
				// }}
			></DropzoneAreaBase>
			{(props.loading || addFileLoading) && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress size="20px" />
				</div>
			)}
		</>
	);
}
