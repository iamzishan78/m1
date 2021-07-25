import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import QuestionIcon from "@material-ui/icons/Help";
import XIcon from "@material-ui/icons/HighlightOff";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
    iconContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    tex1: {
        colorPrimary: "white",
    },
}));

export default function StatusCard(props) {
    let classes = useStyles();
    const { status, label } = props;

    const StatusIcon = () => {
        if (status.toUpperCase() === "ACTIVE") {
            return <CheckCircleIcon fontSize="large" />;
        } else if (status.toUpperCase() === "UNKNOWN") {
            return <QuestionIcon fontSize="large" />;
        } else {
            return <XIcon fontSize="large" />;
        }
    };

    return (
        <div className={classes.iconContainer}>
            <StatusIcon />

            <Typography
                //classes={classes.text1}
                align="center"
                variant="subtitle2"
            >
                {label} Status
      </Typography>
            <Typography
                align="center"
                //className={classes.text2}
                variant="caption"
            >
                {status ? status.toUpperCase() : "--"}
            </Typography>
        </div>
    );
}
