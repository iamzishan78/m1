import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { copy } from "utils/helper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import WellIcon from "../../Shared/svgIcons/well";
import PersonIcon from '@material-ui/icons/Person';
import GavelIcon from '@material-ui/icons/Gavel';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import CommentComponent from "components/Shared/CommentComponent";
import ParcelTableInfo from './ParcelTableInfo'
import SummaryTable from "components/ShapeDetailCard/Common/SummaryTable";
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { SHAPE_SUMMARY_DETAILS } from "graphQL/useQueryShapeSummaryDetail";
import { SHAPEWELLSCOUNT } from "graphQL/useQueryShapeWellsCount";
import { addTrailingZeros, getPolygonString } from "../../Shared/functions";
import { getParcelOriginalProperties } from '../utils/GetParcelOriginalProps'
import QtrQtrSelectorNew from "../../ShapeDetailCard/Common/QtrQtrSelectorNew";
import MetaField from "components/Table/helpers/MetaField";
import { AppContext } from "AppContext";
import parcelDefaultData from "./parcelDefaultData";

const useStyles = makeStyles((theme) => ({
    summaryCard: {
        backgroundColor: 'white', paddingLeft: "10px",
        paddingRight: "10px", paddingTop: '8px',
        paddingBottom: '40px'
    },
    summaryDetailCard: {
        paddingLeft: '18px', paddingTop: '8px'
    },
    summaryValue: {
        display: "inline-flex",
        bottom: "5px",
        position: "relative",
        marginRight: "5px",
        fontWeight: "bold",
        color: '#848484'
    },
    descriptionInput: {
        width: '100%',
        '& .MuiTextField-root': {
            backgroundColor: '#fffcdc'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        }
    },
    icon: {
        color: "#757575",
        fontSize: "26px"
    },
    tags: {
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        }
    },

    ///////////////////////
    grid: {
        width: "auto",
    },
    gridItem: {
        flexGrow: 1,
        display: "flex",
        height: "100%",
    },
    gridPacelDetails: {
        flexGrow: 1,
        display: "flex",
        height: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,

    },
    gridWidthScroll: {
        maxHeight: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        // overflow: "auto",

        "& .MuiTabs-indicator": {
            // marginLeft: "14px !important",
            bottom: '10px !important'
        },
        "& .MuiTab-root": {
            padding: "15px 12px !important"
        },
        "& .MuiAppBar-root": {
            height: "60px"
        },

        "&::-webkit-scrollbar": {
            height: "0.4em",
            width: "0.4em"
        },
        "&::-webkit-scrollbar-track": {
            "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#929292",
            borderRadius: 5,
        },
    },
    calcSummary: {
        width: '100%'
    },
    content: {
        backgroundColor: "#fff",
        padding: "16px",
    },
    borderRight: {
        borderRight: "1px solid #eaeaea",
        backgroundColor: "#fff",
        padding: "15px",
    },
    foodText: {
        position: "absolute",
        bottom: "20px",
        // zIndex: "51",
        right: "0px",
        fontSize: "10px",
        color: "#6e6e6e",
        margin: "0 !important",
        textAlign: "right",
        height: "0",
        paddingRight: "10px",
        "& span": {
            fontWeight: "bold",
        },
    },
    subContent: {
        "& div": {
            "&>.MuiPaper-root": {
                "&>:nth-child(3)": {
                    height: "calc(100vh - 53vh ) !important",
                    "& .MuiTableCell-paddingCheckbox": {
                        position: 'unset',
                    },
                },
            },
        },
    },
    subContent2: {
        "& div": {
            "&>.MuiPaper-root": {
                "&>:nth-child(3)": {
                    height: "calc(100vh - 35vh ) !important",
                    "& .MuiTableCell-paddingCheckbox": {
                        position: 'unset',
                    },
                },
            },
        },
    },
    tapsLabelsButtonsSelected: {
        boxShadow: "none",
        color: "#fff",
        backgroundColor: theme.palette.secondary.main,
        "&:hover": { color: "#757575", boxShadow: "none !important" },
    },
    tapsLabelsButtons: {
        boxShadow: "none",
        backgroundColor: "#fff",
        color: "#757575",
        "&:hover": { boxShadow: "none !important" },
    },
    documentHeader: {
        display: "flex",
        "& span": {
            marginTop: "2px",
            marginLeft: "5px"

        }
    },
    parcelDocument: {
        "& .MuiTableRow-root": {
            "&>:nth-child(2) ": {
                "& .fileName": {
                    width: "375px !important"
                }
            }
        }
    },

    search: {
        position: 'relative',

        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            backgroundColor: theme.palette.common.white,
            // opacity: 0.15,
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        // pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        cursor: 'pointer',
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: props => props.search.length > 0 ? '15ch' : '0.9px',
            '&:focus': {
                backgroundColor: theme.palette.common.white,
                opacity: 0.75,
                width: '15ch'
            },
        },
    },
    addDataButton: {
        backgroundColor: 'white',
        color: 'black',
        textTransform: "capitalize",
        '&:hover': {
            backgroundColor: theme.palette.common.white,
            opacity: 0.15,
        }
    },
    paddingLeft: {
        paddingRight: "20px"
    }
}));

