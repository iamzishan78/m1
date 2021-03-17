import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import { showErrorMessage, showWarningMessage } from "../../../actions";
import { ADDDESCRIPTORFILE } from "../../../graphQL/useMutationAddDescriptorFile";
const useStyles = makeStyles((theme) => ({
	dropzoneClass: {
		"&:hover": { backgroundColor: "#dddddd" },
		"& .MuiDropzoneArea-text": {
			fontSize: "0.83em",
			marginBlockStart: "1.67em",
			marginBlockEnd: "1.67em",
			fontWeight: "bold",
		},
		"& .MuiDropzoneArea-icon": { display: "none" },
		minHeight: "0px",
		width: "50px",
		padding: "6px 37px",
		color: "#757575",
		fontWeight: "normal",
		backgroundColor: "#eee",
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "2px dashed rgb(176, 176, 176)",
		marginBottom: "30px",
		borderRadius: "10px",
	},
}));

export default function UploadZone(props) {
	const dispatch = useDispatch();
	const [inputFile, setInputFile] = useState(null);
	const [addFile, { data: addFileData, loading: addFileLoading }] = useMutation(
		ADDDESCRIPTORFILE,
		{
			refetchQueries: ["getRecentContactFiles"],
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
		}
	);

	useEffect(() => {
		if (addFileData && addFileData?.addFileDescriptor?.success) {
			console.log("File added: ", addFileData);
			const uri = addFileData.addFileDescriptor.file.uri;
			const interal_key = addFileData.addFileDescriptor.file.internalKey;
			const file_id = addFileData.addFileDescriptor.file.id;
			const file_name = addFileData.addFileDescriptor.file.name;

			if (file_id) {
				fetch(uri, {
					headers: {
						"X-Ms-Blob-Content-Disposition": `attachment; filename="${file_name}"`,
						"X-Ms-Blob-Type": "BlockBlob",
						"X-Ms-Meta-Internalkey": interal_key,
						"X-Ms-Version": "2015-02-21",
					},
					method: "PUT",
					body: inputFile,
				})
					.then((res) => {
						console.log(res);
						if (res?.status == 201) {
							// props.getRecentFiles();
						} else dispatch(showErrorMessage("Upload failed"));
					})
					.catch((err) => console.log(err));
			}
		}
	}, [addFileData]);

	const handleFileInput = (files) => {
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
				});
			}
		}
	};

	const classes = useStyles();

	return (
		<>
			<DropzoneAreaBase
				onAdd={handleFileInput}
				// onDelete={(fileObj) => console.log("Removed File:", fileObj)}
				showAlerts={props.relatedObjectType === "Contact"}
				onAlert={(message, variant) => {
					console.log(`${variant}: ${message}`);
				}}
				filesLimit={1}
				dropzoneText={"+"}
				acceptedFiles={[
					"image/*",
					"video/*",
					"application/*",
					".*",
					".geojson",
					".csv",
					".pdf",
					".docx",
					".doc",
					".ppt",
					".pptx",
					".txt",
					".xls",
					".xlsx",
				]}
				maxFileSize={104857600}
				dropzoneClass={classes.dropzoneClass}
				// getFileAddedMessage={(value) => {
				// 	alert("File is been added", value);
				// }}
			></DropzoneAreaBase>
			{addFileLoading && (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress size="20px" />
				</div>
			)}
		</>
	);
}
