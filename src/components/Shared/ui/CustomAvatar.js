import React, { Fragment, useContext } from "react";
import { get } from "lodash";

import { makeStyles } from "@material-ui/core/styles";

import { getRandomColor } from "components/Shared/functions/ui.js";
import { TransactContext } from "components/Transact/TransactContext";

const useStyles = makeStyles((theme) => ({
    customAvatar: {
        borderRadius: "50%",
        backgroundColor: "red",
        padding: "3px",
        color: "#fff",
        width: "25px",
        height: "25px",
        fontSize: "0.7rem",
        textAlign: "center",
    },
    customAvatarImg: {
        borderRadius: "50%",
        color: "#fff",
        width: "25px",
        height: "25px",
        fontSize: "0.7rem",
        textAlign: "center",
    },
}));

const CustomAvatar = React.memo(({ text = "", email = "", diglog }) => {
    const classes = useStyles();
    const [stateTransact] = useContext(TransactContext);

    const getInitials = (name) => {
        if (!name || name.length === 0) return "--";
        const split = name ? name.split(" ") : [""];
        let initials = "";
        split.forEach((s) => {
            if (s[0]) initials += s[0];
            if (initials.length === 2) return;
        });
        return initials.toUpperCase();
    };

    if (get(stateTransact[email], "profileImage")) {
        console.log('email', stateTransact[email]);
        return <img className={classes.customAvatarImg} src={stateTransact[email].profileImage} alt="owner img" />;
    } else {
        console.log('text', text);
        return (
            <span
                className={diglog ? "" : classes.customAvatar}
                style={{
                    backgroundColor: diglog ? "" : getRandomColor(text),
                }}
            >
                {getInitials(text)}
            </span>
        );
    }
});

export default CustomAvatar;
