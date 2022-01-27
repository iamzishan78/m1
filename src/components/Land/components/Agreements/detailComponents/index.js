import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
    LocalAtm as CurrencyIcon,
    InfoOutlined as InfoOutlinedIcon,
    Delete as DeleteIcon,
    MoreHoriz as MoreHorizIcon,
} from "@material-ui/icons";
import Tags from "components/Shared/Tagger";
import { useLocation } from "react-router";
import { useLazyQuery } from "@apollo/client";
import { GETCHECK } from "graphQL/useQueryCheck";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import { AppContext } from "AppContext";

// Components
import NavHeader from "components/Land/components/Common/NavHeader";

import { setRevenueKey } from "actions";

const useStyles = makeStyles((theme) => ({
    detailHeader: {
        backgroundColor: "#fff",
        padding: "20px 27px 0px 45px",
        marginTop: "7px",
    },
    title: {
        display: "flex",
        alignItems: "center",
    },
    titleText: {
        marginLeft: 16,
    },
    highlighter: {
        background: "#263451",
        padding: "5px 16px",
        borderRadius: 16,
        width: "max-content",
        transform: "translateX(5px) translateY(11px)",
        height: "32px",
    },
    highlight: {
        color: "#ffffff",
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    icon: {
        height: 80,
        width: 80,
        backgroundColor: "#d5f4ff",
        borderRadius: 12,
        "& svg": {
            fontSize: "3.1875rem",
            fill: "#263451",
        },
    },
    tabsHeader: {
        background: "#ffffff",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    tabsSection: {},
    headerSection: {
        padding: "20px 30px",
        background: "#ffffff",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    summarySection: {
        padding: 20,
        background: "#ffffff",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    tagsContainer: {
        display: "flex",
        flexDirection: "row",
    },
    tags: {
        "& fieldset": {
            border: "none",
        },
    },
    tabsSectionDetails: {
        maxHeight: "calc(100vh - 280px)",
        overflow: "overlay",
        backgroundColor: "#f3f3f3",
    },
    actionsContainer: {
        display: "flex",
        direction: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    metaActions: ({ collapse }) => ({
        marginTop: "2px",
        "& button": {
            backgroundColor: !collapse ? "#eceded" : "#fff",
            color: "grey",
            fontWeight: "bold",
            textTransform: "capitalize",
            padding: "6px 12px",
            "&:hover": {
                backgroundColor: !collapse ? "#eceded" : "#fff",
            },
        },
    }),
    menu: {
        "& .MuiListItem-gutters": {
            paddingLeft: "10px !important",
            paddingRight: "10px !important",
        },
        "& .MuiListItem-root": {
            "& .MuiListItemIcon-root": {
                minWidth: "25px",
                "& .MuiSvgIcon-root": {
                    fill: "red !important",
                },
            },
        },
    },
    tabsDetailContainer: ({ collapse }) => ({
        padding: 20,
        maxWidth: !collapse ? "calc(100% - 380px)" : "100%",
    }),
    menuIcon: {
        background: "transparent",
        align: "center",
        "& svg": {
            fill: "#808080 !important",
        },
    },
}));

const StyledTabs = withStyles({
    root: {
        textTransform: "capitalize",
    },
    indicator: {
        backgroundColor: "#12abe0",
    },
})(Tabs);

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: "uppercase",
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        "&:hover": {
            color: "black",
            opacity: 1,
        },
        "&$selected": {
            color: "black",
            fontWeight: theme.typography.fontWeightMedium,
        },
        "&:focus": {
            color: "black",
        },
    },
    selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default function DetailComponents(props) {
    const dispatch = useDispatch();
    const { activeAgreement } = useSelector(({ Land }) => Land.agreement);

    const [tab, setTab] = useState(0);
    const [checkId, setCheckId] = useState(null);
    const selectedTabRef = useRef(null);
    const location = useLocation();
    const [isButtonScroll, setButtonScroll] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const { search } = location;
    const [users, setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState();

    const classes = useStyles({ ...props, collapse });
    // queries
    const [getCheck, { data: getCheckResult }] = useLazyQuery(GETCHECK, {
        fetchPolicy: "no-cache",
    });
    const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
        fetchPolicy: "no-cache",
    });

    const checksFlatData = getCheckResult?.getCheck?.check;

    //   useEffect(() => {
    //     if (getCheckResult?.getCheck?.check)
    //       dispatch(setRevenueKey("statements", { ...statements, activeStatement: getCheckResult?.getCheck?.check }));
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [getCheckResult, dispatch]);

    useEffect(() => {
        if (selectedTabRef?.current) {
            selectedTabRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start",
            });
        }
    }, [tab]);

    useEffect(() => {
        if (search !== "") {
            const aggrementId = search.replace("?id=", "");
            if (aggrementId) {
                // setCheckId(checkId);
                // getCheck({
                //   variables: { id: checkId },
                // });
                getAllMongoUsers();
            }
        }
    }, [search]);

    useEffect(() => {
        if (userLists && userLists.allMongoUsers) {
            setUsers(
                userLists.allMongoUsers.map((user) => ({
                    value: user._id,
                    text: user.name,
                    email: user.email,
                }))
            );
        }
    }, [userLists]);

    const handleScroll = (e) => {
        if (!isButtonScroll) {
            const { scrollTop } = e.target;
            if (scrollTop <= 270 && tab !== 0) setTab(0);
            else if (scrollTop > 270 && scrollTop <= 470 && tab !== 1) setTab(1);
            else if (scrollTop > 470 && tab !== 2) setTab(2);
        }
        handleEndScroll();
    };

    const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);

    return (
        <NavHeader title={`${activeAgreement?.agreementNumber} - ${activeAgreement?.agreementName}`}>
            {/**
       * Detail title section
       */}
            <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
                <div className="flex column alignStart justifyStart w-100">
                    <div className={classes.title}>
                        <IconButton className={classes.icon}>
                            <CurrencyIcon />
                        </IconButton>
                        <div className={classes.titleText}>
                            {checksFlatData && (
                                <Typography
                                    style={{ fontWeight: "bold", fontSize: "large", marginLeft: 8 }}
                                >{`${checksFlatData.checkNumber} - ${checksFlatData.payor["name"]}`}</Typography>
                            )}
                            <div className={classes.tagsContainer}>
                                <div className={classes.highlighter}>
                                    <Typography className={classes.highlight} variant="highlight">
                                        Revenue Check
                                    </Typography>
                                </div>
                                <div className={classes.tags}>
                                    <Tags width="100%" targetSourceId={checkId} targetLabel="check" publicLeftBottom onlyTags />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={classes.actionsContainer}>
                        <div className={classes.tabsHeader}>
                            <StyledTabs
                                value={tab}
                                onChange={(event, tab) => {
                                    setButtonScroll(true);
                                    setTab(tab);
                                }}
                                aria-label="ant example"
                            >
                                <StyledTab label="Header" />
                                <StyledTab label="Summary" />
                                <StyledTab label="Check Details" />
                            </StyledTabs>
                        </div>
                        <div className={classes.metaActions}>
                            <Button startIcon={<InfoOutlinedIcon />} onClick={() => setCollapse(!collapse)}>
                                Metadata
                            </Button>
                            <IconButton size="small" component="span" className={classes.menuIcon} onClick={handleMenuClick}>
                                <MoreHorizIcon size="medium" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>

            {/**
       * Menu for meta data
       */}
            <Menu
                id="revStatementMenu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                className={classes.menu}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <DeleteIcon size="medium" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </NavHeader>
    );
}
