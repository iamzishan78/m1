import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import { showErrorMessage } from 'actions';

import { BlockBlobClient } from '@azure/storage-blob';

import { UPSERT_WORKSPACE_SETTINGS } from 'graphQL/useMutationWorksapceSettings';
import { ADDFILE } from 'graphQL/useMutationAddFile';

import { AppContext } from 'AppContext';
import { workspaceTenantName } from 'components/Shared/functions';

const useStyles = makeStyles(theme => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
		'& .MuiTypography-root': {
			fontSize: '26px',
			fontWeight: 'bold',
		},
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},

	dateRoot: {
		border: '1px solid #EBEBEB',

		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
	},
	inputFieldDate: {
		marginBottom: '7px',
	},
	notchedOutline: {
		border: 0,
	},

	forImage: {
		width: '135px !important',
		height: '130px !important',
		backgroundColor: 'transparent !important',
		borderRadius: '10px !important',
	},
	button: {
		textTransform: 'none',
		width: '100%',
		textAlign: 'center',
		marginBottom: '4px',
	},
	cancelButton: {
		textTransform: 'capitalize',
	},
}));

const DialogTitle = props => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography>{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
};

const DialogContent = withStyles(theme => ({
	root: {
		padding: theme.spacing(2),
		height: '300px',
	},
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
	},
}))(MuiDialogActions);

const m1neralIconPath = `${process.env.PUBLIC_URL}/icons/logo-192x192.png`;

export default function CustomizedDialogs({
	workspaceSettings,
	setWorkspaceModal,
	setLogoSrc,
	logoTitle,
	setLogoTitle,
}) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [inputFile, setInputFile] = useState(null);
	const [src, setSrc] = useState(workspaceSettings?.fileUrl ?? m1neralIconPath);
	const [workspaceTitle, setWorkspaceTitle] = useState(logoTitle ?? 'm1neral');
	const [addOrUpdateWorkspaceSettings, { data: upsertWorkspaceSettings }] = useMutation(UPSERT_WORKSPACE_SETTINGS);
	const [addFile, { data: fileData }] = useMutation(ADDFILE);

	const [stateApp] = useContext(AppContext);

	useEffect(() => {
		if (fileData && fileData.addFile) {
			if (fileData.addFile.success) {
				// Upload file to MS Blob Storage

				const uri = fileData.addFile.file.uri;
				const interal_key = fileData.addFile.file.internalKey;
				const file_id = fileData.addFile.file.id;
				const file_name = fileData.addFile.file.name;

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
								addOrUpdateWorkspaceSettings({
									variables: {
										workspaceSettings: {
											name: workspaceTenantName(),
											modifier: stateApp.user._id,
											file: fileData.addFile.file.id,
											title: workspaceTitle,
										},
									},
								});
							} else dispatch(showErrorMessage('Upload failed'));
						})
						.catch(err => console.log(err));
				}
			}
		}
	}, [fileData]);

	useEffect(() => {
		if (upsertWorkspaceSettings?.upsertWorkspaceSettings?.status === true) {
			setLogoSrc(src);
			setLogoTitle(workspaceTitle);
			handleClose();
		}
	}, [upsertWorkspaceSettings]);

	const handleClose = () => {
		setWorkspaceModal(false);
	};

	const handleFileInput = e => {
		if (e.target.files?.length > 0) {
			const file = e.target.files[0];
			let inputFile = file;
			let fileName = file.name;

			if (inputFile && fileName) {
				setInputFile(inputFile);
				setSrc(URL.createObjectURL(inputFile));
			}
		}
	};

	const saveSettings = () => {
		if (src === m1neralIconPath || !inputFile?.name) {
			const obj = {
				name: workspaceTenantName(),
				modifier: stateApp.user._id,
				title: workspaceTitle,
			};
			if (src === m1neralIconPath) obj.file = null;
			addOrUpdateWorkspaceSettings({
				variables: {
					workspaceSettings: obj,
				},
				refetchQueries: ['getWorkspaceSettings'],
				awaitRefetchQueries: true,
			});
		} else {
			addFile({
				variables: {
					fileName: inputFile.name,
					userId: stateApp.user._id,
				},
			});
		}
	};

	const handleRemoveImage = () => {
		setSrc(m1neralIconPath);
	};

	return (
		<div>
			<Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={true} maxWidth={'md'}>
				<DialogTitle id="customized-dialog-title" onClose={handleClose} classes={classes}>
					Edit Workspace
				</DialogTitle>
				<DialogContent dividers>
					<Grid
						container
						display="flex"
						justify="center"
						alignItems="center"
						direction="row"
						style={{ width: '480px' }}
					>
						<Grid item xs={5} style={{ paddingLeft: '20px' }}>
							<img src={src} alt={'file uri not found'} className={classes.forImage} />
						</Grid>
						<Grid item xs={6}>
							<Grid
								container
								display="flex"
								justify="space-between"
								alignItems="center"
								direction="row"
								spacing={2}
								style={{ color: '#575757' }}
							>
								<Grid item xs={12}>
									<h4 style={{ marginBottom: 0 }}>Display Name</h4>
									<TextField
										margin="dense"
										variant="outlined"
										value={workspaceTitle}
										placeholder=""
										fullWidth
										className={`${classes.dateRoot} ${classes.inputFieldDate}`}
										onChange={e => setWorkspaceTitle(e.target.value)}
										InputLabelProps={{
											shrink: true,
										}}
										InputProps={{
											classes: {
												root: classes.dateRoot,
												focused: classes.focused,
												notchedOutline: classes.notchedOutline,
												light: classes.light,
											},
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<input
										accept="image/*"
										style={{ display: 'none' }}
										id="workspace-image"
										type="file"
										name="profileimage"
										onChange={e => handleFileInput(e)}
									/>
									<label htmlFor="workspace-image">
										<Button variant="outlined" component="span" className={classes.button}>
											Upload an image
										</Button>
									</label>
									<Button fullWidth style={{ textTransform: 'capitalize' }} onClick={handleRemoveImage}>
										Remove Image
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} variant="outlined" className={classes.cancelButton}>
						Cancel
					</Button>
					<Button
						variant="contained"
						component="span"
						style={{ backgroundColor: '#00abed', color: 'white' }}
						onClick={saveSettings}
					>
						Save changes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