export default function ParcelSummary(props) {
    const user = useSelector(({ app }) => app.user);

    const [search, setSearch] = useState('');
    const [parcelProperties, setProperties] = useState(props.properties);
    const [tableDataState, setTableDataState] = useState({});
    const [stateApp, setStateApp] = useContext(AppContext);

    const classes = useStyles({ search });

    // get shape wells
    const [getShapeWellsCount, { data: dataShapeWellsCount }] = useLazyQuery(SHAPEWELLSCOUNT, { fetchPolicy: "cache-and-network", skip: true });
    const [getShapeSummaryDetails, { data: dataShapeSummaryDetails }] = useLazyQuery(SHAPE_SUMMARY_DETAILS);
    const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

    useEffect(() => {
        getMetaData({
            variables: {
                user: user?.mongoId,
                category: "Parcel",
            },
        });
    }, [getMetaData, user]);

    useEffect(() => {
        getShapeSummaryDetails({ variables: { shapeId: props.id, shapeType: 'Parcel' } });
        // props.setProperties({ ...props.properties, ...getParcelOriginalProperties(props.properties) });
        setProperties({ ...props.properties, ...getParcelOriginalProperties(props.properties) })
    }, [props, getShapeSummaryDetails]);

    useEffect(() => {
        if (props.customLayer) {
            getShapeWellsCount({
                variables: {
                    polygon: getPolygonString(props?.customLayer?.shape)
                },
            });
        }

    }, [props.customLayer]);

    const tableData = React.useMemo(() => {
        props.properties.execNetAcres = props.properties?.execNetAcres ? addTrailingZeros(parseFloat(props.properties.execNetAcres).toFixed(8)) : 0;
        props.properties.nonExecNetAcres = props.properties?.nonExecNetAcres ? addTrailingZeros(parseFloat(props.properties.nonExecNetAcres).toFixed(8)) : 0;
        return (props.properties?.state === "TX" || props.properties?.originalProperties?.State === "TX") ?
            parcelDefaultData.filter((data) => data.showStateTX !== false) :
            parcelDefaultData.filter((data) => data.showStateTX !== true)
    }, [props.properties]);

    // const addCustomData = () => {
    //     if (!props.properties.custom_data_arr) {
    //         props.properties.custom_data_arr = []
    //     }
    //     props.properties.custom_data_arr.push({
    //         id: uuid(),
    //         label: '',
    //         type: 'text',
    //         key: '',
    //         value: '',
    //         isCustom: true
    //     });
    //     props.setProperties({ ...props.properties, custom_data_arr: [...props.properties.custom_data_arr] })
    // }

    const addCustomData = () => {
        setStateApp((stateApp) => ({
            ...stateApp,
            showFieldModal: true,
        }));
    };

    const addAgreementCustomData = (data) => {
        const customData = copy(props.properties.custom_data) ?? {};
        data.forEach((d) => {
            if (!customData[d.name]) customData[d.name] = null;
        });
        props.updateProperties(null, "custom_data", customData);
    };

    return (
        <>
            <Grid container direction="row" className={classes.summaryCard}>
                <Grid item md={6} sm={12} className={classes.paddingLeft}>
                    <Grid container spacing={1} direction="column" >
                        <Grid item>
                            <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ justifyContent: "space-between" }}>
                                <Grid item>
                                    <Grid container spacing={2} className={classes.summaryDetailCard}>
                                        <Grid item>
                                            <div className={classes.summaryValue}> {dataShapeWellsCount?.shapeWellsCount || 0} </div>
                                            <WellIcon className={classes.icon} color={"#757575"} opacity="1.0" small />
                                        </Grid>
                                        <Grid item>
                                            <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.shapeOwners || 0} </div>
                                            <PersonIcon className={classes.icon} opacity="1.0" small />
                                        </Grid>
                                        <Grid item>
                                            <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.documents || 0} </div>
                                            <InsertDriveFileOutlinedIcon className={classes.icon} opacity="1.0" small />
                                        </Grid>
                                        <Grid item>
                                            <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.runsheets || 0} </div>
                                            <GavelIcon className={classes.icon} opacity="1.0" small />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <div className={classes.search}>
                                        <div className={classes.searchIcon}>
                                            <SearchIcon />
                                        </div>
                                        <InputBase
                                            placeholder="Search…"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            classes={{
                                                root: classes.inputRoot,
                                                input: classes.inputInput,
                                            }}
                                            inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {/* <ParcelTableInfo properties={parcelProperties} updateProperties={props.updateProperties}
                        updateCustomProperties={props.updateCustomProperties} search={search} /> */}
                            <SummaryTable
                                tableData={tableData}
                                properties={props.properties}
                                updateProperties={props.updateProperties}
                                updateCustomProperties={props.updateCustomProperties}
                                search={search}
                                metaData={metaDataRes}
                                updating={props.updating}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={addCustomData} color="primary" component="span" className={classes.addDataButton} startIcon={<AddIcon />}>
                                Add Data
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} sm={12}>
                    <Grid container spacing={2} direction="row">
                        <Grid item >
                            <QtrQtrSelectorNew layerData={props.customLayer} />
                        </Grid>
                        <Grid item className={classes.descriptionInput}>
                            <TextField
                                id="outlined-multiline-static"
                                placeholder="Description"
                                defaultValue={parcelProperties.legalDescription}
                                value={parcelProperties.legalDescription}
                                multiline
                                fullWidth
                                rows={6}
                                variant="outlined"
                                onChange={(e) => {
                                    setProperties({ ...parcelProperties, legalDescription: e.target.value });
                                }}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13 && !e.shiftKey)
                                        props.updateProperties(e, 'legalDescription', parcelProperties.legalDescription);
                                }}
                                onFocus={() => { setTableDataState({ legalDescription: true }) }}
                                InputProps={{
                                    endAdornment: (tableDataState.legalDescription === true &&
                                        <p className={classes.foodText}>
                                            <span>Return</span> to save
                                        </p>)
                                }}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <CommentComponent targetLabel={'parcel'} targetSourceId={props.id} showCommentType />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {stateApp.showFieldModal && (
                <MetaField
                    customDataPrefix="shapeJson.properties.custom_data"
                    customDataPostfix=".keyword"
                    columns={[]}
                    category="Parcel"
                    updateColumnSorting={addAgreementCustomData}
                />
            )}
        </>
    )
}
