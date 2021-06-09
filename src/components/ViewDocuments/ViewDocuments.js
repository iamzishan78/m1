import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import {
	MenuItem,
	Checkbox,
	Select,
	InputLabel,
	Grid,
	Button,
	FormControl,
	Icon,
	Typography,
	OutlinedInput,
	TextField,
	InputAdornment,
	IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteDocumentConfirmation from "../Shared/DeleteDocumentConfirmation";

import { GETCONTACTFILES } from "../../graphQL/useQueryGetContactFiles";
import { AppContext } from "../../AppContext";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";
import { VIEWFILEQUERY, VIEWFILESQUERY } from "../../graphQL/useQueryViewFile";
import DocViewer from '../Shared/DocViewer'

// functions / value formatters 
import get_file_icon from "../Shared/functions/get_file_icon.js";



const useStyles = makeStyles((theme) => ({
	viewAllCard: {
		backgroundColor: "#ffffff",
	},
	header: {
		margin: "30px",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	headerLeft: {
		flex: 3,
	},
	headerRight: {
		flex: 1,
		textAlign: "right",
		alignSelf: "center",
		margin: "0",
		color: "#757575",
		fontWeight: "normal",
	},
	divider: {
		height: "2px",
		backgroundColor: "#cecece",
		margin: "0px 30px 15px 30px",
	},
	documentsList: {
		padding: 0,
		margin: "0 30px",
	},
	document: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: "20px",
		paddingTop: "20px",
		borderBottom: "1px solid #cecece",
	},
	documentLeft: {
		display: "flex",
		flexDirection: "row",
	},
	documentRight: {
		alignSelf: "center",
		minHeight: "35px",
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		width: "fit-content",
	},
	disabledDownload: {
		cursor: "auto !important",
		color: "#d3d3d3ab !important",
		backgroundColor: "#e9e9e978 !important",
	},
	fileText: {
		marginLeft: "20px",
		alignSelf: "center",
	},
	forImage: {
		width: "100px !important",
		height: "100px !important",
		backgroundColor: "transparent !important",
		// border: "1px solid #999",
		borderRadius: "10px !important",
	  },
	forImageContainer: {
		width: "100px !important",
		height: "100px !important",
		borderRadius: "10px !important",
		backgroundColor: "#eeeeee !important",
		// border: "1px solid #999",
		textAlign: "center",
		fontSize: "1.5rem",
		fontWeight: "bold",
		color: "#555",
		textTransform: "uppercase",
		paddingTop: "30px",
		cursor: "pointer",
		marginBottom: "5px",
	  },

	greySquare: {
		cursor: "pointer",
		borderRadius: "12px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontSize: "30px",
		height: "100px",
		width: "100px",
		backgroundColor: "#cecece",
		marginRight: "10px",

		"& svg": {
			fill: "#999 !important",
		},
	},
	uploadTitle: {
		margin: "0",
		color: "#757575",
		fontWeight: "normal",
		marginBottom: "8px",
	},
	uploadSubtext: {
		color: "rgb(176, 176, 176)",
		margin: "0",
		fontWeight: "normal",
	},
}));

const docs = [
	{ title: "Test Upload1.pdf" },
	{ title: "Test Upload2.pdf" },
	{ title: "Test Upload3.pdf" },
	{ title: "Test Upload4.pdf" },
	{ title: "Test Upload5.pdf" },
];

export default function ViewDocuments(props) {
	const classes = useStyles();
	const [documentSearch, setDocumentSearch] = useState("");
	const [allDocuments, setAllDocuments] = useState([]);
	const [filteredDocuments, setFilteredDocuments] = useState([]);
	const [stateApp, setStateApp] = React.useContext(AppContext);
	const userId = stateApp.user.mongoId;


	// queries 
	const [getAllFiles, { data: files }] = useLazyQuery(GETCONTACTFILES, {
		fetchPolicy: "cache-and-network",
	});

	const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
		fetchPolicy: "no-cache",
	});


	useEffect(() => {

		console.log("VIEW FILE RESULT", viewFileResult);
		if (viewFileResult?.viewFile?.uri) {
			let a = document.createElement("a");
			a.href = viewFileResult.viewFile.uri;
			a.download = viewFileResult.viewFile.name;

			// file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
			a.click();
		}

	}, [viewFileResult]);
	const [
		viewFiles,
		{ data: viewFileResultt, loading: viewFileLoading },
	] = useLazyQuery(VIEWFILESQUERY, {
		fetchPolicy: "no-cache",
	});
	useEffect(() => {
		let ID = [];
		for (let i = 0; i < files?.getFileDescriptors.length; i++) {
			// console.log(files?.getFileDescriptors[i].fileId, 'Kumail Test')
			ID.push(files?.getFileDescriptors[i].fileId);
		}
		viewFiles({
			variables: { fileIds: ID },
		});
		if (files) {
			setAllDocuments(files?.getFileDescriptors);
		}
	}, [files]);
	const handleViewFile = async (id) => {
		viewFile({ variables: { fileId: id } });
	};

	useEffect(() => {
		getAllFiles({
			variables: {
				relatedObjectId: props.contactId,
				relatedObjectType: props.relatedObjectType
					? props.relatedObjectType
					: "Contact",
			},
		});
	}, []);

	useEffect(() => {
		// Search logic (Search on change in search field text)
		let filtered = allDocuments.filter((doc) =>
			doc.fileName.toLowerCase().includes(documentSearch.toLowerCase())
		);
		setFilteredDocuments(filtered);

		console.log("DOCS:", documentSearch, allDocuments);
	}, [documentSearch, allDocuments]);

	const ExtenstionGetter = (name) => {
		let fileExtension = name
			?.slice(name.lastIndexOf(".") + 1)
			?.toLowerCase();

		return fileExtension
	}


	return (
		<div className={classes.viewAllCard}>
			<DocViewer divCondition={false} DocStyle={{ top: '56% ', left: '40% ', width: '98vw ', transform: `translate(1%, -101%)` }} ></DocViewer>

			<div className={classes.header}>
				<div className={classes.headerLeft}>
					<TextField
						fullWidth
						value={documentSearch}
						onChange={(e) => setDocumentSearch(e.target.value)}
						variant="outlined"
						label={"Search Documents"}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						labelWidth={70}
					/>
				</div>
			</div>
			<div className={classes.divider} />

			<ul className={classes.documentsList}>
				{filteredDocuments.map((doc) => {
					console.log("FILE", doc);
					return (
						<li 
						className={classes.document} 
						key={doc.fileUrl}>
							<div 
							className={classes.documentLeft}
							>

								<div
									// className={`${classes.greySquare} 
									
									// ${doc.fileState !== "active"
									// 		? classes.disabledDownload
									// 		: ""

									// 	}`}

									// onClick={() => {

									// 	viewFileResultt?.viewFiles.map((value) => {

									// 		console.log("=============")
									// 		console.log("VALUE", value)
									// 		console.log("VALUE DOC", doc)
									// 		console.log("=============")



									// 		if (value.id === doc.fileId && ExtenstionGetter(doc.fileName) === 'pdf') {
									// 			setStateApp({ ...stateApp, viewDoc: { uri: doc.fileUrl, name: doc.fileName, } })

									// 		}
									// 		else {
									// 			handleViewFile(doc.fileId)
									// 		}

									// 	})
									// }}
								>

									{console.log('VALUE DOC', doc)}
									{console.log('VALUE DOC TEST', new RegExp(
										["jpg", "jpeg", "png", "PNG", "bmp"].join("|")
									).test(ExtenstionGetter(doc.fileName)) )}


									{/* TEMP COMMENT OUT UNTIL WE GET THE CORRECT URI IN THE QUERY	 */}
									{/* {new RegExp(
										["jpg", "jpeg", "png", "bmp"].join("|")
									).test(ExtenstionGetter(doc.fileName)) ? (
										<img
											src={doc.fileUrl}
											alt={doc.fileName}
											className={classes.forImage}
										></img>
									) : (
										<div className={classes.forImageContainer} 
										
											onClick={() => {

											if (ExtenstionGetter(doc.fileName) === 'pdf') {
												setStateApp({ ...stateApp, viewDoc: { uri: doc.fileUrl, name: doc.fileName } })
											}
											else {
												handleViewFile(doc.fileId)
											}
										}}>
											{get_file_icon(ExtenstionGetter(doc.fileName))}
										</div>
									)} */}

								
								{
										<div className={classes.forImageContainer} 
										
											onClick={() => {

											if (ExtenstionGetter(doc.fileName) === 'pdf') {
												setStateApp({ ...stateApp, viewDoc: { uri: doc.fileUrl, name: doc.fileName } })
											}
											else {
												handleViewFile(doc.fileId)
											}
										}}>
											{get_file_icon(ExtenstionGetter(doc.fileName))}
										</div>
									}


								</div>


								<div className={classes.fileText.concat(' DocumentTitle')} style={{ cursor: 'pointer' }}
									onClick={() => {

										if (ExtenstionGetter(doc.fileName) === 'pdf') {
											setStateApp({ ...stateApp, viewDoc: { uri: doc.fileUrl, name: doc.fileName } })
										}
										else {
											handleViewFile(doc.fileId)
										}

									}}>

									<h4 className={classes.uploadTitle}>{doc.fileName}</h4>
									{/* <h5 className={classes.uploadSubtext}>{doc.userName}</h5> */}
									<h5 className={classes.uploadSubtext}>
										{moment.utc(doc.dateTime).format("MMM DD, YYYY")}
									</h5>
								</div>
							</div>
							<div className={classes.documentRight}>
								<IconButton
									onClick={() => {
										props.setOpenDeleteConfirmDialog(true);
										props.setFileIdToDelete(doc.descriptorId);
									}}
								>
									<DeleteIcon />
								</IconButton>

								<IconButton
									disabled={doc.fileState !== "active" ? classes.disabledDownload : ""}
									onClick={() => handleViewFile(doc.fileId)}
								>
									<GetAppIcon />
								</IconButton>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
