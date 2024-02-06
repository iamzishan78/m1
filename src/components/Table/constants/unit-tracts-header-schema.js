import { history } from "store";
import { GlobalStickyStyles } from "GlobalSettings";

import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
const UnitTractHeadCells = [
  {
    name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
  },
  {
    name: "name", label: "Name", options: {
      sort: true,
      filter: true,
      ...GlobalStickyStyles({
        setCellProps: {
          left: '77px',
          padding: "0px 25px 0px 35px"
        },
        setCellHeaderProps: {
          left: '77px',
        }
      }),
      customRender: (value, tableMeta) => {
        const splitNumber = typeof value === "string" ? value?.split("_") : value;
        return <ColumnWithLink
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/map/parcels/${tableMeta.rowData[2]}`, { showTractsBreadcrumb: !true });
          }}
          value={splitNumber?.[0] ? `${splitNumber?.[0]}` : tableMeta?.rowData[3]}
          link={`/map/parcels/${tableMeta.rowData[2]}`}
        />;
      },
    }
  },
  {
    name: "parcelId",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      empty: false,
      viewColumns: false,
    },
  },
  {
    name: "state", label: "State", esKey: 'state.keyword', options: { sort: true, filter: true }, style: { maxWidth: 70 }
  },
  {
    name: "county", label: "County", esKey: 'county.keyword', options: { sort: true, filter: true }
  },
  {
    name: "meridian", label: "Meridian", esKey: 'meridian.keyword', options: { sort: true, filter: true }
  },
  {
    name: "township", label: "Township", esKey: 'township.keyword', options: { sort: true, filter: true }
  },
  {
    name: "range", label: "Range", esKey: 'range.keyword', options: { sort: true, filter: true }
  },
  {
    name: "section", label: "Section", esKey: 'section.keyword', options: { sort: true, filter: true }
  },
  {
    name: "altSurvey", label: "Alt Survey", esKey: 'altSurvey.keyword', options: { sort: true, filter: true }, style: { minWidth: 200, maxWidth: 300 }
  },
  {
    name: "legalDescription", label: "Full Legal Description", esKey: 'legalDescription.keyword', options: { sort: true, filter: true }
  },
  {
    name: "shapeArea", label: "Tract Calc. Acres", esKey: 'shapeArea', options: { sort: true, filter: true }
  },
  {
    name: "sdGrossAcres", label: "Tract Gross Acres", esKey: 'sdGrossAcres', options: { sort: true, filter: true }
  },
  {
    name: "unitTractId", label: "Unit Tract ID", esKey: 'unitTractId', options: { sort: true, filter: true }
  },
  {
    name: "uAcres", label: "Unit Tract Acres", esKey: 'uAcres', options: { sort: true, filter: true }
  },
];

export default UnitTractHeadCells;