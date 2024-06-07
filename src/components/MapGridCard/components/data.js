import LeaseIcon from "components/Shared/svgIcons/lease";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import UnitIcon from "components/Shared/svgIcons/unit";
import FolderIcon from "@material-ui/icons/Folder";
import OperatorIcon from "components/Shared/svgIcons/operator";
import TaxOwnerIcon from "@material-ui/icons/AccountBalance";
import LayersIcon from "@material-ui/icons/Layers";
import LocationOnIcon from "@material-ui/icons/LocationOn";

export const platformDataWellsInitialData = [
  { index: 0, value: 'well', Icon: WellIcon, label: 'Wells', shapeGrid: true },
  { index: 1, value: 'owner', Icon: TaxOwnerIcon, label: 'Tax Owners', shapeGrid: true },
  {
    index: 2,
    value: 'operator',
    Icon: OperatorIcon,
    label: 'Operators',
    shapeGrid: true,
  },
  {
    index: 3,
    value: 'places',
    Icon: LocationOnIcon,
    label: 'Places',
    shapeGrid: true,
  },
];

export const platformDataInitialData = [
  ...platformDataWellsInitialData,

  { index: 3, value: "layer", Icon: LayersIcon, label: "Layer", isLayer: true },
  // { index: 3, value: "lease", Icon: LeaseIcon, label: "Leases" },
  { index: 4, value: "landgrid", Icon: LeaseIcon, label: "Land Grid", shapeGrid: false, featureFlag: 'LANDGRIDSEARCH' },
  // { index: 4, value: "contacts", Icon: ContactIcon, label: "Contacts", shapeGrid: false },
];


export const userDefinedInitialData = [
  { index: 7, value: "agreement", Icon: FolderIcon, label: "Agreements", mapGrid: false, featureFlag: 'AGREEMENT_LAYER' },
  { index: 8, value: "tract", Icon: TractIcon, label: "Tracts", mapGrid: false },
  { index: 9, value: "unit", Icon: UnitIcon, label: "Units", mapGrid: true },
  // { index: 4, value: "contacts", Icon: ContactIcon, label: "Contacts" },
];

export const snapGridSideBarData = [
  ...userDefinedInitialData
];