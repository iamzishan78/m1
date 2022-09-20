import { copy } from "components/Shared/functions";
import { landColumns } from "./COMMON";
import { addAfterLabel, removeByLabel } from "./helper";
import SHAPEOWNER from "./SHAPEOWNER";

const fields = JSON.parse(JSON.stringify(SHAPEOWNER))
fields.splice(SHAPEOWNER.length - 1, 1)


const unit = [
    ...copy(landColumns),
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
    label: "Current Operator",
    mapped_key: "",
    required: true,
    actual_key: "shape.uPrimaryOperator",
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