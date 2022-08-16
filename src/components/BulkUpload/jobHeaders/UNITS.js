import { copy } from "components/Shared/functions";
import { addAfterLabel, removeByLabel } from "./helper";
import SHAPEOWNER from "./SHAPEOWNER";

const fields = JSON.parse(JSON.stringify(SHAPEOWNER))
fields.splice(SHAPEOWNER.length-1,1)


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
    ...copy(fields),
    {
        label: "Tags",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.tags"
    },
];

removeByLabel(unit, 'Shape Type')
removeByLabel(unit, 'Shape Name')

unit.forEach((row) => {
    row.label = row.label.replace('Shape', 'Unit')
})

addAfterLabel(unit, 'Unit Id', {
    label: "Unit Name",
    mapped_key: "",
    required: true,
    actual_key: "shape.name",
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

addAfterLabel(unit, 'Unit Pricing', {
    label: "Unit Campaign",
    mapped_key: "",
    actual_key: "shape.campaignName",
})

addAfterLabel(unit, 'Unit Campaign', {
    label: "Qualifier",
    mapped_key: "",
    actual_key: "shape.qualifier",
})

addAfterLabel(unit, 'Qualifier', {
    label: "Description",
    mapped_key: "",
    actual_key: "shape.description",
})

addAfterLabel(unit, 'Overriding Royalty', {
    label: "Net Revenue Interest",
    mapped_key: "",
    actual_key: "shape.nri"
})

export default unit;