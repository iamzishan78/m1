import { useContext, useState, useEffect } from 'react';
import { useLazyQuery } from "@apollo/client";

import { AppContext } from "../../../../../AppContext";
import { SHAPEWELLS } from "../../../../../graphQL/useQueryShapeWells";
import { WELLSQUERY } from "../../../../../graphQL/useQueryWells";
import { COMMENTSCOUNTER } from "../../../../../graphQL/useQueryCommentsCounter";
import { TAGSAMPLES } from "../../../../../graphQL/useQueryTagSamples";

const UeGridWells = (
  setTargetLabel,
  setHeader,
  setAddAble,
  setLoading,
) => {
  const [stateApp, setStateApp] = useContext(AppContext);

  const fetchPolicy = "cache-and-network";
  const [getShapeWells, { data: dataShapeWells }] = useLazyQuery(SHAPEWELLS);
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER, { fetchPolicy });
  const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, { fetchPolicy });

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  ////////////Grid Wells begin///////////////////////////////////////////////
  getShapeWells(stateApp.polygonString);
  setTargetLabel("well");
  setHeader("Wells");
  setAddAble(false);

  useEffect(() => {
    if (dataShapeWells && dataShapeWells.getShapeWells) {
      console.log("ue mintable 27"); // TODO
      if (dataShapeWells.getShapeWells.length !== 0) {
        console.log("dataShapeWells.getShapeWells", dataShapeWells.getShapeWells);
        const shapeWellIdArray = dataShapeWells.getShapeWells.map(a => a.Id);
        console.log("shapeWellIdArray", shapeWellIdArray);

        getWells({
          variables: {
            wellIdArray: shapeWellIdArray,
          },
        });
        getCommentsCounter({
          variables: {
            objectsIdsArray: shapeWellIdArray,
            userId: stateApp.user.mongoId,
          },
        });
        getTagSamples({
          variables: {
            objectsIdsArray: shapeWellIdArray,
            userId: stateApp.user.mongoId,
          },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataShapeWells]);

  /*useEffect(() => {
    if (dataWells?.wells)
      if (props.parent && props.parent === "gridWells" && dataWells) {
        console.log("ue mintable 28");
        if (
          dataWells.wells &&
          dataWells.wells.results &&
          dataWells.wells.results.length > 0 &&
          dataCommentsCounter &&
          dataCommentsCounter.commentsCounter &&
          dataTagSamples &&
          dataTagSamples.tagSamples
        ) {
          let wells = [...dataWells.wells.results];
          wells = wells.map((w) => {
            let well = { ...w };

            //// temporary to fix the ticks dates fields comming from the rest api
            if (well.permitApprovedDate && well.permitApprovedDate != "null")
              well.permitApprovedDate = ticksToDateString(
                well.permitApprovedDate
              );
            if (well.spudDate && well.spudDate != "null")
              well.spudDate = ticksToDateString(well.spudDate);
            if (well.completionDate && well.completionDate != "null")
              well.completionDate = ticksToDateString(well.completionDate);
            if (well.firstProductionDate && well.firstProductionDate != "null")
              well.firstProductionDate = ticksToDateString(
                well.firstProductionDate
              );
            //// temporary end

            well.isTracked = true;
            well.commentsCounter = 0;
            well.tags = [[], 0];

            well.coordinates = {};
            if (well.Longitude && well.Latitude)
              well.coordinates.center = [well.Longitude, well.Latitude];
            if (well.longitude && well.latitude)
              well.coordinates.center = [well.longitude, well.latitude];

            for (
              let i = 0;
              i < dataCommentsCounter.commentsCounter.length;
              i++
            ) {
              if (well.id === dataCommentsCounter.commentsCounter[i]._id) {
                well.commentsCounter =
                  dataCommentsCounter.commentsCounter[i].total;
                break;
              }
            }
            for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
              if (well.id === dataTagSamples.tagSamples[i]._id) {
                well.tags = [
                  dataTagSamples.tagSamples[i].tags,
                  dataTagSamples.tagSamples[i].total,
                ];

                break;
              }
            }
            return well;
          });

          let availableTags = [];
          dataTagSamples.tagSamples.map((sample) => {
            availableTags = [...availableTags, ...sample.tags];
          });
          const cleanAvailableTags = [...new Set(availableTags)];

          setRows(wells);

          const flyToColumn = {
            name: "coordinates",
            label: " ",
            options: {
              filter: false,
              sort: false,
              searchable: false,
              download: false,
              print: false,
              viewColumns: false,
            },
          };

          setColumns([
            ...(cleanAvailableTags.length > 0
              ? WellsHeadCells.map((column) => {
                  if (column.name === "tags") {
                    return {
                      ...column,
                      options: {
                        ...column.options,
                        filterOptions: {
                          ...column.options.filterOptions,
                          names: cleanAvailableTags,
                        },
                      },
                    };
                  }
                  return column;
                })
              : WellsHeadCells.map((column) => {
                  if (column.name === "tags") {
                    return {
                      ...column,
                      options: {
                        ...column.options,
                        filter: false,
                      },
                    };
                  }
                  return column;
                })),
            flyToColumn,
          ]);

          setStateApp((state) => ({
            ...state,
            trackedwells: wells,
          }));
          setLoading(false);
        } else {
          if (
            dataWells.wells &&
            dataWells.wells.results &&
            dataWells.wells.results.length === 0
          ) {
            setRows([]);
            setLoading(false);
          }
        }
      }
  }, [dataWells, dataTagSamples, dataCommentsCounter]);*/
  ////////////Grid Wells end///////////////////////////////////////////////
  
  return {
    columns,
    rows,
  };
};

export default UeGridWells;