import React, { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { TitleOpinionContext } from "./TitleOpinionContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import useQueryTitleOpinion from "../../graphQL/useQueryTitleOpinion";
import { Container, Grid } from "@material-ui/core";
import GeneralInfoForm from "./components/GeneralInfoForm";
import MapShape from "./components/MapShape";
import TitleOpinionsTaps from "./components/TitleOpinionsTaps";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  containerWrapper: {
    width: "100%",
    maxWidth: "100% ",
    padding: "0"
  },
  maxWidth: {
    width: "100%"
  },
  divSaveButtons: {
    float: "right",
    margin: "5px",
    width: "240px"
  },
  saveButtonsBar: {
    background: "#263451",
    position: "fixed",
    width: "100%",
    zIndex: "500"
  },
  saveButton: {
    background: "#17AADD"
  },
  buttons: {
    marginRight: "10px !important",
    width: "100px",
    color: "#FFFFFF !important",
    "&:hover": {
      backgroundColor: "#1f2b42",
      border: "1px solid rgb(1,17,51)"
    }
  },
  whiteBox: {
    width: "100%",
    padding: "0",
    height: "36px",
    background: "rgba(255, 255, 255, 0)"
  }
}));

export default function TitleOpinion() {
  const [stateApp] = useContext(AppContext);
  const [stateTitleOpinion, setStateTitleOpinion] = useContext(
    TitleOpinionContext
  );
  const {
    MORDefaultSections,
    MORDefaultColumns,
    runsheetDefaultSections,
    runsheetDefaultColumns
  } = stateTitleOpinion;
  const QueryTitleOpinion = useQueryTitleOpinion; /////////

  const generatingANewSectionFromDefaultColumns = defaultColumns => {
    ///////columns///////creating new default columns
    const columns = defaultColumns.map((column, i) => {
      return { key: `id${i}`, name: column, editable: true, resizable: true };
    });

    ///////rows///////creating new default rows
    let row = {};
    columns.map(column => {
      row = { ...row, [column.key]: "" };
    });
    let rows = [row, row, row, row, row];

    ////////section//////creating new default Section
    return {
      name: "",
      columns,
      rows
    };
  };

  const generatigSectionsArrayFromSectionsNamesArrayAndDefaultColumns = (
    sectionsNamesArray,
    defaultColumns
  ) => {
    return sectionsNamesArray.map(sectionName => {
      return {
        ...generatingANewSectionFromDefaultColumns(defaultColumns),
        name: sectionName
      };
    });
  };

  const generatingANewTitleOpinion = loading => {
    setStateTitleOpinion({
      ...stateTitleOpinion,
      TOData: {
        legalDescription: "",
        preparedBy: "",
        certifiedDate: moment().format("MM-DD-YYYY"),
        state: "",
        county: "",
        project: "",
        client: "",
        generalNotes: "",
        MORSections: generatigSectionsArrayFromSectionsNamesArrayAndDefaultColumns(
          MORDefaultSections,
          MORDefaultColumns
        ),
        runsheetSections: generatigSectionsArrayFromSectionsNamesArrayAndDefaultColumns(
          runsheetDefaultSections,
          runsheetDefaultColumns
        ),
        feature: stateApp.featureOrMapShape
      },
      loading:
        loading === undefined
          ? true //////////true
          : loading,
      edited: false
    });
  };

  useEffect(() => {
    if (stateApp.selectedTitleOpinionId) {
      const { data, loading } = QueryTitleOpinion(
        stateApp.selectedTitleOpinionId
      );

      if (data && data.titleOpinion) {
        setStateTitleOpinion({
          ...stateTitleOpinion,
          TOData: data.titleOpinion,
          loading
        });
      } else {
        generatingANewTitleOpinion(loading);
      }
    } else {
      generatingANewTitleOpinion(false);
    }
  }, []);

  /////////////////////////////
  useEffect(() => {
    console.log(
      "selectedTitleOpinion=== " + JSON.stringify(stateTitleOpinion.TOData)
    );
  }, [stateTitleOpinion.TOData]);

  const handleAdd = e => {
    e.preventDefault();

    /////save TOData to the DB //////////////////////////////////////////////////////////////////
    setStateTitleOpinion(stateTitleOpinion => {
      return { ...stateTitleOpinion, edited: false };
    });
  };
  const handleCancel = e => {
    e.preventDefault();

    /////dismiss TOData by refetching this Title opinion from the DB ////////////////////////////
    setStateTitleOpinion(stateTitleOpinion => {
      return { ...stateTitleOpinion, edited: false };
    });
  };

  let classes = useStyles();

  return !stateTitleOpinion.loading ? (
    <div>
      <Container className={classes.containerWrapper}>
        <Grid container className={classes.TOMaxW}>
          {stateTitleOpinion.edited && (
            <Grid item xs={12} container className={classes.maxWidth}>
              <div className={classes.whiteBox} />
              <Grid item xs={12} className={classes.saveButtonsBar}>
                <div>
                  <div className={classes.divSaveButtons}>
                    <Button
                      className={`${classes.saveButton} ${classes.buttons}`}
                      onClick={handleAdd}
                      color="primary"
                    >
                      Save
                    </Button>
                    <Button
                      className={classes.buttons}
                      onClick={handleCancel}
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} container>
            <Grid item xs={6} sm={6} md={6} lg={5}>
              <GeneralInfoForm />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={7}>
              {/* <MapShape /> */}
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={12}>
              <TitleOpinionsTaps />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  ) : (
    <CircularProgress size={80} disableShrink color="secondary" />
  );
}
