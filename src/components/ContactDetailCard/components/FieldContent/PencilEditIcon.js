import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import EditionPopover from "../EditionPopover";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";
import Button from "@material-ui/core/Button";
import useStyles from 'components/ContactDetailCard/components/FieldContent/style'
import CopyIcon from "components/Shared/svgIcons/CopyIcon";
import TextSmsIcon from "components/Shared/svgIcons/textsms";
import VoiceMailIcon from "components/Shared/svgIcons/voicemail";
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { globalStateController } from "hookstate/globalStateController";


function PencilEditIcon({
    onClick,
    anchorEl,
    setAnchorEl,
    content,
    handleUpdating,
    isCopy = false,
    editContent,
    setEditContent,
    row,
    handleQuickActionActivity
}) {
    const classes = useStyles();
    const [copied, setCopied] = useState(false); // Add new state for updating copy icon tooltip value
    const { globalState } = globalStateController.useState(['contactData'], 'globalState');


     // Destructure the first key-value pair from `editContent`
     const [editFieldKey, editFieldValue] = Object.entries(editContent || {})?.[0] || [];
     
     // Show voicemail and text SMS icons if the field is a non-empty phone field
     const isPhoneField = editFieldKey && row?.isPhoneNumber && editFieldValue;
    return (
        <React.Fragment>
            <EditionPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
                <Grid container spacing={0} style={{ width: "200px" }}>
                    <Grid className={classes.buttonsRow} item xs={12}>
                        <Button
                            data-testid='checkIcon'
                            size="small"
                            variant="outlined"
                            className={classes.popoverButton}
                            startIcon={<CheckSharpIcon />}
                            onClick={() => {
                                handleUpdating();
                            }}
                        >
                            {" "}
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            className={classes.popoverButton}
                            startIcon={<ClearSharpIcon />}
                            onClick={() => {
                                setEditContent({ ...editContent}) // reset content to default value on click of close icon 
                                setAnchorEl(null);
                            }}
                        >
                            {" "}
                        </Button>
                    </Grid>

                    {content.map((textF, i) => (
                        <Grid key={i} item xs={12} style={{ marginBottom: "8px" }}>
                            {textF}
                        </Grid>)
                    )}
                </Grid>
            </EditionPopover>
            {isCopy && (
                <Tooltip title={copied ? "Copied" : "Copy"}  placement="top">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            setCopied(true);
                            onClick(e, true);
                            setTimeout(() => { // Show copied to user after copying the value
                                setCopied(false);
                            }, 1500);
                        }}
                    >
                        <CopyIcon id="copyIcon" />
                    </IconButton>
                </Tooltip>
            )}

            <Tooltip title={"Edit"} placement="top">
                <IconButton
                    size="small"
                    onClick={(e) => {
                        onClick(e);
                    }}
                >
                    <CreateTwoToneIcon
                        id="contPencilIcon"
                        className={classes.pencilIcon}
                    />
                </IconButton>
            </Tooltip>
            { /* Show voicemail and testSMS icons if the field is a non-empty phone field*/}
            { isPhoneField && ( <>
            <Tooltip title={"Voice Mail"} placement="top">
                <IconButton
                    size="small"
                    onClick={() => handleQuickActionActivity({phoneNumber: editFieldValue, type: 'call'})}
                >
                    <VoiceMailIcon
                        id="voiceMailIcon"
                        className={classes.pencilIcon}
                    />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Text SMS"} placement="top">
                <IconButton
                    size="small"
                    onClick={() => handleQuickActionActivity({phoneNumber: editFieldValue, type: 'text_message'})}
                >
                    <TextSmsIcon
                        id="textSmsIcon"
                        className={classes.pencilIcon}
                    />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Call"} placement="top">
                <IconButton size="small"
                href={globalState?.contactData?.dialpadId ? '' : `tel: ${editFieldValue}`}
                className={classes.emailAdornment}
                onClick={() => {
                    globalState?.contactData?.dialpadId &&
                        handleQuickActionActivity({
                            phoneNumber: editFieldValue,
                            type: 'dialpad',
                        });
                }}
                 >
					<AddIcCallIcon htmlColor="#757575" id={'dialpad'}/>
				</IconButton>
            </Tooltip>
            </> )}
        </React.Fragment>
    );
}

export default PencilEditIcon