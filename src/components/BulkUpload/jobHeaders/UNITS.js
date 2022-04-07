import { addAfterLabel, removeByLabel } from "./helper";
import SHAPEOWNER from "./SHAPEOWNER";

const unit = [
    {
        label: "State",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level1Type.State",
    },
    {
        label: "County",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level2Type.County",
    },
    {
        label: "TXGrid Survey",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level3Type.Survey",
    },
    {
        label: "TXGrid Block",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level4Type.Block",
    },
    {
        label: "TXGrid Section",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level5Type.Section",
    },
    {
        label: "TXGrid Abstract",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level6Type.Abstract",
    },
    {
        label: "PLSS Meridian",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level3Type.Meridian",
    },
    {
        label: "PLSS Township",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level4Type.Township",
    },
    {
        label: "PLSS Range",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level4Type.Range",
    },
    {
        label: "PLSS Township/Range",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level5Type.TownshipRange",
    },
    {
        label: "PLSS Section",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level6Type.Section",
    },
    {
        label: "LandGridGeom Id",
        mapped_key: "",
        required: true,
        actual_key: "landgrid._id",
    },
    {
        label: "LandGridGeom Name",
        mapped_key: "",
        required: true,
        actual_key: "landgrid.name",
    },
    ...SHAPEOWNER,
    {
        label: "Unit Number",
        mapped_key: "",
        required: true,
        actual_key: "landgrid.name",
    },
    {
        label: "Unit Acres",
        mapped_key: "",
        required: true,
        actual_key: "landgrid.name",
    },
    {
        label: "Unit Pricing",
        mapped_key: "",
        required: true,
        actual_key: "landgrid.name",
    },
];

removeByLabel(unit, 'Shape Type')
removeByLabel(unit, 'Shape Name')

unit.forEach((row) => {
    row.label.replace('Shape', 'Unit')
})

addAfterLabel(unit, 'Unit Id', {
    label: "Unit Name",
    mapped_key: "",
    required: true,
    actual_key: "shape.uName",
})

addAfterLabel(unit, 'Unit Name', {
    label: "Unit Number",
    mapped_key: "",
    required: true,
    actual_key: "shape.uNumber",
})

addAfterLabel(unit, 'Unit Number', {
    label: "Unit Acres",
    mapped_key: "",
    required: true,
    actual_key: "shape.uAcres",
})

addAfterLabel(unit, 'Unit Acres', {
    label: "Unit Pricing",
    mapped_key: "",
    required: true,
    actual_key: "shape.uUnitPricing",
})

export default unit;