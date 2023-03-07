import React from "react";
import { history } from "store";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import GlobalStyles from "GlobalStyles";

const useStyles = makeStyles(() => ({
  root: {
    color: `${GlobalStyles.colors.lightBlue} !important`,
    cursor: "pointer",
  },
  link: {
    color: `${GlobalStyles.colors.lightBlue} !important`,
    maxWidth: "300px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    p: 2,
    textDecoration: "none !important",
    "&:hover": {
      textDecoration: "underline !important",
      fontWeight: GlobalStyles.font.boldFontWeight,
    },
  }
}));

const ColumnWithLink = ({ value, link, ...rest }) => {
  const classes = useStyles();
  return (
    <Box
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
      {!rest.disabled ? (
        <div className={classes.root}>
          {link ? (
            <RouterLink to={`${link}/?tenant=${window.sessionStorage.getItem("tenantName")}`} className={classes.link}>
              {value}
            </RouterLink>
          ) : (
            value
          )}
        </div>
      ) : (
        value
      )}
    </Box>
  );
};

export default ColumnWithLink;
