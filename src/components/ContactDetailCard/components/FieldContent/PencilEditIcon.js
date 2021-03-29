import React from "react";
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import EditionPopover from "../EditionPopover";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";
import Button from "@material-ui/core/Button";
import useStyles from 'components/ContactDetailCard/components/FieldContent/style'

function PencilEditIcon({
    onClick,
    anchorEl,
    setAnchorEl,
    content,
    handleUpdating,
}) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <EditionPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
                <Grid container spacing={0} style={{ width: "200px" }}>
                    <Grid className={classes.buttonsRow} item xs={12}>
                        <Button
                            variant="contained"
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
                            variant="contained"
                            size="small"
                            variant="outlined"
                            className={classes.popoverButton}
                            startIcon={<ClearSharpIcon />}
                            onClick={() => {
                                setAnchorEl(null);
                            }}
                        >
                            {" "}
                        </Button>
                    </Grid>

                    {content.map((textF, i) => (
                        <Grid key={i} item xs={12} style={{ marginBottom: "8px" }}>
                            {textF}
                        </Grid>
                    ))}
                </Grid>
            </EditionPopover>
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