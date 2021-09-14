import React from "react";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useStyles from 'components/ContactDetailCard/components/FieldContent/style'

function CopyPurchaseInfo({
    contactId,
    content,
}) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Tooltip title={"Copy Purchased data"} placement="top">
                <IconButton
                    size="small"
                    className={classes.mergeIcon}
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                >
                    <MoreVertIcon id="mergeTypeIcon" className={classes.pencilIcon} />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}

export default CopyPurchaseInfo