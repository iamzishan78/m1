import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { CircularProgress } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useMutation } from '@apollo/client';
import { BlockBlobClient } from '@azure/storage-blob';
import { DropzoneAreaBase } from 'material-ui-dropzone';

import { ADDDESCRIPTORFILE } from 'graphQL/useMutationAddDescriptorFile';

import { showErrorMessage } from 'actions';

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
}));

export default function UploadZone(props) {
	const dispatch = useDispatch();
	const [inputFile, setInputFile] = useState(null);
	const [addFile, { data: addFileData, loading: addFileLoading }] = useMutation(ADDDESCRIPTORFILE, {
		refetchQueries: ['getRecentContactFiles'],
		awaitRefetchQueries: true,
		//   onCompleted: () => {
		//     // setTimeout(() => {
		//     //   getRecentFiles({
		//     //     variables: {
		//     //       contactId: props.id,
		//     //     },
		//     //   });
		//     // }, 3000);
		//   },
	});

	useEffect(() => {
		if (addFileData && addFileData?.addFileDescriptor?.success) {
			const uri = addFileData.addFileDescriptor.file.uri;
			const interal_key = addFileData.addFileDescriptor.file.internalKey;
			const file_id = addFileData.addFileDescriptor.file.id;
			const file_name = addFileData.addFileDescriptor.file.name;

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
							if (props.setFileData) {
								props.setFileData(addFileData);
							}
						} else {
							dispatch(showErrorMessage('Upload failed'));
						}
					})
					.catch(err => console.log(err));
				if (props.onFileUpload) {
					props.onFileUpload(addFileData.addFileDescriptor.file);
				}
			}
		}
	}, [addFileData]);

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
						fileId: props.fileId,
					},
				});
			}
		}
	};

	const classes = useStyles();

	return (
		<>
			<div className={props.customClass ? classes.root : null}>
				<Container>
					<DropzoneAreaBase
						onAdd={handleFileInput}
						showAlerts={props.relatedObjectType === 'Contact'}
						filesLimit={1}
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
						dropzoneClass={classes.dropzoneClassCRM}
						// getFileAddedMessage={(value) => {
						// 	alert("File is been added", value);
						// }}
					></DropzoneAreaBase>
				</Container>
			</div>

			{addFileLoading && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress size="20px" />
				</div>
			)}
		</>
	);
}
