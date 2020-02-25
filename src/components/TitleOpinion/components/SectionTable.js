import React, { useContext, useState, useEffect } from "react";
import { TitleOpinionContext } from "../TitleOpinionContext";
import ReactDataGrid from "react-data-grid-m1n-version";
import { range } from "lodash";
import "react-data-grid-m1n-version/dist/react-data-grid.css";

const defaultParsePaste = str =>
  str.split(/\r\n|\n|\r/).map(row => row.split("\t"));

export default function SectionTable(props) {
  const [stateTitleOpinion, setStateTitleOpinion] = useContext(
    TitleOpinionContext
  );

  /////////////////////cells width//////////
  const formatColumns = data => {
    const gridWidth = parseInt(document.querySelector("#root").clientWidth, 10); //selector for grid
    let combinedColumnWidth = 0;

    for (let i = 0; i < data.columns.length; i++) {
      data.columns[i].width = getTextWidth(data, i);
      combinedColumnWidth += data.columns[i].width;
    }

    if (combinedColumnWidth < gridWidth) {
      data.columns = distributeRemainingSpace(
        combinedColumnWidth,
        data.columns,
        gridWidth
      );
    }

    return data;
  };

  const getTextWidth = (data, i) => {
    const rowValues = [];
    const reducer = (a, b) => (a ? a.length : 0 > b ? b.length : 0 ? a : b);
    const cellPadding = 16;
    const arrowWidth = 18;
    let longestCellData,
      longestCellDataWidth,
      longestColName,
      longestColNameWidth,
      longestString;

    for (let row of data.rows) {
      rowValues.push(row[data.columns[i].key]);
    }

    longestCellData = rowValues.reduce(reducer);
    longestColName = data.columns[i].name;
    longestCellDataWidth = Math.ceil(
      getCanvas().measureText(longestCellData).width
    );
    longestColNameWidth =
      Math.ceil(getCanvas("bold ").measureText(longestColName).width) +
      arrowWidth;

    longestString = Math.max(longestCellDataWidth, longestColNameWidth);

    return longestString + cellPadding;
  };

  const getCanvas = (fontWeight = "") => {
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvasContext = canvas.getContext("2d");
    }
    canvasContext.font = `${fontWeight}16px sans-serif`;

    return canvasContext;
  };

  const distributeRemainingSpace = (
    combinedColumnWidth,
    columns,
    gridWidth
  ) => {
    const spaceLeftOver = gridWidth - combinedColumnWidth;
    const remainder = spaceLeftOver % columns.length;
    const equalSpaceLeft = spaceLeftOver - remainder;

    columns[0].width += remainder; //any remaining space after distributing equally should go on first column

    for (let col of columns) {
      col.width += equalSpaceLeft / columns.length;
    }
    return columns;
  };
  //////////////////////////////////////////

  let dataSec = { ...formatColumns(props.sectionData) };
  let columns = dataSec.columns;
  let rows = dataSec.rows;

  const [stateSectionTable, setStateSectionTable] = useState({
    rows,
    columns,
    topLeft: {},
    botRight: {},
    pasting: false
  });

  useEffect(() => {
    let dataSec = { ...formatColumns(props.sectionData) };
    let columns = dataSec.columns;
    let rows = dataSec.rows;

    setStateSectionTable({ ...stateSectionTable, columns, rows });
  }, [
    stateTitleOpinion.TOData.MORSections,
    stateTitleOpinion.TOData.runsheetSections
  ]);

  useEffect(() => {
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return function cleanup() {
      removeAllListeners();
    };
  });

  const removeAllListeners = () => {
    document.removeEventListener("copy", handleCopy);
    document.removeEventListener("paste", handlePaste);
  };

  const rowGetter = i => {
    const { rows } = stateSectionTable;
    return rows[i];
  };

  const updateRows = (startIdx, newRows) => {
    setStateTitleOpinion(stateTitleOpinion => {
      const rows = stateSectionTable.rows.slice();

      for (let i = 0; i < newRows.length; i++) {
        if (startIdx + i < rows.length) {
          rows[startIdx + i] = { ...rows[startIdx + i], ...newRows[i] };
        }
      }

      const tempSections = [
        ...(props.MOR
          ? stateTitleOpinion.TOData.MORSections
          : stateTitleOpinion.TOData.runsheetSections)
      ];
      tempSections[props.sectionNumber] = {
        ...tempSections[props.sectionNumber],
        rows
      };

      return {
        ...stateTitleOpinion,
        edited: true,
        TOData: {
          ...stateTitleOpinion.TOData,
          [props.MOR ? "MORSections" : "runsheetSections"]: [...tempSections]
        }
      };
    });
  };

  const handleCopy = e => {
    if (
      stateTitleOpinion.lastClickedSection ===
      props.sectionData.name + props.sectionNumber
    ) {
      console.debug("handleCopy Called");
      e.preventDefault();
      const { topLeft, botRight } = stateSectionTable;

      // Loop through each row
      const text = range(topLeft.rowIdx, botRight.rowIdx + 1)
        .map(
          // Loop through each column
          rowIdx =>
            stateSectionTable.columns
              .slice(topLeft.colIdx, botRight.colIdx + 1)
              .map(
                // Grab the row values and make a text string
                col => rowGetter(rowIdx)[col.key]
              )
              .join("\t")
        )
        .join("\n");
      console.debug("text", text);
      e.clipboardData.setData("text/plain", text);
    }
  };

  const handlePaste = e => {
    if (
      stateTitleOpinion.lastClickedSection ===
      props.sectionData.name + props.sectionNumber
    ) {
      console.debug("handlePaste Called");
      e.preventDefault();

      setStateSectionTable(stateSectionTable => {
        return { ...stateSectionTable, pasting: true };
      });
      const { topLeft } = stateSectionTable;

      const newRows = [];
      const pasteData = defaultParsePaste(
        e.clipboardData.getData("text/plain")
      );

      console.debug("pasteData", pasteData);

      pasteData.forEach(row => {
        const rowData = {};
        // Merge the values from pasting and the keys from the columns
        stateSectionTable.columns
          .slice(topLeft.colIdx, topLeft.colIdx + row.length)
          .forEach((col, j) => {
            // Create the key-value pair for the row
            rowData[col.key] = row[j];
          });
        // Push the new row to the changes
        newRows.push(rowData);
      });

      console.debug("newRows", newRows);

      updateRows(topLeft.rowIdx, newRows);
    }
  };

  const onGridRowsUpdated = ({ fromRow, toRow, updated, action }) => {
    console.debug("onGridRowsUpdated!", action);
    console.debug("updated", updated);
    if (action !== "COPY_PASTE") {
      setStateTitleOpinion(stateTitleOpinion => {
        let rigthUpdate = {};
        for (let key in updated) {
          rigthUpdate = {
            ...rigthUpdate,
            [`id${stateSectionTable.topLeft.colIdx}`]: updated[key]
          };
        }

        const rows = stateSectionTable.rows.slice();

        rows[stateSectionTable.topLeft.rowIdx] = {
          ...rows[stateSectionTable.topLeft.rowIdx],
          ...rigthUpdate
        };

        const tempSections = [
          ...(props.MOR
            ? stateTitleOpinion.TOData.MORSections
            : stateTitleOpinion.TOData.runsheetSections)
        ];
        tempSections[props.sectionNumber] = {
          ...tempSections[props.sectionNumber],
          rows
        };

        return {
          ...stateTitleOpinion,
          edited: true,
          TOData: {
            ...stateTitleOpinion.TOData,
            [props.MOR ? "MORSections" : "runsheetSections"]: [...tempSections]
          }
        };
      });
    }
  };

  const setSelection = args => {
    setStateSectionTable({
      ...stateSectionTable,
      topLeft: {
        rowIdx: args.topLeft.rowIdx,
        colIdx: args.topLeft.idx
      },
      botRight: {
        rowIdx: args.bottomRight.rowIdx,
        colIdx: args.bottomRight.idx
      }
    });
  };

  return (
    <div>
      <ReactDataGrid
        columns={stateSectionTable.columns}
        rowGetter={i => stateSectionTable.rows[i]}
        rowsCount={stateSectionTable.rows.length}
        onGridRowsUpdated={onGridRowsUpdated}
        enableCellSelect
        enableCellAutoFocus={false}
        minColumnWidth={40}
        minHeight={stateSectionTable.rows.length * 35 + 59}
        cellRangeSelection={{
          onComplete: setSelection
        }}
      />
    </div>
  );
}
