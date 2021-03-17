import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import { IconButton, Typography } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import MergeTypeIcon from '@material-ui/icons/MergeType';
import CircularProgress from "@material-ui/core/CircularProgress";
import EditionPopover from "../EditionPopover";
import useStyles from 'components/ContactDetailCard/components/FieldContent/style'
import { GET_CONTACT_MERGE_HISTORY } from "graphQL/useQueryContactMergeHistory";

function MergeHistory({
    contactId,
    content,
}) {
    const classes = useStyles();
    const [edit, setEdit] = useState(null);

    const [getContactMergeHistory, { data, loading }] = useLazyQuery(GET_CONTACT_MERGE_HISTORY, {
        fetchPolicy: "cache-and-network",
    });


    useEffect(() => {
        if (edit) {
            getContactMergeHistory({
                variables: {
                    contactId,
                    fields: content
                },
            });
        }
    }, [edit])
    return (
        <React.Fragment>
            <EditionPopover anchorEl={edit} setAnchorEl={setEdit}>

                <Grid container spacing={0} style={{ width: "200px" }}>
                    {
                        loading ? (
                            <div style={{ height: "40px", width: "40px", zIndex: 100, marginLeft: "90px", marginTop: "8px" }}>
                                <CircularProgress
                                    size={22}
                                    color="secondary"
                                ></CircularProgress>
                            </div>
                        ) : <Grid item xs={12} style={{ marginBottom: "8px" }}>
                                <Typography variant="subtitle2" gutterBottom className={classes.mergeHistoryTitle} >
                                    Merge Values
                            </Typography>

                                {data?.getContactMergeHistory?.data.map((obj) =>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {Object.keys(obj.fields).map((field, i, arr) =>
                                            <span key={obj.fields[field]}>
                                                {obj.fields[field]}{i !== arr.length - 1 ? ', ' : ''}
                                            </span>
                                        )
                                        }
                                        {obj.isPrimary && <span style={{ color: "rgba(23, 170, 221, 1)" }}> (Primary) </span>}
                                    </Typography>
                                )}

                            </Grid>
                    }

                </Grid>
            </EditionPopover>
            <Tooltip title={"Show Merge history"} placement="top">
                <IconButton
                    size="small"
                    className={classes.mergeIcon}
                    onClick={(e) => {
                        e.preventDefault()
                        setEdit(e.currentTarget)
                    }}
                >
                    <MergeTypeIcon
                        id="mergeTypeIcon"
                        className={classes.pencilIcon}
                    />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}

export default MergeHistory