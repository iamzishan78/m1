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
import { VIEWFILEQUERY } from "../../graphQL/useQueryViewFile";

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
	},
	greySquare: {
		cursor: "pointer",
		borderRadius: "12px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "#999",
		fontSize: "30px",
		height: "80px",
		width: "80px",
		backgroundColor: "#cecece",
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
	const [stateApp] = React.useContext(AppContext);
	const userId = stateApp.user.mongoId;

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
		// if (viewFileResult) {
		//   fetch(viewFileResult.viewFile.uri, {
		//     headers: {
		//       "Content-Type": "text/plain; charset=UTF-8",
		//       "X-Ms-Blob-Type": "BlockBlob",
		//       "X-Ms-Meta-Internalkey": viewFileResult.viewFile.internalKey,
		//       "X-Ms-Version": "2015-02-21",
		//     },
		//     method: "GET",
		//   })
		//     .then((res) => res.json())
		//     .then((res) => {
		//       console.log("FILE RESPONSE: ", res);
		//     })
		//     .catch((e) => {
		//       console.log("Could not view file", e);
		//     });
		// }
	}, [viewFileResult]);

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
		if (files) {
			setAllDocuments(files?.getFileDescriptors);
		}
		console.log("FILES:", files);
	}, [files]);

	useEffect(() => {
		// Search logic (Search on change in search field text)
		let filtered = allDocuments.filter((doc) =>
			doc.fileName.toLowerCase().includes(documentSearch.toLowerCase())
		);
		setFilteredDocuments(filtered);
		console.log("DOCS:", documentSearch, allDocuments);
	}, [documentSearch, allDocuments]);

	return (
		<div className={classes.viewAllCard}>
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
						<li className={classes.document} key={doc.fileUrl}>
							<div className={classes.documentLeft}>
								<div
									className={`${classes.greySquare} ${
										doc.fileState !== "active" ? classes.disabledDownload : ""
									}`}
									onClick={() => handleViewFile(doc.fileId)}
								>
									<GetAppIcon fontSize="large" />
								</div>
								<div className={classes.fileText}>
									<h4 className={classes.uploadTitle}>{doc.fileName}</h4>
									{/* <h5 className={classes.uploadSubtext}>{doc.userName}</h5> */}
									<h5 className={classes.uploadSubtext}>
										{moment.utc(doc.dateTime).format("MMM DD, YYYY")}
									</h5>
								</div>
							</div>
							<div className={classes.documentRight}>
								<IconButton
									style={{ marginBottom: "8px" }}
									onClick={() => {
										props.setOpenDeleteConfirmDialog(true);
										props.setFileIdToDelete(doc.descriptorId);
									}}
								>
									<DeleteIcon />
								</IconButton>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
