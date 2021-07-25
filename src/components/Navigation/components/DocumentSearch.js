import React, { useContext, useState } from "react";
import {
  InputAdornment,
  TextField,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(2),
    marginLeft: 5,
    width: "34%",
    transition: "width 0.5s",
    [theme.breakpoints.up("sm")]: {
      marginLeft: 5,
    },
  },

  toggleBtn: {
    borderRadius: 5,
    color: "#FFFFFF",
    transition: "200ms all",
    "&:hover": {
      backgroundColor: "#1CB6DA44",
    },
  },

  activeBtn: {
    color: "#1CB6DA",
  },

  contactSearchField: {
    color: "#fff",

    "& .MuiInputBase-root": {
      paddingRight: "6px !important",
      paddingLeft: "6px !important",
    },

    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
      paddingLeft: "7px !important",
      "&::placeholder": {
        color: "##ffffffc9",
        textDecoration: "bold",
      },
      "&:-ms-input-placeholder": {
        color: "##ffffffc9",
      },
      "&::-ms-input-placeholder": {
        color: "##ffffffc9",
      },
    },
  },
  customWidth: {
    "& div": {
      width: "350px",
    },
  },
  gridOnIcon: {
    color: "#fff",
    "&:hover ": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
}));

const DocumentSearch = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [search, setSearch] = useState("");

  return (
    <div className={classes.search}>
      <TextField
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setTimeout(() => {
            setStateApp((stateApp) => ({
              ...stateApp,
              documentSearchQuery: e.target.value
            }));
          }, 500);
        }}
        style={{
          margin: 0,
          width: "100%",
        }}
        className={classes.contactSearchField}
        margin="dense"
        variant="outlined"
        placeholder="Search for documents by name"
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <IconButton size="small">
                <SearchIcon
                  htmlColor="#fff"
                  aria-controls="customized-menu"
                  aria-haspopup="true"
                //onClick={(e) => setAnchorEl(e.currentTarget)}
                />
                {/* <div className="check">
                  <Menu
                    elevation={0}
                    className={classes.customWidth}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem
                      style={{ padding: "0px" }}
                      onClick={() => setAnchorEl(null)}
                    >
                      <Typography
                        style={{
                          padding: "9px",
                          color: "rgb(24, 170, 221)",
                          cursor: "pointer",
                        }}
                        variant="subtitle2"
                      >
                        All Documents
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      style={{ padding: "0px" }}
                      onClick={() => setAnchorEl(null)}
                    >
                      <Typography
                        style={{
                          padding: "6px",
                          paddingLeft: "9px",
                          backgroundColor: "#f2f2f2",
                          width: "100%",
                          borderTop: "1px solid #d1cfcf",
                        }}
                        variant="subtitle2"
                      >
                        Agreements
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      style={{ padding: "0px" }}
                      onClick={() => setAnchorEl(null)}
                    >
                      <Typography
                        style={{ padding: "9px", cursor: "pointer" }}
                        variant="subtitle2"
                      >
                        Shapefiles
                      </Typography>
                    </MenuItem>
                  </Menu>
                </div> */}
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <>
              <ButtonGroup variant="text">
                <Tooltip title="Clear">
                  <IconButton
                    size="small"
                    htmlColor="#fff"
                    className={`${classes.toggleBtn} ${stateApp.activityDisplayType === "table" &&
                      classes.activeBtn
                      }`}
                    onClick={() => {
                      setSearch("");
                      setStateApp((stateApp) => ({
                        ...stateApp,
                        documentSearchQuery: "",
                      }));
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="Add Document">
                  <Button
                    className={classes.gridOnIcon}
                    onClick={() => {
                      setStateApp({ ...stateApp, DocumentDrawer: true, selectedDocument:{} });
                    }}
                  >
                    <PostAddOutlinedIcon />
                  </Button>
                </Tooltip> */}
              </ButtonGroup>
            </>
          ),
        }}
      />
    </div>
  );
};

export default DocumentSearch;
