import React from "react";
import { history } from "store";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import GlobalStyles from "GlobalStyles";

const useStyles = makeStyles(() => ({
    link: {
        color: GlobalStyles.colors.lightBlue,
        cursor: "pointer",
        maxWidth: "300px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        p: 2,
        textDecoration: "none !important",
        "&:hover": {
            textDecoration: "underline",
            fontWeight: GlobalStyles.font.boldFontWeight,
        },
    },
}));

const ColumnWithLink = ({ value, link, ...rest }) => {
    const classes = useStyles();
    return (
        <Box
            sx={{
                color: GlobalStyles.colors.lightBlue,
                cursor: "pointer",
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                p: 2,
                "&:hover": {
                    textDecoration: "underline",
                    fontWeight: GlobalStyles.font.boldFontWeight,
                },
            }}
            {...rest}
            onClick={
                rest.onClick
                    ? rest.onClick
                    : (e) => {
                        e.stopPropagation();
                        history.push(link);
                    }
            }
        >
            <RouterLink to={link || "#"} className={classes.link}>
                {value}
            </RouterLink>
        </Box>
    );
};

export default ColumnWithLink;
