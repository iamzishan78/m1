import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
// import TodayOutlinedIcon from '@material-ui/icons/TodayOutlined';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { Box, Button, Typography } from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import CommentComponent from "components/Shared/CommentComponent";
import SummaryTable from 'components/ShapeDetailCard/Common/SummaryTable'
import agreementDefaultData from 'components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData'
import { SHAPE_SUMMARY_DETAILS } from "graphQL/useQueryShapeSummaryDetail";
import { summaryStyles } from "components/ShapeDetailCard/style";


export default function AgreementSummary(props) {
    const [search, setSearch] = useState('');
    const [unitProperties, setProperties] = useState(props.properties);
    const [tableDataState, setTableDataState] = useState({});

    const classes = summaryStyles({ search });

    const [getShapeSummaryDetails, { data: dataShapeSummaryDetails }] = useLazyQuery(SHAPE_SUMMARY_DETAILS);

    useEffect(() => {
        getShapeSummaryDetails({ variables: { shapeId: props.id, shapeType: 'Unit' } })
    }, [props.id])

    const addCustomData = () => {
        if (!props.properties.custom_data_arr) {
            props.properties.custom_data_arr = []
        }
        props.properties.custom_data_arr.push({
            id: uuid(),
            label: '',
            type: 'text',
            key: '',
            value: '',
            isCustom: true
        })
        props.setProperties({ ...props.properties, custom_data_arr: [...props.properties.custom_data_arr] })
    }

    const hasCustomProvision = props.provisions.find((provision) => !provision.templateRef)

    return <Grid container direction="row" className={classes.summaryCard}>
        <Grid item md={7} sm={12} className={classes.paddingLeft}>
            <Grid container spacing={1} direction="column" >
                <Grid item>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ justifyContent: "space-between" }}>
                        <Grid item>
                            <Grid container spacing={2} className={classes.summaryDetailCard}>
                                <Grid item>
                                    <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.shapeWells || 0} </div>
                                    <WellIcon className={classes.icon} color={"#757575"} opacity="1.0" small />
                                </Grid>
                                <Grid item>
                                    <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.shapeOwners || 0} </div>
                                    <TractIcon className={classes.icon} opacity="1.0" small />
                                </Grid>
                                <Grid item>
                                    <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.documents || 0} </div>
                                    <InsertDriveFileOutlinedIcon className={classes.icon} opacity="1.0" small />
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
                    <SummaryTable tableData={agreementDefaultData} properties={props.properties} updateProperties={props.updateProperties}
                        updateCustomProperties={props.updateCustomProperties} search={search} />
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={addCustomData} color="primary" className={classes.addDataButton} startIcon={<AddIcon />}>
                        Add Data
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        <Grid item md={5} sm={12}>
            <Grid container spacing={2} direction="row" >
                <Grid item md={12} className={classes.provisionCard}>
                    <Typography className='heading'>Provisions</Typography>
                    <Grid container direction="row" >
                        {
                            props.standardProvisions.map((provision) => {
                                const found = props.provisions.find((p) => p.type === provision.type)
                                return (
                                    <Grid item md={6} className='provisionRow'>
                                        <Box display='inline-flex' className={found ? '' : 'uncheck'}>
                                            {
                                                found ? <CheckIcon fontSize='medium' style={{ color: '#00b050' }} /> : <CloseIcon />
                                            }
                                            <Typography className='text'>{provision.type}</Typography>
                                        </Box>
                                    </Grid>
                                )
                            }
                            )
                        }
                        <Grid item md={6} className='provisionRow'>
                            <Box display='inline-flex' className={hasCustomProvision ? '' : 'uncheck'}>
                                {
                                    hasCustomProvision ? <CheckIcon fontSize='medium' style={{ color: '#00b050' }} /> : <CloseIcon />
                                }
                                <Typography className='text'>Other</Typography>
                            </Box>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item className={classes.descriptionInput}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Description"
                        defaultValue={unitProperties.description}
                        value={unitProperties.description}
                        multiline
                        fullWidth
                        rows={17}
                        variant="outlined"
                        onChange={(e) => {
                            setProperties({ ...unitProperties, description: e.target.value });
                        }}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13)
                                props.updateProperties(e, 'description', unitProperties.description);
                        }}
                        onFocus={() => { setTableDataState({ description: true }) }}
                        InputProps={{
                            endAdornment: (tableDataState.description === true &&
                                <p className={classes.foodText}>
                                    <span>Return</span> to save
                                </p>)
                        }}
                    />
                </Grid>
                <Grid item md={12}>
                    <CommentComponent targetLabel={'unit'} targetSourceId={props.id} />
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}
