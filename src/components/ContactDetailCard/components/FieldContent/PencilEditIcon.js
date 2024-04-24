import React, { useState, useEffect } from "react";
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

function PencilEditIcon({
    onClick,
    anchorEl,
    setAnchorEl,
    content,
    handleUpdating,
    isCopy = false,
    editContent,
    setEditContent
}) {
    const classes = useStyles();
    const [copied, setCopied] = useState(false); // Add new state for updating copyicon tooltip value

    
    return (
        <React.Fragment>
            <EditionPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
                <Grid container spacing={0} style={{ width: "200px" }}>
                    <Grid className={classes.buttonsRow} item xs={12}>
                        <Button
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

                    {content.map((textF, i) => {
                        return(
                            <Grid key={i} item xs={12} style={{ marginBottom: "8px" }}>
                                {textF}
                            </Grid>
                        )
                    })}
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
        </React.Fragment>
    );
}

export default PencilEditIcon