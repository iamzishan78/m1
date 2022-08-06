import { copy } from "components/Shared/functions";
import Agreement from "./AGREEMENT_SHAPE";
import { landColumns } from "./COMMON";
import { removeByLabel } from "./helper";

let agreementsColumns = copy(Agreement)
agreementsColumns = removeByLabel(agreementsColumns, 'State')
agreementsColumns = removeByLabel(agreementsColumns, 'County')
agreementsColumns.forEach((column) => {
    column.actual_key = `shape.${column.actual_key}`
})

const AgreementHeader = [
    ...copy(landColumns),
    ...agreementsColumns,
    {
        label: "Comments",
        mapped_key: "",
        required: false,
        actual_key: "comment"
    },
    {
        label: "Tags",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.tags"
    },

];
export default AgreementHeader;