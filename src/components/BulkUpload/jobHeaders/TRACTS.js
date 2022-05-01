import { addAfterLabel } from "./helper";

const PARCELINTERESTS_FIELDS = require("./PARCELINTERESTS").default

const tracts = [
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
    ...PARCELINTERESTS_FIELDS
];

addAfterLabel(tracts, 'Parcel Name', {
    label: "Parcel Description",
    mapped_key: "",
    actual_key: "shape.description",
})


tracts.find((key) => key.actual_key === 'entityDetail.state').label = 'AddressState'

export default tracts